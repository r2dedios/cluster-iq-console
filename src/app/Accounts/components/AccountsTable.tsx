import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AccountsTableItem } from '../types';
import { getAccounts } from '@app/services/api';
import { LoadingSpinner } from '@app/components/common/LoadingSpinner';

export const AccountsTable: React.FunctionComponent<{
  searchValue: string;
  statusFilter: string | null;
  cloudProviderFilter: string | null;
  providerSelections;
}> = ({ searchValue, cloudProviderFilter, providerSelections }) => {
  const [accountData, setAccountData] = useState<AccountsTableItem[] | []>([]);
  const [filteredData, setFilteredData] = useState<AccountsTableItem[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedAccounts = await getAccounts();
        setAccountData(fetchedAccounts.accounts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = accountData.filter(account => account.name.toLowerCase().includes(searchValue.toLowerCase()));

    if (providerSelections.length > 0) {
      filtered = filtered.filter(cluster => providerSelections.includes(cluster.provider));
    }

    if (cloudProviderFilter) {
      filtered = filtered.filter(cluster => cluster.provider === cloudProviderFilter);
    }

    setFilteredData(filtered);
  }, [searchValue, accountData, providerSelections, cloudProviderFilter]);

  const columnNames = {
    name: 'Name',
    cloudProvider: 'Cloud Provider',
    clusterCount: 'Cluster Count',
  };

  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table aria-label="Simple table">
          <Thead>
            <Tr>
              <Th>{columnNames.name}</Th>
              <Th>{columnNames.cloudProvider}</Th>
              <Th>{columnNames.clusterCount}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map(account => (
              <Tr key={account.name}>
                <Td dataLabel={columnNames.name}>
                  <Link to={`/accounts/${account.name}`}>{account.name}</Link>
                </Td>
                <Td dataLabel={columnNames.cloudProvider}>{account.provider}</Td>
                <Td dataLabel={columnNames.clusterCount}>{account.clusterCount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </React.Fragment>
  );
};

export default AccountsTable;
