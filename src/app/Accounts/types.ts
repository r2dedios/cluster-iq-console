export interface AccountsTableItem {
  clusterCount: number;
  name: string;
  provider: string;
}

export interface AccountsTableProps {
  cloudProviderFilter: string | null;
  providerSelections;
  searchValue: string;
  statusFilter: string | null;
}

export interface AccountsToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  providerSelections: string[];
  setProviderSelections: (value: string[]) => void;
  onSearchChange: (value: string) => void;
}
