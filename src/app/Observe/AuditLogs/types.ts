import { CloudProvider, ClusterActions, ResultStatus } from '@app/types/types';

export interface AuditLogsTableToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  action: ClusterActions[] | null;
  setAction: (value: ClusterActions[] | null) => void;
  result: ResultStatus[] | null;
  setResult: (value: ResultStatus[] | null) => void;
  providerSelections: CloudProvider[] | null;
  setProviderSelections: (value: CloudProvider[] | null) => void;
  triggered_by: string;
  setTriggeredBy: (value: string) => void;
}

export interface AuditLogsTableProps {
  accountName?: string;
  action?: ClusterActions[];
  provider?: CloudProvider[];
  result?: ResultStatus[];
  triggered_by?: string;
}
