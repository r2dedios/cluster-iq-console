import { ClusterStates, CloudProvider } from '@app/types/types';

export interface ClustersTableToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusSelection: ClusterStates | null;
  setStatusSelection: (value: ClusterStates | null) => void;
  providerSelections: CloudProvider[] | null;
  setProviderSelections: (value: CloudProvider[] | null) => void;
  archived: boolean;
}

export interface ClustersTableProps {
  searchValue: string;
  statusFilter: string | null;
  providerSelections: CloudProvider[] | null;
  archived: boolean;
}
