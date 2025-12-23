import { api, ActionResponseApi } from '@api';

export const rowActions = (action: ActionResponseApi, reloadActions: () => Promise<void>) => [
  {
    title: 'Enable',
    onClick: async () => {
      console.log('Enable', action.id);
      await api.actions.actionsEnable(action.id);
      await reloadActions();
    },
  },
  {
    title: 'Disable',
    onClick: async () => {
      console.log('Disable', action.id);
      await api.actions.actionsDisable(action.id);
      await reloadActions();
    },
  },
  { isSeparator: true },
  {
    title: 'Delete',
    isDanger: true,
    onClick: async () => {
      console.log('Delete', action.id);
      await api.actions.actionsDelete(action.id);
      await reloadActions();
    },
  },
];
