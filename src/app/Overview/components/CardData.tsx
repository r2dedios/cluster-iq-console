import { CardDefinition, CardLayout, DashboardState } from '../types';
import { CLOUD_PROVIDERS, STATUSES } from '../constants';

export const generateCards = (state: DashboardState): Record<string, CardDefinition[]> => {
  const scannerContent = state.lastScanTimestamp
    ? `Last scan: ${new Date(state.lastScanTimestamp).toLocaleString()}`
    : 'No scan data available';
  const statusCards = [
    {
      title: 'Clusters',
      content: Object.entries(STATUSES).map(([key, status]) => ({
        icon: status.icon,
        value: state.clustersByStatus[key] || 0,
        ref: status.route,
      })),
      layout: CardLayout.MULTI_ICON,
    },
    {
      title: 'Instances',
      content: Object.entries(STATUSES).map(([key, status]) => ({
        icon: status.icon,
        value: state.instancesByStatus[key] || 0,
        ref: status.route,
      })),
      layout: CardLayout.MULTI_ICON,
    },
    {
      title: 'Scanners',
      content: [{ value: scannerContent }],
      layout: CardLayout.MULTI_ICON,
    },
  ];

  const providerCards = Object.values(CLOUD_PROVIDERS).map(provider => ({
    title: provider.title,
    content: [
      {
        value: `${state.clustersByProvider[provider.key] ?? 0} Cluster(s)`,
        icon: provider.icon,
        ref: `/clusters?provider=${provider.key}`,
      },
      {
        value: `${state.accountsByProvider[provider.key] ?? 0} Account(s)`,
        icon: provider.providerIcon,
        ref: `/accounts?provider=${provider.key}`,
      },
    ],
    layout: CardLayout.MULTI_ICON,
  }));

  return {
    statusCards,
    providerCards,
  };
};
