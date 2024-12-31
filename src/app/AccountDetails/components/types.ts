import { AccountData, Cluster } from '@app/types/types';
import React from 'react';

export interface AccountsHeaderProps {
  accountName: string;
  label: string;
}

export interface AccountsTabsProps {
  detailsTabContent: React.ReactNode;
  clustersTabContent: React.ReactNode;
}

export interface AccountDetailsContentProps {
  loading: boolean;
  accountData: AccountData;
}

export interface AccountDescriptionListProps {
  account: AccountData['accounts'][0];
}

export interface ClustersTableProps {
  clusters: Cluster[];
}
