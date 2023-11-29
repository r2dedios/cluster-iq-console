import {
  PageSection,
  PageSectionVariants,
  Panel,
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  TextContent,
  Text,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  MenuToggle,
  SearchInput,
  Label,
  Spinner,
  Popper,
  ToolbarFilter,
  ToolbarGroup,
  Badge,
  ToolbarToggleGroup,
} from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from "@patternfly/react-table";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getInstances } from "../services/api";
import { Instance, Instances } from "@app/types/types";
import { FilterIcon } from "@patternfly/react-icons";

interface ServersTableProps {
  statusSelection: string;
  providerSelections: string[];
  searchValue: string;
}

interface TableToolbarProps {
  setSearchValue: (value: string) => void;
  searchValue: string;
  setStatusSelection: (value: string) => void;
  statusSelection: string;
  setProviderSelections: (value: string[]) => void;
  providerSelections: string[];
}



const TableToolbar: React.FunctionComponent<TableToolbarProps> = ({
  searchValue,
  setSearchValue,
  setStatusSelection,
  statusSelection,
  setProviderSelections,
  providerSelections,
}) => {
  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // Set up name search input
  const searchInput = (
    <SearchInput
      placeholder="Filter by server name"
      value={searchValue}
      onChange={(_event, value) => onSearchChange(value)}
      onClear={() => onSearchChange("")}
    />
  );

  // Set up name input
  const [isStatusMenuOpen, setIsStatusMenuOpen] =
    React.useState<boolean>(false);
  const statusToggleRef = React.useRef<HTMLButtonElement>(null);
  const statusMenuRef = React.useRef<HTMLDivElement>(null);
  const statusContainerRef = React.useRef<HTMLDivElement>(null);
  const handleStatusMenuKeys = (event: KeyboardEvent) => {
    if (
      isStatusMenuOpen &&
      statusMenuRef.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsStatusMenuOpen(!isStatusMenuOpen);
        statusToggleRef.current?.focus();
      }
    }
  };

  const handleStatusClickOutside = (event: MouseEvent) => {
    if (
      isStatusMenuOpen &&
      !statusMenuRef.current?.contains(event.target as Node)
    ) {
      setIsStatusMenuOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleStatusMenuKeys);
    window.addEventListener("click", handleStatusClickOutside);
    return () => {
      window.removeEventListener("keydown", handleStatusMenuKeys);
      window.removeEventListener("click", handleStatusClickOutside);
    };
  }, [isStatusMenuOpen, statusMenuRef]);

  const onStatusToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setTimeout(() => {
      if (statusMenuRef.current) {
        const firstElement = statusMenuRef.current.querySelector(
          "li > button:not(:disabled)"
        );
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsStatusMenuOpen(!isStatusMenuOpen);
  };

  function onStatusSelect(
    event: React.MouseEvent | undefined,
    itemId: string | number | undefined
  ) {
    if (typeof itemId === "undefined") {
      return;
    }

    setStatusSelection(itemId.toString());
    setIsStatusMenuOpen(!isStatusMenuOpen);
  }

  const statusToggle = (
    <MenuToggle
      ref={statusToggleRef}
      onClick={onStatusToggleClick}
      isExpanded={isStatusMenuOpen}
      style={
        {
          width: "200px",
        } as React.CSSProperties
      }
    >
      Filter by status
    </MenuToggle>
  );

  const statusMenu = (
    <Menu
      ref={statusMenuRef}
      id="attribute-search-status-menu"
      onSelect={onStatusSelect}
      selected={statusSelection}
    >
      <MenuContent>
        <MenuList>
          <MenuItem itemId="Unknown">Unknown</MenuItem>
          <MenuItem itemId="Running">Running</MenuItem>
          <MenuItem itemId="Stopped">Stopped</MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const statusSelect = (
    <div ref={statusContainerRef}>
      <Popper
        trigger={statusToggle}
        triggerRef={statusToggleRef}
        popper={statusMenu}
        popperRef={statusMenuRef}
        appendTo={statusContainerRef.current || undefined}
        isVisible={isStatusMenuOpen}
      />
    </div>
  );

  // Set up provider input
  const [isProviderMenuOpen, setIsProviderMenuOpen] =
    React.useState<boolean>(false);
  const providerToggleRef = React.useRef<HTMLButtonElement>(null);
  const providerMenuRef = React.useRef<HTMLDivElement>(null);
  const providerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleProviderMenuKeys = (event: KeyboardEvent) => {
    if (
      isProviderMenuOpen &&
      providerMenuRef.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsProviderMenuOpen(!isProviderMenuOpen);
        providerToggleRef.current?.focus();
      }
    }
  };

  const handleProviderClickOutside = (event: MouseEvent) => {
    if (
      isProviderMenuOpen &&
      !providerMenuRef.current?.contains(event.target as Node)
    ) {
      setIsProviderMenuOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleProviderMenuKeys);
    window.addEventListener("click", handleProviderClickOutside);
    return () => {
      window.removeEventListener("keydown", handleProviderMenuKeys);
      window.removeEventListener("click", handleProviderClickOutside);
    };
  }, [isProviderMenuOpen, providerMenuRef]);

  const onProviderMenuToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setTimeout(() => {
      if (providerMenuRef.current) {
        const firstElement = providerMenuRef.current.querySelector(
          "li > button:not(:disabled)"
        );
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsProviderMenuOpen(!isProviderMenuOpen);
  };

  function onProviderMenuSelect(
    event: React.MouseEvent | undefined,
    itemId: string | number | undefined
  ) {
    if (typeof itemId === "undefined") {
      return;
    }

    const itemStr = itemId.toString();

    setProviderSelections(
      providerSelections.includes(itemStr)
        ? providerSelections.filter((selection) => selection !== itemStr)
        : [itemStr, ...providerSelections]
    );
  }

  const providerToggle = (
    <MenuToggle
      ref={providerToggleRef}
      onClick={onProviderMenuToggleClick}
      isExpanded={isProviderMenuOpen}
      {...(providerSelections.length > 0 && {
        badge: <Badge isRead>{providerSelections.length}</Badge>,
      })}
      style={
        {
          width: "200px",
        } as React.CSSProperties
      }
    >
      Filter by provider
    </MenuToggle>
  );

  const providerMenu = (
    <Menu
      ref={providerMenuRef}
      id="attribute-search-provider-menu"
      onSelect={onProviderMenuSelect}
      selected={providerSelections}
    >
      <MenuContent>
        <MenuList>
          <MenuItem
            hasCheckbox
            isSelected={providerSelections.includes("AWS")}
            itemId="AWS"
          >
            AWS
          </MenuItem>
          <MenuItem
            hasCheckbox
            isSelected={providerSelections.includes("GCP")}
            itemId="GCP"
          >
            Google Cloud
          </MenuItem>
          <MenuItem
            hasCheckbox
            isSelected={providerSelections.includes("Azure")}
            itemId="Azure"
          >
            Azure
          </MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const providerSelect = (
    <div ref={providerContainerRef}>
      <Popper
        trigger={providerToggle}
        triggerRef={providerToggleRef}
        popper={providerMenu}
        popperRef={providerMenuRef}
        appendTo={providerContainerRef.current || undefined}
        isVisible={isProviderMenuOpen}
      />
    </div>
  );

  // Set up attribute selector
  const [activeAttributeMenu, setActiveAttributeMenu] = React.useState<
    "Servers" | "Status" | "Provider"
  >("Servers");
  const [isAttributeMenuOpen, setIsAttributeMenuOpen] = React.useState(false);
  const attributeToggleRef = React.useRef<HTMLButtonElement>(null);
  const attributeMenuRef = React.useRef<HTMLDivElement>(null);
  const attributeContainerRef = React.useRef<HTMLDivElement>(null);

  const handleAttribueMenuKeys = (event: KeyboardEvent) => {
    if (!isAttributeMenuOpen) {
      return;
    }
    if (
      attributeMenuRef.current?.contains(event.target as Node) ||
      attributeToggleRef.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsAttributeMenuOpen(!isAttributeMenuOpen);
        attributeToggleRef.current?.focus();
      }
    }
  };

  const handleAttributeClickOutside = (event: MouseEvent) => {
    if (
      isAttributeMenuOpen &&
      !attributeMenuRef.current?.contains(event.target as Node)
    ) {
      setIsAttributeMenuOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleAttribueMenuKeys);
    window.addEventListener("click", handleAttributeClickOutside);
    return () => {
      window.removeEventListener("keydown", handleAttribueMenuKeys);
      window.removeEventListener("click", handleAttributeClickOutside);
    };
  }, [isAttributeMenuOpen, attributeMenuRef]);

  const onAttributeToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    setTimeout(() => {
      if (attributeMenuRef.current) {
        const firstElement = attributeMenuRef.current.querySelector(
          "li > button:not(:disabled)"
        );
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsAttributeMenuOpen(!isAttributeMenuOpen);
  };

  const attributeToggle = (
    <MenuToggle
      ref={attributeToggleRef}
      onClick={onAttributeToggleClick}
      isExpanded={isAttributeMenuOpen}
      icon={<FilterIcon />}
    >
      {activeAttributeMenu}
    </MenuToggle>
  );
  const attributeMenu = (
    // eslint-disable-next-line no-console
    <Menu
      ref={attributeMenuRef}
      onSelect={(_ev, itemId) => {
        setActiveAttributeMenu(
          itemId?.toString() as "Servers" | "Status" | "Provider"
        );
        setIsAttributeMenuOpen(!isAttributeMenuOpen);
      }}
    >
      <MenuContent>
        <MenuList>
          <MenuItem itemId="Servers">Servers</MenuItem>
          <MenuItem itemId="Status">Status</MenuItem>
          <MenuItem itemId="Provider">Provider</MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const attributeDropdown = (
    <div ref={attributeContainerRef}>
      <Popper
        trigger={attributeToggle}
        triggerRef={attributeToggleRef}
        popper={attributeMenu}
        popperRef={attributeMenuRef}
        appendTo={attributeContainerRef.current || undefined}
        isVisible={isAttributeMenuOpen}
      />
    </div>
  );

  return (
    <Toolbar
      id="attribute-search-filter-toolbar"
      clearAllFilters={() => {
        setSearchValue("");
        setStatusSelection("");
        setProviderSelections([]);
      }}
    >
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>{attributeDropdown}</ToolbarItem>
            <ToolbarFilter
              chips={searchValue !== "" ? [searchValue] : ([] as string[])}
              deleteChip={() => setSearchValue("")}
              deleteChipGroup={() => setSearchValue("")}
              categoryName="Name"
              showToolbarItem={activeAttributeMenu === "Servers"}
            >
              {searchInput}
            </ToolbarFilter>
            <ToolbarFilter
              chips={
                statusSelection !== "" ? [statusSelection] : ([] as string[])
              }
              deleteChip={() => setStatusSelection("")}
              deleteChipGroup={() => setStatusSelection("")}
              categoryName="Status"
              showToolbarItem={activeAttributeMenu === "Status"}
            >
              {statusSelect}
            </ToolbarFilter>
            <ToolbarFilter
              chips={providerSelections}
              deleteChip={(category, chip) =>
                onProviderMenuSelect(undefined, chip as string)
              }
              deleteChipGroup={() => setProviderSelections([])}
              categoryName="Provider"
              showToolbarItem={activeAttributeMenu === "Provider"}
            >
              {providerSelect}
            </ToolbarFilter>
          </ToolbarGroup>
        </ToolbarToggleGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

// ServersTable

const ServersTable: React.FunctionComponent<ServersTableProps> = ({
  statusSelection,
  providerSelections,
  searchValue,
}) => {
  const [filteredData, setFilteredData] = useState<Instance[] | []>([]);

  const [instancesData, setInstancesData] = useState<Instances>({
    count: 0,
    instances: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedInstances = await getInstances();
        setInstancesData(fetchedInstances);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = instancesData.instances;

    if (statusSelection) {
      filtered = filtered.filter((instance) =>
        instance.state.includes(statusSelection)
      );
      // console.log("Filtered by status:", filtered);
    }

    if (providerSelections && providerSelections.length > 0) {
      filtered = filtered.filter((instance) =>
        providerSelections.some((provider) => instance.provider === provider)
      );
      // console.log("Filtered by provider:", filtered);
    }
    if (searchValue) {
      filtered = filtered.filter((instance) =>
        instance.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      // console.log("Filtered by name:", filtered);
    }

    setFilteredData(filtered);
  }, [
    instancesData.instances,
    statusSelection,
    providerSelections,
    searchValue,
  ]);

  const columnNames = {
    id: "ID",
    name: "Name",
    state: "Status",
    provider: "Provider",
    availabilityZone: "AZ",
    instanceType: "Type",
  };

  const renderLabel = (labelText: string | null | undefined) => {
    switch (labelText) {
      case "Running":
        return <Label color="green">{labelText}</Label>;
      case "Stopped":
        return <Label color="red">{labelText}</Label>;
      default:
        return <Label color="gold">{labelText}</Label>;
    }
  };

  //### Sorting ###
  // Index of the currently active column
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | undefined>(0);
  // sort direction of the currently active column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | undefined>('asc');
  // sort dropdown expansion
  const getSortableRowValues = (instance: Instance): (string | number | null)[] => {
    const { id, name, availabilityZone, instanceType, state, clusterID, provider } = instance;
    return [id, name, availabilityZone, instanceType, state, clusterID, provider];
  };

  // Note that we perform the sort as part of the component's render logic and not in onSort.
  // We shouldn't store the list of data in state because we don't want to have to sync that with props.
  let sortedData = filteredData;
  if (typeof activeSortIndex === 'number' && activeSortIndex !== null) {
    sortedData = filteredData.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];
      if (typeof aValue === 'number') {
        // Numeric sort
        if (activeSortDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        }
        return (bValue as number) - (aValue as number);
      } else {
        // String sort
        if (activeSortDirection === 'asc') {
          return (aValue as string).localeCompare(bValue as string);
        }
        return (bValue as string).localeCompare(aValue as string);
      }
    });
  }

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc' // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });
  //### --- ###

  return (
    <React.Fragment>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner size="xl" />
        </div>
      ) : (
        <Table aria-label="Simple table">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>{columnNames.id}</Th>
              <Th sort={getSortParams(1)}>{columnNames.name}</Th>
              <Th sort={getSortParams(4)}>{columnNames.state}</Th>
              <Th sort={getSortParams(6)}>{columnNames.provider}</Th>
              <Th sort={getSortParams(2)}>{columnNames.availabilityZone}</Th>
              <Th sort={getSortParams(3)}>{columnNames.instanceType}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((instance) => (
              <Tr key={instance.id}>
                <Td dataLabel={columnNames.id} width={15}>
                  <Link
                    to={`/servers/${instance.id}`}
                  >
                    {instance.id}
                  </Link>
                </Td>
                <Td dataLabel={columnNames.name} width={30}>
                  {instance.name}
                </Td>
                <Td dataLabel={columnNames.state}>
                  {renderLabel(instance.state)}
                </Td>
                <Td dataLabel={columnNames.provider}>{instance.provider}</Td>
                <Td dataLabel={columnNames.availabilityZone}>{instance.availabilityZone}</Td>
                <Td dataLabel={columnNames.instanceType}>
                  {instance.instanceType}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </React.Fragment>
  );
};

const Servers: React.FunctionComponent = () => {
  const provider = useLocation();
  const queryParams = new URLSearchParams(provider.search);
  const statusFilter = queryParams.get("status");
  const cloudProviderFilter = queryParams.get("provider");
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusSelection, setStatusSelection] = useState("");
  const [providerSelections, setProviderSelections] = useState<string[]>([]);

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Servers</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <TableToolbar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setStatusSelection={setStatusSelection}
            statusSelection={statusSelection}
            setProviderSelections={setProviderSelections}
            providerSelections={providerSelections}
          />
          <ServersTable
            statusSelection={statusSelection}
            providerSelections={providerSelections}
            searchValue={searchValue}
          />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Servers;
