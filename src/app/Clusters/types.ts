import { ClusterStates, CloudProvider } from '@app/types/types';

export interface ClustersTableToolbarProps {
  clusterNameSearch: string;
  setClusterNameSearch: (value: string) => void;
  accountNameSearch: string;
  setAccountNameSearch: (value: string) => void;
  statusSelection: ClusterStates | null;
  setStatusSelection: (value: ClusterStates | null) => void;
  providerSelections: CloudProvider[] | null;
  setProviderSelections: (value: CloudProvider[] | null) => void;
  archived: boolean;
}

export interface ClustersTableProps {
  clusterNameSearch: string;
  accountNameSearch: string;
  statusFilter: string | null;
  providerSelections: CloudProvider[] | null;
  archived: boolean;
}
