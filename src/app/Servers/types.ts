import { ClusterStates, CloudProvider } from '@app/types/types';

export interface ServersTableProps {
  searchValue: string;
  statusSelection: string | null;
  providerSelections: CloudProvider[] | null;
  archived: boolean;
}

export interface ServersTableToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusSelection: ClusterStates | null;
  setStatusSelection: (value: ClusterStates | null) => void;
  providerSelections: CloudProvider[] | null;
  setProviderSelections: (value: CloudProvider[] | null) => void;
  archived: boolean;
}
