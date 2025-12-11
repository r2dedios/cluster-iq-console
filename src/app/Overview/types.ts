import React from 'react';

export enum CardLayout {
  SINGLE_ICON = 'icon',
  MULTI_ICON = 'multiIcon',
  WITH_SUBTITLE = 'withSubtitle',
}

export enum CloudProvider {
  AWS = 'AWS',
  GCP = 'GCP',
  AZURE = 'Azure',
}

export interface CardContentItem {
  icon?: React.ReactNode;
  value: string | number;
  ref?: string;
}

export interface CardTotalCount {
  icon: React.ReactNode;
  value: number;
  label: string;
}

export interface CardDefinition {
  title: string;
  content: CardContentItem[];
  layout: CardLayout;
  customComponent?: React.ReactNode;
  totalCount?: CardTotalCount;
}

export interface DashboardState {
  clustersByStatus: Record<string, number>;
  instancesByStatus: Record<string, number>;
  clustersByProvider: Record<CloudProvider, number>;
  accountsByProvider: Record<CloudProvider, number>;
  instances: number;
  lastScanTimestamp?: string;
}
