import axios from 'axios';

// Initialize API client with base settings
const apiClient = axios.create({
  baseURL: '/api', // API proxy path
  timeout: 20000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch details of a specific cluster by its ID
export async function getCluster(clusterID) {
  try {
    const response = await apiClient.get(`/clusters/${clusterID}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cluster ${clusterID}:`, error);
    throw error;
  }
}

// Fetch all clusters
export const getClusters = async () => {
  try {
    const response = await apiClient.get('/clusters');
    return response.data;
  } catch (error) {
    console.error('Error fetching clusters:', error);
    throw error;
  }
};

// Fetch details of a specific account by name
export async function getAccountByName(accountName) {
  try {
    const response = await apiClient.get(`/accounts/${accountName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching account ${accountName}:`, error);
    throw error;
  }
}

// Fetch all accounts
export const getAccounts = async () => {
  try {
    const response = await apiClient.get('/accounts');
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

// Fetch details of a specific instance by ID
export async function getInstanceByID(instanceID) {
  try {
    const response = await apiClient.get(`/instances/${instanceID}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching instance ${instanceID}:`, error);
    throw error;
  }
}

// Fetch all instances
export const getInstances = async () => {
  try {
    const response = await apiClient.get('/instances');
    return response.data;
  } catch (error) {
    console.error('Error fetching instances:', error);
    throw error;
  }
};

// Fetch all clusters linked to a specific account
export async function getAccountClusters(accountName) {
  try {
    const response = await apiClient.get(`/accounts/${accountName}/clusters`);
    return response.data.clusters;
  } catch (error) {
    console.error(`Error fetching clusters for account ${accountName}:`, error);
    throw error;
  }
}

// Fetch all instances linked to a specific cluster
export async function getClusterInstances(clusterID) {
  try {
    const response = await apiClient.get(`clusters/${clusterID}/instances`);
    return response.data.instances;
  } catch (error) {
    console.error(`Error fetching instances for cluster ${clusterID}:`, error);
    throw error;
  }
}

// Fetch all tags linked to a specific cluster
export async function getClusterTags(clusterID) {
  try {
    const response = await apiClient.get(`clusters/${clusterID}/tags`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tags for cluster ${clusterID}:`, error);
    throw error;
  }
}

// Start a cluster
export async function startCluster(clusterID, userEmail, description) {
  try {
    const response = await apiClient.post(`clusters/${clusterID}/power_on`, {
      triggered_by: userEmail || 'unknown',
      description: description,
    });

    console.log(`Power on request sent for cluster ${clusterID}`);
    return response.data;
  } catch (error) {
    console.error(`Error starting cluster ${clusterID}:`, error);
    throw error;
  }
}

// Stop a cluster
export async function stopCluster(clusterID, userEmail, description) {
  try {
    const response = await apiClient.post(`clusters/${clusterID}/power_off`, {
      triggered_by: userEmail || 'unknown',
      description: description,
    });

    console.log(`Power off request sent for cluster ${clusterID}`);
    return response.data;
  } catch (error) {
    console.error(`Error stopping cluster ${clusterID}:`, error);
    throw error;
  }
}

// Fetch events related to a specific cluster
export async function getClusterEvents(clusterID) {
  try {
    const response = await apiClient.get(`clusters/${clusterID}/events`);
    return response.data.events;
  } catch (error) {
    console.error(`Failed to fetch events for cluster ${clusterID}:`, error);
    throw error;
  }
}

// Fetch all system-wide events
export async function getSystemEvents() {
  try {
    const response = await apiClient.get(`/events`);
    return response.data.events;
  } catch (error) {
    console.error('Failed to fetch system-wide events:', error);
    throw error;
  }
}

// Create a scheduled action
export async function createScheduledAction(actionData) {
  console.log('Sending to API:', JSON.stringify(actionData, null, 2));

  try {
    const response = await apiClient.post(`/schedule`, actionData);
    if (response.status === 200) {
      return response.status;
    }
    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error(`Failed to create scheduled action:`, error);
    throw error;
  }
}

// Delete a scheduled action
export async function deleteScheduledAction(actionID) {
  try {
    const response = await apiClient.delete(`schedule/${actionID}`);
    if (response.status === 200) {
      return response.status;
    }
    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error(`Failed to delete scheduled action ${actionID}:`, error);
    throw error;
  }
}

// Enable a scheduled action
export async function enableScheduledAction(actionID) {
  try {
    const response = await apiClient.patch(`schedule/${actionID}/enable`);
    if (response.status === 200) {
      return response.status;
    }
    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error(`Failed to enable scheduled action ${actionID}:`, error);
    throw error;
  }
}

// Disable a scheduled action
export async function disableScheduledAction(actionID) {
  try {
    const response = await apiClient.patch(`schedule/${actionID}/disable`);
    if (response.status === 200) {
      return response.status;
    }
    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error(`Failed to disable scheduled action ${actionID}:`, error);
    throw error;
  }
}

// Fetch all scheduled actions
export async function getScheduledActions() {
  try {
    const response = await apiClient.get('/schedule');
    if (response.status === 200) {
      return response.data.actions;
    }
    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error('Failed to fetch scheduled actions:', error);
    throw error;
  }
}
