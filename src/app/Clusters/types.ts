import { ClusterStates, CloudProvider } from '@app/types/types';

export type FilterCategory = 'accountName' | 'clusterName';

export interface ClustersTableToolbarProps {
  filterCategory: FilterCategory;
  setFilterCategory: (category: FilterCategory) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  statusSelection: ClusterStates | null;
  setStatusSelection: (value: ClusterStates | null) => void;
  providerSelections: CloudProvider[] | null;
  setProviderSelections: (value: CloudProvider[] | null) => void;
  archived: boolean;
}
export interface ClustersTableProps {
  filterCategory: FilterCategory;
  filterValue: string;
  statusFilter: string | null;
  providerSelections: CloudProvider[] | null;
  archived: boolean;
}
