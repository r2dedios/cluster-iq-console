import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '@patternfly/react-core';
import { api, AccountResponseApi } from '@api';
import AccountsHeader from './components/AccountHeader';
import AccountsTabs from './components/AccountTabs';
import { AccountDetailsContent } from './components/AccountDetailsContent';
import { debug } from '@app/utils/debugLogs';
import { AccountClusters } from './components/AccountClusters';

const AccountDetails: React.FunctionComponent = () => {
  const { accountName } = useParams() as { accountName: string };
  const [accountData, setAccountData] = useState<AccountResponseApi | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        debug('Fetching Account Clusters ', accountName);
        const { data: fetchedAccount } = await api.accounts.accountsDetail(accountName);
        setAccountData(fetchedAccount);
        debug('Fetched Account Clusters data:', fetchedAccount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountName]);

  return (
    <Page>
      <AccountsHeader accountName={accountName} label="Account" />
      <AccountsTabs
        detailsTabContent={<AccountDetailsContent loading={loading} accountData={accountData} />}
        clustersTabContent={<AccountClusters />}
      />
    </Page>
  );
};

export default AccountDetails;
