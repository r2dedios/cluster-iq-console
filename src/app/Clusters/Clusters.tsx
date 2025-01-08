import { PageSection, PageSectionVariants, Panel, TextContent, Text } from '@patternfly/react-core';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ClustersTable from './components/ClustersTable';
import ClustersTableToolbar from './components/ClustersTableToolbar';

const Clusters: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cloudProviderFilter = queryParams.get('cloudProvider');
  const [statusSelection, setStatusSelection] = useState('');
  const [providerSelections, setProviderSelections] = useState<string[]>([]);

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Clusters</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <ClustersTableToolbar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            statusSelection={statusSelection}
            setStatusSelection={setStatusSelection}
            providerSelections={providerSelections}
            setProviderSelections={setProviderSelections}
            onSearchChange={setSearchValue}
          />
          <ClustersTable
            searchValue={searchValue}
            statusFilter={statusSelection}
            cloudProviderFilter={cloudProviderFilter}
            providerSelections={providerSelections}
          />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Clusters;
