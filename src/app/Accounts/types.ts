export interface AccountsTableItem {
  name: string;
  provider: string;
  clusterCount: number;
}

export interface AccountsTableProps {
  searchValue: string;
}

export interface AccountsToolbarProps {
  value?: string;
  onSearchChange: (value: string) => void;
}
