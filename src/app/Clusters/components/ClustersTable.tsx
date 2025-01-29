import { renderStatusLabel } from '@app/utils/renderStatusLabel';
import { ThProps, Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { CloudProvider, Cluster, ClusterStates } from '@app/types/types';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClusters } from '@app/services/api';
import { ClustersTableProps } from '../types';
import { LoadingSpinner } from '@app/components/common/LoadingSpinner';
import { getPaginatedSlice } from '@app/utils/tablePagination';
import { TablePagination } from '@app/components/common/TablesPagination';

export const ClustersTable: React.FunctionComponent<ClustersTableProps> = ({
  searchValue,
  statusFilter,
  providerSelections,
  archived,
}) => {
  // Pagination settings
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [filteredCount, setFilteredCount] = useState(0);

  const [clusterData, setClusterData] = useState<Cluster[] | []>([]);
  const [filteredData, setFilteredData] = useState<Cluster[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedClusters = await getClusters();
        setClusterData(fetchedClusters.clusters);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // In useEffect for filtering
  useEffect(() => {
    let filtered = clusterData;

    // First, apply view-specific filtering
    if (archived) {
      filtered = filtered.filter(cluster => {
        const isTerminated = cluster.status === ClusterStates.Terminated;
        return isTerminated;
      });
    } else {
      filtered = filtered.filter(cluster => {
        const isNotTerminated = cluster.status !== ClusterStates.Terminated;
        return isNotTerminated;
      });
    }

    // Then apply other filters
    filtered = filtered.filter(cluster => cluster.accountName.toLowerCase().includes(searchValue.toLowerCase()));

    // Apply status filter only for active view
    if (!archived && statusFilter) {
      filtered = filtered.filter(cluster => cluster.status === statusFilter);
    }

    if (providerSelections && providerSelections.length > 0) {
      filtered = filtered.filter(cluster => providerSelections.includes(cluster.provider as CloudProvider));
    }
    setFilteredCount(filtered.length);
    setFilteredData(getPaginatedSlice(filtered, page, perPage));
  }, [searchValue, clusterData, statusFilter, providerSelections, archived, page, perPage]);

  const columnNames = {
    id: 'ID',
    name: 'Name',
    status: 'Status',
    account: 'Account',
    cloudProvider: 'Cloud Provider',
    region: 'Region',
    nodes: 'Nodes',
    console: 'Web console',
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
      defaultDirection: 'asc', // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });
  //### --- ###

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table aria-label="Sortable table">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>{columnNames.id}</Th>
              <Th sort={getSortParams(1)}>{columnNames.name}</Th>
              <Th>{columnNames.status}</Th>
              <Th sort={getSortParams(3)}>{columnNames.account}</Th>
              <Th sort={getSortParams(4)}>{columnNames.cloudProvider}</Th>
              <Th sort={getSortParams(5)}>{columnNames.region}</Th>
              <Th sort={getSortParams(6)}>{columnNames.nodes}</Th>
              <Th>{columnNames.console}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map(cluster => (
              <Tr key={cluster.id}>
                <Td dataLabel={columnNames.id}>
                  <Link to={`/clusters/${cluster.id}`}>{cluster.id}</Link>
                </Td>
                <Td dataLabel={columnNames.name}>{cluster.name}</Td>
                <Td dataLabel={columnNames.status}>{renderStatusLabel(cluster.status)}</Td>
                <Td dataLabel={columnNames.account}>{cluster.accountName}</Td>
                <Td dataLabel={columnNames.cloudProvider}>{cluster.provider}</Td>
                <Td dataLabel={columnNames.region}>{cluster.region}</Td>
                <Td dataLabel={columnNames.nodes}>{cluster.instanceCount}</Td>
                <Td dataLabel={columnNames.console}>
                  <a href={cluster.consoleLink} target="_blank" rel="noopener noreferrer">
                    Console
                  </a>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <TablePagination
        itemCount={filteredCount}
        page={page}
        perPage={perPage}
        onSetPage={setPage}
        onPerPageSelect={setPerPage}
      />
    </React.Fragment>
  );
};

export default ClustersTable;
