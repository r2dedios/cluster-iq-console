import { renderStatusLabel } from '@app/utils/renderStatusLabel';
import { ThProps, Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Cluster } from '@app/types/types';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClusters } from '@app/services/api';
import { ClustersTableProps } from '../types';
import { LoadingSpinner } from '@app/components/common/LoadingSpinner';

export const ClustersTable: React.FunctionComponent<ClustersTableProps> = ({
  searchValue,
  statusFilter,
  cloudProviderFilter,
  providerSelections,
}) => {
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

  useEffect(() => {
    let filtered = clusterData.filter(cluster => cluster.accountName.toLowerCase().includes(searchValue.toLowerCase()));

    if (statusFilter) {
      filtered = filtered.filter(cluster => cluster.status === statusFilter);
    }

    if (providerSelections.length > 0) {
      filtered = filtered.filter(cluster => providerSelections.includes(cluster.provider));
    }

    if (cloudProviderFilter) {
      filtered = filtered.filter(cluster => cluster.provider === cloudProviderFilter);
    }

    setFilteredData(filtered);
  }, [searchValue, clusterData, statusFilter, providerSelections, cloudProviderFilter]);

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
    </React.Fragment>
  );
};

export default ClustersTable;
