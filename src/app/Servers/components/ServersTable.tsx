import { CloudProvider, ClusterStates, Instances } from '@app/types/types';
import { renderStatusLabel } from '@app/utils/renderStatusLabel';
import { Spinner } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ServersTableProps } from '../types';
import { getInstances } from '@app/services/api';

export const ServersTable: React.FunctionComponent<ServersTableProps> = ({
  searchValue,
  statusSelection,
  providerSelections,
  archived,
}) => {
  const [instancesData, setInstancesData] = useState<Instances>({
    count: 0,
    instances: [],
  });

  const [filteredData, setFilteredData] = useState<Instances>({
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
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = instancesData.instances;

    // First, apply view-specific filtering
    if (archived) {
      filtered = filtered.filter(instance => {
        const isTerminated = instance.status === ClusterStates.Terminated;
        return isTerminated;
      });
    } else {
      filtered = filtered.filter(instance => {
        const isNotTerminated = instance.status !== ClusterStates.Terminated;
        return isNotTerminated;
      });
    }

    // Then apply other filters
    filtered = filtered.filter(instance => instance.name.toLowerCase().includes(searchValue.toLowerCase()));

    // Apply status filter only for active view
    if (!archived && statusSelection) {
      filtered = filtered.filter(instance => instance.status === statusSelection);
    }

    if (providerSelections && providerSelections.length > 0) {
      filtered = filtered.filter(instance => providerSelections.includes(instance.provider as CloudProvider));
    }

    setFilteredData({
      count: filtered.length,
      instances: filtered,
    });
  }, [searchValue, instancesData.instances, statusSelection, providerSelections, archived]);

  const columnNames = {
    id: 'ID',
    name: 'Name',
    status: 'Status',
    provider: 'Provider',
    availabilityZone: 'AZ',
    instanceType: 'Type',
  };

  return (
    <React.Fragment>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Spinner size="xl" />
        </div>
      ) : (
        <Table aria-label="Simple table">
          <Thead>
            <Tr>
              <Th>{columnNames.id}</Th>
              <Th>{columnNames.name}</Th>
              <Th>{columnNames.status}</Th>
              <Th>{columnNames.provider}</Th>
              <Th>{columnNames.availabilityZone}</Th>
              <Th>{columnNames.instanceType}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.instances.map(instance => (
              <Tr key={instance.id}>
                <Td dataLabel={columnNames.id} width={15}>
                  <Link to={`/servers/${instance.id}`}>{instance.id}</Link>
                </Td>
                <Td dataLabel={columnNames.name} width={30}>
                  {instance.name}
                </Td>
                <Td dataLabel={columnNames.status}>{renderStatusLabel(instance.status)}</Td>
                <Td dataLabel={columnNames.provider}>{instance.provider}</Td>
                <Td dataLabel={columnNames.availabilityZone}>{instance.availabilityZone}</Td>
                <Td dataLabel={columnNames.instanceType}>{instance.instanceType}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </React.Fragment>
  );
};

export default ServersTable;
