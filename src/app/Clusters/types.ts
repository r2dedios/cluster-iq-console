export interface ClustersTableToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusSelection: string;
  setStatusSelection: (value: string) => void;
  providerSelections: string[];
  setProviderSelections: (value: string[]) => void;
  onSearchChange: (value: string) => void;
}

export interface ClustersTableProps {
  searchValue: string;
  statusFilter: string | null;
  cloudProviderFilter: string | null;
  providerSelections;
}
