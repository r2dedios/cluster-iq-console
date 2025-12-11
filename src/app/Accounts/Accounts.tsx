import { PageSection, PageSectionVariants, Panel, TextContent, Text } from '@patternfly/react-core';
import React from 'react';
import AccountsToolbar from './components/AccountsToolbar';
import AccountsTable from './components/AccountsTable';
import { parseAsArrayOf, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { CloudProvider } from '@app/types/types';

const filterParams = {
  provider: parseAsArrayOf(parseAsStringEnum<CloudProvider>(Object.values(CloudProvider))).withDefault([]),
  accountName: parseAsString.withDefault(''),
};

const Accounts: React.FunctionComponent = () => {
  const [{ provider, accountName }, setQuery] = useQueryStates(filterParams);

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
            searchValue={accountName}
            setSearchValue={value => setQuery({ accountName: value })}
            providerSelections={provider}
            setProviderSelections={value => setQuery({ provider: value || null })}
          />
          <AccountsTable searchValue={accountName} providerSelections={provider} />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Accounts;
