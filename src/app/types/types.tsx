// Accounts Types
export type Account = {
  id: string;
  name: string;
  provider: string;
  clusterCount: number;
  clusters: Record<string, Cluster>;
};

export type AccountList = {
  count: number;
  accounts: Account[];
};

// Cluster Types
export type Cluster = {
  id: string;
  name: string;
  provider: string;
  status: string;
  region: string;
  consoleLink: string;
  accountName: string;
  instanceCount: number;
  instances: Instance[];
};

export type ClusterList = {
  count: number;
  clusters: Cluster[];
};

// Instances Types
export type Instance = {
    id: string;
    name: string;
    availabilityZone: string;
    instanceType: string;
    state: string;
    clusterID: string;
    provider: string;
    tags: Array<Tag>;
}

export type InstanceList = {
    count: number;
    instances : Instance[];
}

// Tags Types
export type Tag = {
  key: string;
  value: string;
}

export type TagList = {
  count: number;
  tags: Tag[];
}
