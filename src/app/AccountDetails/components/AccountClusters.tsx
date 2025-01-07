import { LoadingSpinner } from '@app/components/common/LoadingSpinner';
import { Cluster } from '@app/types/types';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClustersTable } from './ClustersTable';
import { getAccountClusters } from '@app/services/api';
import { debug } from '@app/utils/debugLogs';

export const AccountClusters: React.FunctionComponent = () => {
  const [data, setData] = useState<Cluster[] | []>([]);
  const [loading, setLoading] = useState(true);
  const { accountName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        debug('Fetching data...');
        const fetchedAccountClusters = await getAccountClusters(accountName);
        debug('Fetched Account data:', fetchedAccountClusters);
        setData(fetchedAccountClusters);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountName]);

  debug('Rendered with data:', data);

  return <React.Fragment>{loading ? <LoadingSpinner /> : <ClustersTable clusters={data} />}</React.Fragment>;
};
