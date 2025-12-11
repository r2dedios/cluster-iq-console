import { CloudProvider } from '@app/types/types';

export interface AccountsToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  providerSelections: CloudProvider[] | null;
  setProviderSelections: (value: CloudProvider[] | null) => void;
}
