import { CardDefinition, CardLayout, DashboardState } from '../types';
import { CLOUD_PROVIDERS, STATUSES } from '../constants';

export const generateCards = (state: DashboardState): Record<string, CardDefinition[]> => {
  const statusCards = [
    {
      title: 'Clusters',
      content: Object.entries(STATUSES).map(([key, status]) => ({
        icon: status.icon,
        count: state.clustersByStatus[key] || 0,
        ref: status.route,
      })),
      layout: CardLayout.MULTI_ICON,
    },
    {
      title: 'Servers',
      content: [{ count: state.instances, ref: '/servers' }],
      layout: CardLayout.MULTI_ICON,
    },
    {
      title: 'Scanners',
      content: [{ count: 1 }],
      layout: CardLayout.MULTI_ICON,
    },
  ];

  const providerCards = Object.values(CLOUD_PROVIDERS).map(provider => ({
    title: provider.title,
    content: [
      {
        count: `${state.clustersByProvider[provider.key] ?? 0} Cluster(s)`,
        icon: provider.icon,
        ref: `/clusters?provider=${provider.key}`,
      },
      {
        count: `${state.accountsByProvider[provider.key] ?? 0} Account(s)`,
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
