import {
  PageSection,
  PageSectionVariants,
  Panel,
  TextContent,
  Text,
  Label,
  Spinner,
} from "@patternfly/react-core";
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from "@patternfly/react-table";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getInstances } from "../services/api";
import { Instance, InstanceList } from "@app/types/types";
import { TableToolbar } from "../utils/PageToolBar";

interface ServersTableProps {
  statusSelection: string;
  providerSelections: string[];
  searchValue: string;
}


const ServersTable: React.FunctionComponent<ServersTableProps> = ({
  statusSelection,
  providerSelections,
  searchValue,
}) => {

  const [instancesData, setInstancesData] = useState<InstanceList>({
    count: 0,
    instances: []
  });
  const [filteredData, setFilteredData] = useState<Instance[] | []>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedInstances = await getInstances();
        setInstancesData(fetchedInstances);
      } catch (error) {
        console.error("Error fetching instances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    //Run only if instancesData is not 'undefined'. It could be as a result of
    //a empty response on the API. If empty, do nothing
    if (instancesData !== undefined) {
      let filtered = instancesData.instances
      
      // Status filtering
      if (statusSelection) {
        filtered = filtered.filter((instance) =>
          instance.state.includes(statusSelection)
        );
      }

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
    instancesData,
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
            enableStatusSelection={true}
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
