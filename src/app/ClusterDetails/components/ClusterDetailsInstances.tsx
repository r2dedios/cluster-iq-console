import { LoadingSpinner } from '@app/components/common/LoadingSpinner';
import { renderStatusLabel } from '@app/utils/renderUtils';
import { api, InstanceResponseApi } from '@api';
import { ThProps, Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ClusterDetailsInstances: React.FunctionComponent = () => {
  const [data, setData] = useState<InstanceResponseApi[]>([]);
  const [loading, setLoading] = useState(true);
  const { clusterID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const { data: fetchedInstancesPerCluster } = await api.clusters.instancesList(clusterID);
        console.log('Fetched data:', fetchedInstancesPerCluster);
        setData(fetchedInstancesPerCluster);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log('Rendered with data:', data);

  //### Sorting ###
  // Index of the currently active column
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | undefined>(0);
  // sort direction of the currently active column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | undefined>('asc');
  // sort dropdown expansion
  const getSortableRowValues = (instance: Instance): (string | number | null)[] => {
    const { id, name, availabilityZone, instanceType, status, clusterID, provider } = instance;
    return [id, name, availabilityZone, instanceType, status, clusterID, provider];
  };

  // Sorting
  let sortedData = data;
  if (typeof activeSortIndex === 'number' && activeSortIndex !== null) {
    sortedData = data.sort((a, b) => {
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

  // set table column properties
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

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table aria-label="Simple table">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>ID</Th>
              <Th sort={getSortParams(1)}>Name</Th>
              <Th sort={getSortParams(3)}>Type</Th>
              <Th sort={getSortParams(4)}>Status</Th>
              <Th sort={getSortParams(2)}>AvailabilityZone</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map(instance => (
              <Tr key={instance.id}>
                <Td dataLabel={instance.id}>
                  <Link to={`/instances/${instance.id}`}>{instance.id}</Link>
                </Td>
                <Td>{instance.name}</Td>
                <Td>{instance.instanceType}</Td>
                <Td dataLabel={instance.status}>{renderStatusLabel(instance.status)}</Td>
                <Td>{instance.availabilityZone}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </React.Fragment>
  );
};

export default ClusterDetailsInstances;
