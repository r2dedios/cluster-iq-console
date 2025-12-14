import { PageSection, PageSectionVariants, Panel, TextContent, Text } from '@patternfly/react-core';
import React from 'react';
import ClustersTable from './components/ClustersTable';
import ClustersTableToolbar from './components/ClustersTableToolbar';
import { parseAsArrayOf, parseAsString, parseAsStringEnum, parseAsBoolean, useQueryStates } from 'nuqs';
import { ResourceStatusApi, ProviderApi } from '@api';
import { useLocation } from 'react-router-dom';

const filterParams = {
  status: {
    ...parseAsStringEnum<ResourceStatusApi>(Object.values(ResourceStatusApi)),
    defaultValue: null as ResourceStatusApi | null,
  },
  provider: parseAsArrayOf(parseAsStringEnum<ProviderApi>(Object.values(ProviderApi))).withDefault([]),
  clusterName: parseAsString.withDefault(''),
  accountName: parseAsString.withDefault(''),
  archived: parseAsBoolean.withDefault(false),
};

const Clusters: React.FunctionComponent = () => {
  const location = useLocation();
  const [{ status, provider, clusterName, accountName, archived }, setQuery] = useQueryStates(filterParams);

  // React to URL changes
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newArchived = params.get('archived') === 'true';

    if (archived !== newArchived) {
      setQuery({
        archived: newArchived,
        status: null,
        provider: [],
      });
    }
  }, [location.search, archived, setQuery]);

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Clusters {archived ? '- History' : '- Active'}</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <ClustersTableToolbar
            clusterNameSearch={clusterName}
            setClusterNameSearch={value => setQuery({ clusterName: value })}
            accountNameSearch={accountName}
            setAccountNameSearch={value => setQuery({ accountName: value })}
            statusSelection={status}
            setStatusSelection={value => setQuery({ status: value })}
            providerSelections={provider}
            setProviderSelections={value => setQuery({ provider: value || [] })}
            archived={archived}
          />
          <ClustersTable
            clusterNameSearch={clusterName}
            accountNameSearch={accountName}
            statusFilter={status}
            providerSelections={provider}
            archived={archived}
          />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Clusters;
