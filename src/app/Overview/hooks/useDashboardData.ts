import { useState, useEffect } from 'react';
import { api, OverviewSummaryApi } from '@api';

export const useDashboardData = () => {
  const [inventoryData, setInventoryData] = useState<OverviewSummaryApi | undefined>();

  useEffect(() => {
    const inventoryOverview = async () => {
      try {
        const { data } = await api.overview.overviewList();
        setInventoryData(data);
      } catch {
        console.error('Failed to fetch inventory data.');
      }
    };
    inventoryOverview();
  }, []);

  return { inventoryData };
};
