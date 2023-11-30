import {

  PageSection,
  PageSectionVariants,
  Pagination,
  Panel,
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  TextContent,
  Text,
  SearchInput,
  MenuToggle,
  MenuToggleElement,
  Label,
  Select,
  SelectList,
  SelectGroup,
  SelectOption,
  OverflowMenu,
  OverflowMenuGroup,
  OverflowMenuContent,
  OverflowMenuControl,
  OverflowMenuItem,
  OverflowMenuDropdownItem,
  Button,
  Dropdown,
  ToolbarGroup,
  DropdownList,
  Spinner,
} from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from "@patternfly/react-table";
import React, { useEffect, useState } from "react";
import { Link, useLocation  } from "react-router-dom";
import { getClusters } from "../services/api";
import { Cluster, ClusterList } from "@app/types/types";
import { TableToolbar } from "../utils/PageToolBar";

interface ClusterTableProps {
  statusSelection: string;
  providerSelections: string[];
  searchValue: string;
}


const ClusterTable: React.FunctionComponent<ClusterTableProps> = ({
  statusSelection,
  providerSelections,
  searchValue,
}) => {

  const [clusterData, setClusterData] = useState<ClusterList>({
    count: 0,
    clusters: []
  });
  const [filteredData, setFilteredData] = useState<Cluster[] | []>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedClusters = await getClusters();
        setClusterData(fetchedClusters);
      } catch (error) {
        console.error("Error fetching clusters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (clusterData !== undefined) {
      let filtered = clusterData.clusters

      // Status Filtering
      if (statusSelection) {
        filtered = filtered.filter((cluster) =>
          cluster.status.includes(statusSelection)
        );
      }

      // Provider filtering
      if (providerSelections && providerSelections.length > 0) {
        filtered = filtered.filter((cluster) =>
          providerSelections.some((provider) => cluster.provider === provider)
        );
      }

      // Search Value filtering (Name)
      if (searchValue) {
        filtered = filtered.filter((cluster) =>
          cluster.name.toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      setFilteredData(filtered || []);
    }
  }, [
    clusterData,
    statusSelection,
    providerSelections,
    searchValue,
  ]);

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

  const columnNames = {
    id: "ID",
    name: "Name",
    status: "Status",
    account: "Account",
    cloudProvider: "Cloud Provider",
    region: "Region",
    nodes: "Nodes",
    console: "Web console",
  };

  //### Sorting ###
  // Index of the currently active column
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | undefined>(0);
  // sort direction of the currently active column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | undefined>('asc');
  // sort dropdown expansion
  const getSortableRowValues = (cluster: Cluster): (string | number | null)[] => {
    const { id, name, status, accountName, provider, region, instanceCount, consoleLink } = cluster;
    return [id, name, status, accountName, provider, region, instanceCount, consoleLink];
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
        <Table aria-label="Sortable table">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>{columnNames.id}</Th>
              <Th sort={getSortParams(1)}>{columnNames.name}</Th>
              <Th sort={getSortParams(2)}>{columnNames.status}</Th>
              <Th sort={getSortParams(3)}>{columnNames.account}</Th>
              <Th sort={getSortParams(4)}>{columnNames.cloudProvider}</Th>
              <Th sort={getSortParams(5)}>{columnNames.region}</Th>
              <Th sort={getSortParams(6)}>{columnNames.nodes}</Th>
              <Th>{columnNames.console}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((cluster) => (
              <Tr key={cluster.name}>
                <Td dataLabel={columnNames.id}>
                  <Link
                    to={`/clusters/${cluster.id}`}
                  >
                    {cluster.id}
                  </Link>
                </Td>
                <Td dataLabel={columnNames.name}>
                  {cluster.name}
                </Td>
                <Td dataLabel={columnNames.status}>
                  {renderLabel(cluster.status)}
                </Td>
                <Td dataLabel={columnNames.account}>{cluster.accountName}</Td>
                <Td dataLabel={columnNames.cloudProvider}>
                  {cluster.provider}
                </Td>
                <Td dataLabel={columnNames.region}>{cluster.region}</Td>
                <Td dataLabel={columnNames.nodes}>
                  {cluster.instanceCount}
                </Td>
                <Td dataLabel={columnNames.console}>
                  <a
                    href={cluster.consoleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Console
                  </a>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </React.Fragment>
  );
};

const Clusters: React.FunctionComponent = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');
  const cloudProviderFilter = queryParams.get('provider');
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusSelection, setStatusSelection] = useState("");
  const [providerSelections, setProviderSelections] = useState<string[]>([]);

  useEffect(() => {
    setStatusSelection(statusFilter || '')
    if (cloudProviderFilter !== undefined && cloudProviderFilter != null) {
      setProviderSelections([cloudProviderFilter])
    }
  }, []);

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Clusters</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <TableToolbar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setStatusSelection={setStatusSelection}
            statusSelection={statusSelection}
            enableStatusSelection={true}
            setProviderSelections={setProviderSelections}
            providerSelections={providerSelections}
          />
          <ClusterTable
            statusSelection={statusSelection}
            providerSelections={providerSelections}
            searchValue={searchValue}
          />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Clusters;
