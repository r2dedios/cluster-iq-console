import { ClusterActions, ResultStatus } from '@app/types/types';
import { ProviderApi } from '@api';

export interface AuditLogsTableToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  action: ClusterActions[] | null;
  setAction: (value: ClusterActions[] | null) => void;
  result: ResultStatus[] | null;
  setResult: (value: ResultStatus[] | null) => void;
  providerSelections: ProviderApi[] | null;
  setProviderSelections: (value: ProviderApi[] | null) => void;
  triggered_by: string;
  setTriggeredBy: (value: string) => void;
}

export interface AuditLogsTableProps {
  accountName?: string;
  action?: ClusterActions[];
  provider?: ProviderApi[];
  result?: ResultStatus[];
  triggered_by?: string;
}
