import { PageSection, PageSectionVariants, Panel, TextContent, Text } from '@patternfly/react-core';
import React from 'react';
import ClustersTable from './components/ClustersTable';
import ClustersTableToolbar from './components/ClustersTableToolbar';
import { parseAsArrayOf, parseAsString, parseAsStringEnum, parseAsBoolean, useQueryStates } from 'nuqs';
import { CloudProvider, ClusterStates } from '@app/types/types';
import { useLocation } from 'react-router-dom';
import { FilterCategory } from './types';

const filterParams = {
  status: {
    ...parseAsStringEnum<ClusterStates>(Object.values(ClusterStates)),
    defaultValue: null as ClusterStates | null,
  },
  provider: parseAsArrayOf(parseAsStringEnum<CloudProvider>(Object.values(CloudProvider))).withDefault([]),
  search: parseAsString.withDefault(''),
  filterCategory: parseAsStringEnum<FilterCategory>(['accountName', 'clusterName']).withDefault('clusterName'),
  archived: parseAsBoolean.withDefault(false),
};

const Clusters: React.FunctionComponent = () => {
  const location = useLocation();
  const [{ status, provider, search, filterCategory, archived }, setQuery] = useQueryStates(filterParams);

  // React to URL changes
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newArchived = params.get('archived') === 'true';

    if (archived !== newArchived) {
      setQuery({
        archived: newArchived,
        status: null,
        provider: [],
      });
    }
  }, [location.search, archived, setQuery]);

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Clusters {archived ? '- History' : '- Active'}</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <ClustersTableToolbar
            filterCategory={filterCategory}
            setFilterCategory={value => setQuery({ filterCategory: value })}
            filterValue={search}
            setFilterValue={value => setQuery({ search: value })}
            statusSelection={status}
            setStatusSelection={value => setQuery({ status: value })}
            providerSelections={provider}
            setProviderSelections={value => setQuery({ provider: value || [] })}
            archived={archived}
          />
          <ClustersTable
            filterCategory={filterCategory}
            filterValue={search}
            statusFilter={status}
            providerSelections={provider}
            archived={archived}
          />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Clusters;
