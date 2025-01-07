import { useState, useEffect } from 'react';
import { getClusters, getAccounts, getInstances } from '@app/services/api';
import { ClusterData, ClusterPerCP, Instances } from '@app/types/types';

export const useDashboardData = () => {
  const [clusterData, setClusterData] = useState<ClusterData | null>(null);
  const [clusterPerCP, setClusterPerCP] = useState<ClusterPerCP | null>(null);
  const [instances, setInstances] = useState<Instances | null>(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const data = await getClusters();
        setClusterData(data);
      } catch {
        console.error('Failed to fetch clusters.');
      }
    };

    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        setClusterPerCP(data);
      } catch {
        console.error('Failed to fetch accounts.');
      }
    };

    const fetchInstances = async () => {
      try {
        const data = await getInstances();
        setInstances(data);
      } catch {
        console.error('Failed to fetch instances.');
      }
    };
    // Trigger all requests in parallel (avoid waterfall)
    fetchClusters();
    fetchAccounts();
    fetchInstances();
  }, []);

  return { clusterData, clusterPerCP, instances };
};
