````markdown
# Plan: Semantic cluster status filters (`active` vs raw DB statuses)

## 0. TL;DR for Cursor

Goal:  
Let the `/clusters` list endpoint support a semantic status filter like:

- `status=Terminated` → direct DB filter (as today)
- `status=active` → _business_ filter = all clusters where `status != 'Terminated'` (or equivalently: `status IN ('Running','Stopped')`)

**Without:**

- rewriting `db_client`
- introducing full AIP-160 DSL
- putting SQL or business logic into handlers.

We will:

1. Introduce a small `FilterExpr` abstraction in `models`.
2. Extend `ListOptions` with `AdvancedFilters []FilterExpr`.
3. Teach `SelectWithContext` / `SelectBuilder` how to emit simple operators (`=`, `!=`, `IN`) from `AdvancedFilters`.
4. In `ClusterService.List`, translate semantic `status` values (like `"active"`) into `AdvancedFilters`.
5. Keep handlers “dumb” (they just parse query params into filter DTOs).

---

## 1. Context / Current state

- `/clusters` handler builds a `models.ListOptions`:

  ```go
  opts := models.ListOptions{
      PageSize: req.PageSize,
      Offset:   (req.Page - 1) * req.PageSize,
      Filters:  req.Filters.toRepoFilters(), // map[string]interface{}
  }
  ```
````

- `ClusterService.List` just forwards `ListOptions` to the repository:

  ```go
  func (s *clusterServiceImpl) List(ctx context.Context, options models.ListOptions) ([]db.ClusterDBResponse, int, error) {
      return s.repo.ListClusters(ctx, options)
  }
  ```

- `ClusterRepository.ListClusters` uses `db_client.SelectWithContext`:

  ```go
  if err := r.db.SelectWithContext(ctx, &clusters, SelectClustersFullMView, opts, "cluster_id", "*"); err != nil {
      ...
  }
  ```

- `db_client.SelectWithContext` builds SQL with `SelectBuilder`, which currently supports only `field = $N` from `opts.Filters` (no `IN`, no `!=`, no OR).

Result: We can do `status = 'Terminated'`, но не можем выразить “active = все, кроме Terminated” без raw SQL-хака.

---

## 2. Problem statement

Product/UI хочет:

- фильтр “Terminated” — только Terminated
- фильтр “Active” — “все, что не Terminated”

Архитектурные требования:

- “Active” — **бизнес-логика**, не SQL-константа.
- Handler не должен знать, что именно значит “active”.
- Repository/db_client не должны знать о semantic категориях (“active”), только о конкретных колонках и операторах.
- Хотим решение, которое легко расширяется (потом можно добавить `idle`, `unhealthy`, и т.п.).

---

## 3. Design goals / non-goals

### Goals

- Добавить поддержку простых семантических фильтров по статусу кластеров (сначала — `active`).
- Сохранить существующий контракт `/clusters?status=...`.
- Не ломать/рефакторить `db_client` радикально.
- Сохранить хорошую тестируемость:
  - бизнес-логика — тесты на сервис;
  - SQL-генерация — тесты на db_client / repository.

### Non-goals (в этом PR)

- Не внедряем полный AIP-160 DSL.
- Не трогаем другие ресурсные фильтры (instances, accounts и т.д.).
- Не меняем схему БД / представления.

---

## 4. High-level design

Вводим минимальную абстракцию “расширенных фильтров”:

- `ListOptions` получает поле `AdvancedFilters []FilterExpr`.
- `FilterExpr` описывает **один** атомарный фильтр:
  - `field` — имя колонки / поля во `m_clusters_full_view`;
  - `op` — простой оператор (`=`, `!=`, `IN`);
  - `value` — одиночное значение или список значений.

Поток:

1. **Handler** парсит query params как сейчас (`status`, `provider`, …) → `listClustersRequest`.
2. **Service.List**:
   - анализирует `req.Filters.Status`;
   - если `Status == "active"`, не кладёт это в `Filters["status"]`, а создаёт `FilterExpr`:
     - либо `status != 'Terminated'`,
     - либо `status IN ('Running', 'Stopped')` (решим в этом плане).

   - записывает `FilterExpr` в `options.AdvancedFilters`.

3. **Repository.ListClusters** передаёт `ListOptions` в `db_client.SelectWithContext` без изменений.
4. **db_client.SelectWithContext**:
   - как и раньше, обрабатывает `opts.Filters` → `field = $N`;
   - добавляет цикл по `opts.AdvancedFilters` и вызывает на `SelectBuilder` новые методы `WhereIn`, `WhereNe`, и т.д.

5. `SelectBuilder.Build()` строит финальный SQL с учётом новых условий.

Таким образом:

- semantic → service;
- SQL-операторы → db_client / builder;
- repository остаётся тонким над db_client, но может позже использовать `FilterExpr` для более сложных кейсов.

---

## 5. Detailed implementation steps

### Step 1 — Расширить `models.ListOptions` и ввести `FilterExpr`

**File:** `internal/models/list_options.go` (или где он сейчас определён)

1. Добавить тип `Operator`:

   ```go
   type Operator string

   const (
       OpEq Operator = "="
       OpNe Operator = "!="
       OpIn Operator = "IN"
       // можно оставить только те, которые реально используются
   )
   ```

2. Добавить тип `FilterExpr`:

   ```go
   type FilterExpr struct {
       Field string
       Op    Operator
       // Value:
       //   - for OpEq / OpNe: single scalar (string, int, etc.)
       //   - for OpIn: slice ([]string, []int, etc.)
       Value interface{}
   }
   ```

3. Добавить поле в `ListOptions`:

   ```go
   type ListOptions struct {
       PageSize int
       Offset   int
       Filters  map[string]interface{}

       // New:
       AdvancedFilters []FilterExpr
   }
   ```

> Cursor: только добавить поля и типы, без использования на этом шаге.

---

### Step 2 — Добавить поддержку `AdvancedFilters` в db_client.SelectWithContext

**File:** `internal/db_client/db_client.go`

В методе:

```go
func (d *DBClient) SelectWithContext(ctx context.Context, dest interface{}, table string, opts models.ListOptions, orderColumn string, columns ...string) error
```

Сейчас он:

- создаёт `builder := d.NewSelectBuilder(columns...).From(table)`
- итерируется по `opts.Filters`
- добавляет `WHERE field = $N`
- применяет пагинацию и т.д.

Нужно:

1. После обработки `opts.Filters` добавить цикл по `opts.AdvancedFilters`:

   Псевдокод:

   ```go
   for _, f := range opts.AdvancedFilters {
       switch f.Op {
       case models.OpEq:
           builder = builder.Where(fmt.Sprintf("%s = $%d", f.Field, len(builder.args)+1), f.Value)
       case models.OpNe:
           builder = builder.Where(fmt.Sprintf("%s != $%d", f.Field, len(builder.args)+1), f.Value)
       case models.OpIn:
           // Value expected as []T (e.g. []string)
           // Delegate to helper on SelectBuilder (see Step 3).
           builder = builder.WhereIn(f.Field, f.Value)
       }
   }
   ```

   _Важно:_ Чистую реализацию `WhereIn` делаем в Step 3, здесь только вызов.

2. Логика пагинации/ORDER BY остаётся как есть.

> Cursor: аккуратно использовать `len(builder.args)` для вычисления `$N`. Не ломать текущую логику.

---

### Step 3 — Расширить `SelectBuilder` (`select_builder.go`)

**File:** `internal/db_client/select_builder.go`

Сейчас в `SelectBuilder` уже есть:

- `Where(condition string, args ...interface{})`
- `Build()`, который собирает `WHERE cond1 AND cond2 AND …`.

Добавляем:

1. Метод `WhereIn`:

   ```go
   func (b *SelectBuilder) WhereIn(field string, values interface{}) *SelectBuilder {
       // Ожидаем slice: []string, []int, etc.
       v := reflect.ValueOf(values)
       if v.Kind() != reflect.Slice {
           // можно залогировать ошибку, но для простоты — паника или noop с логом
           return b
       }

       // placeholders: $N, $N+1, ...
       placeholders := make([]string, v.Len())
       for i := 0; i < v.Len(); i++ {
           b.args = append(b.args, v.Index(i).Interface())
           placeholders[i] = fmt.Sprintf("$%d", len(b.args))
       }

       cond := fmt.Sprintf("%s IN (%s)", field, strings.Join(placeholders, ","))
       b.where = append(b.where, cond)
       return b
   }
   ```

   Если не хочется тащить `reflect`, можно ограничиться конкретным типом (`[]string`), но тогда потребуются приведения типов.

2. При необходимости — простой helper для `!=`, если не хочется делать это в db_client; но можно обойтись обычным `Where` с `fmt.Sprintf("%s != $%d", ...)`.

> Cursor: следи за тем, чтобы `Build()` не менялся по семантике — он просто собирает `WHERE` с `AND`.

---

### Step 4 — Добавить бизнес-логику статуса в `ClusterService.List`

**File:** `internal/services/cluster_service.go`

1. Сейчас:

   ```go
   func (s *clusterServiceImpl) List(ctx context.Context, options models.ListOptions) ([]db.ClusterDBResponse, int, error) {
       return s.repo.ListClusters(ctx, options)
   }
   ```

2. Нужно:
   - либо добавить новый слой, который оборачивает `options`,
   - либо расширить `List` так, чтобы он умел “нормализовать” статус.

   Предлагаемый подход:
   - В handler мы продолжаем использовать `Filters["status"]` для raw-статуса (Running, Stopped, Terminated, …).
   - Для `status=active` — будем использовать **особую семантику**: сервис удалит `Filters["status"]` и сформирует `AdvancedFilters`.

   Пример логики:

   ```go
   func (s *clusterServiceImpl) List(ctx context.Context, options models.ListOptions) ([]db.ClusterDBResponse, int, error) {
       options = s.normalizeClusterFilters(options)
       return s.repo.ListClusters(ctx, options)
   }
   ```

   Где `normalizeClusterFilters`:

   ```go
   func (s *clusterServiceImpl) normalizeClusterFilters(opts models.ListOptions) models.ListOptions {
       // Case 1: no status filter at all → nothing to do
       raw, ok := opts.Filters["status"]
       if !ok {
           return opts
       }

       statusStr, ok := raw.(string)
       if !ok {
           return opts
       }

       // Semantic status: "active"
       if statusStr == "active" {
           // remove raw equality filter
           delete(opts.Filters, "status")

           // Option A: != 'Terminated'
           opts.AdvancedFilters = append(opts.AdvancedFilters, models.FilterExpr{
               Field: "status",
               Op:    models.OpNe,
               Value: "Terminated",
           })

           // Option B (альтернатива): IN ('Running', 'Stopped')
           // opts.AdvancedFilters = append(opts.AdvancedFilters, models.FilterExpr{
           //     Field: "status",
           //     Op:    models.OpIn,
           //     Value: []string{"Running", "Stopped"},
           // })

           return opts
       }

       // Any other status value → treated as raw DB value, keep as-is
       return opts
   }
   ```

> Cursor: реализуй helper-функцию близко к этому псевдокоду, включая удаление `Filters["status"]` для “active”.

---

### Step 5 — Handler остаётся "тупым"

**File:** `internal/api/handlers/cluster_handler.go`

Здесь **минимальные изменения**:

- `clusterFilterParams.Status` продолжает мапиться в `Filters["status"]` через `toRepoFilters()`.
- Никакой логики про "active" в хэндлере **не добавляем**.

То есть:

```go
type clusterFilterParams struct {
    Status   string `form:"status"`
    Provider string `form:"provider"`
    Region   string `form:"region"`
    Account  string `form:"account"`
}

func (f *clusterFilterParams) toRepoFilters() map[string]interface{} {
    filters := make(map[string]interface{})
    if f.Status != "" {
        filters["status"] = f.Status
    }
    ...
    return filters
}
```

Остаётся как есть — всё семантическое преобразование делает сервис.

---

### Step 6 — Repository: минимум изменений

**File:** `internal/repositories/cluster_repository.go`

Здесь, по сути, ничего менять не нужно:

```go
func (r *clusterRepositoryImpl) ListClusters(ctx context.Context, opts models.ListOptions) ([]db.ClusterDBResponse, int, error) {
    var clusters []db.ClusterDBResponse

    if err := r.db.SelectWithContext(ctx, &clusters, SelectClustersFullMView, opts, "cluster_id", "*"); err != nil {
        ...
    }

    return clusters, len(clusters), nil
}
```

Он просто пробрасывает `opts` в db_client.

> Cursor: убедись, что Repository НЕ добавляет свою логику поверх `AdvancedFilters` — всё делает db_client.

---

### Step 7 — Тесты

1. **Unit-тесты для `normalizeClusterFilters`:**
   - `status` отсутствует → `AdvancedFilters` пуст, `Filters` не трогаются.
   - `status = "Terminated"` → `Filters["status"]` остаётся, `AdvancedFilters` пуст.
   - `status = "active"`:
     - `Filters["status"]` удалён;
     - в `AdvancedFilters` есть `FilterExpr{Field: "status", OpNe, "Terminated"}` (или IN-вариант).

2. **Unit-тесты для `SelectBuilder.WhereIn` / обработки `AdvancedFilters`:**
   - `FilterExpr{Field: "status", OpNe, "Terminated"}` → SQL содержит `status != $1`.
   - `FilterExpr{Field: "status", OpIn, []string{"Running","Stopped"}}` → SQL содержит `status IN ($1,$2)` с правильным порядком `args`.

3. **Интеграционный тест для `ClusterRepository.ListClusters` с in-memory DB / тестовой БД:**
   - вставить несколько кластеров с разными статусами;
   - запросить с `status=active` через сервис/репозиторий;
   - убедиться, что Terminated не возвращаются.

---

## 6. Open questions / follow-ups

Не в этом PR, но на будущее:

- Нужно ли вводить отдельный query-параметр `status_group=active` вместо перегруза `status=active`? (Сейчас оставляем как есть для совместимости.)
- Нужно ли в будущем делать полноценный AIP-160-style `filter` string? Наш `FilterExpr` — хороший фундамент для такого DSL.
- Хотим ли мы вынести mapping `"active" → rule` в domain-пакет (`internal/domain/cluster`), если логика статусов усложнится?

---

## 7. Summary

Мы добавляем очень тонкий, но мощный слой:

- `FilterExpr` + `AdvancedFilters` в `ListOptions`;
- минимальное расширение `SelectBuilder` и `SelectWithContext` для операторов `!=` и `IN`;
- одну функцию нормализации фильтров в `ClusterService.List`, где и живёт бизнес-правило `active = !Terminated`.

Это:

- не ломает текущий API,
- не требует переписывать db_client,
- чётко разделяет:
  - **handler** — HTTP/DTO,
  - **service** — бизнес-правила,
  - **repository/db_client** — SQL.

Cursor, можно реализовывать по шагам из этого плана.

```

```
