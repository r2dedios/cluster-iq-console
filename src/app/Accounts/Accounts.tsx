import { PageSection, PageSectionVariants, Panel, TextContent, Text } from '@patternfly/react-core';
import React, { useState } from 'react';
import AccountsToolbar from './components/AccountsToolbar';
import AccountsTable from './components/AccountsTable';

import { useLocation } from 'react-router-dom';
const Accounts: React.FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [providerSelections, setProviderSelections] = useState<string[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cloudProviderFilter = queryParams.get('cloudProvider');

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Accounts</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <AccountsToolbar
            onSearchChange={setSearchValue}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
            setProviderSelections={setProviderSelections}
            providerSelections={providerSelections}
          />
          <AccountsTable
            searchValue={searchValue}
            cloudProviderFilter={cloudProviderFilter}
            providerSelections={providerSelections}
            statusFilter={null}
          />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Accounts;
