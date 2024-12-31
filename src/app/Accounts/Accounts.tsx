import {
  PageSection,
  PageSectionVariants,
  Panel,
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  TextContent,
  Text,
  SearchInput,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccounts } from '../services/api';
import { AccountsTableItem, AccountsTableProps, AccountsToolbarProps } from './types';
import { LoadingSpinner } from '@app/components/common/LoadingSpinner';

const AccountsToolbar: React.FunctionComponent<AccountsToolbarProps> = ({ value = '', onSearchChange }) => {
  const [internalValue, setInternalValue] = useState(value);

  const onChange = (value: string) => {
    setInternalValue(value);
    onSearchChange(value);
  };

  return (
    <Toolbar id="accounts-toolbar">
      <ToolbarContent>
        <ToolbarItem variant="search-filter">
          <SearchInput
            aria-label="Search by name..."
            placeholder="Search by name..."
            value={internalValue}
            onChange={(_event, value) => onChange(value)}
            onClear={() => onChange('')}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

const AccountsTable: React.FunctionComponent<AccountsTableProps> = ({ searchValue }) => {
  const columnNames = {
    name: 'Name',
    cloudProvider: 'Cloud Provider',
    clusterCount: 'Cluster Count',
  };

  const [accountData, setAccountData] = useState<AccountsTableItem[]>([]);
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

  const filteredData = useMemo(
    () => accountData.filter((account) => account.name.toLowerCase().includes(searchValue.toLowerCase())),
    [accountData, searchValue],
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Table aria-label="Accounts table">
      <Thead>
        <Tr>
          <Th>{columnNames.name}</Th>
          <Th>{columnNames.cloudProvider}</Th>
          <Th>{columnNames.clusterCount}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {filteredData.map((account) => (
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
  );
};

const Accounts: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Accounts</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <AccountsToolbar onSearchChange={setSearchValue} />
          <AccountsTable searchValue={searchValue} />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Accounts;
