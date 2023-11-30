import {
  PageSection,
  PageSectionVariants,
  Panel,
  TextContent,
  Text,
  Spinner,
} from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from "@patternfly/react-table";
import React, { useEffect, useState } from "react";
import { Link, useLocation  } from "react-router-dom";
import { Account, AccountList } from "@app/types/types";
import { getAccounts } from "../services/api";
import { TableToolbar } from "../utils/PageToolBar";

interface AccountsTableProps {
  statusSelection: string;
  providerSelections: string[];
  searchValue: string;
}

const AccountTable: React.FunctionComponent<AccountsTableProps> = ({
  statusSelection,
  providerSelections,
  searchValue,
}) => {

  const [accountData, setAccountData] = useState<AccountList>({
    count: 0,
    accounts: []
  });
  const [filteredData, setFilteredData] = useState<Account[] | []>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedAccounts = await getAccounts();
        setAccountData(fetchedAccounts);
      } catch (error) {
        console.error("Error fetching clusters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (accountData !== undefined) {
      let filtered = accountData.accounts

      // Provider filtering
      if (providerSelections && providerSelections.length > 0) {
        filtered = filtered.filter((instance) =>
          providerSelections.some((provider) => instance.provider === provider)
        );
      }

      // Search Value filtering (Name)
      if (searchValue) {
        filtered = filtered.filter((instance) =>
          instance.name.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      setFilteredData(filtered);
    }
  }, [
    accountData,
    statusSelection,
    providerSelections,
    searchValue,
  ]);

  const columnNames = {
    name: "Name",
    cloudProvider: "Cloud Provider",
    clusterCount: "Cluster Count",
  };

  //### Sorting ###
  // Index of the currently active column
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | undefined>(0);
  // sort direction of the currently active column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | undefined>('asc');
  // sort dropdown expansion
  const getSortableRowValues = (account: Account): (string | number | null)[] => {
    const { id, name, provider, clusterCount } = account;
    return [id, name, provider, clusterCount ];
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
              <Th sort={getSortParams(1)}>{columnNames.name}</Th>
              <Th sort={getSortParams(2)}>{columnNames.cloudProvider}</Th>
              <Th sort={getSortParams(3)}>{columnNames.clusterCount}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((account) => (
              <Tr key={account.name}>
                <Td dataLabel={columnNames.name}>
                  <Link
                    to={`/accounts/${account.name}`}
                  >
                    {account.name}
                  </Link>
                </Td>
                <Td dataLabel={columnNames.cloudProvider}>
                  {account.provider}
                </Td>
                <Td dataLabel={columnNames.clusterCount}>
                  {account.clusterCount}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </React.Fragment>
  );
};

const Accounts: React.FunctionComponent = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cloudProviderFilter = queryParams.get('provider');
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusSelection, setStatusSelection] = useState("");
  const [providerSelections, setProviderSelections] = useState<string[]>([]);

  useEffect(() => {
    if (cloudProviderFilter !== undefined && cloudProviderFilter != null) {
      setProviderSelections([cloudProviderFilter])
    }
  }, []);

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Accounts</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <TableToolbar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setStatusSelection={setStatusSelection}
            statusSelection={statusSelection}
            enableStatusSelection={false}
            setProviderSelections={setProviderSelections}
            providerSelections={providerSelections}
          />
          <AccountTable
            statusSelection={statusSelection}
            providerSelections={providerSelections}
            searchValue={searchValue}
          />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Accounts;
