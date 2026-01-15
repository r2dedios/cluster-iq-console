import {
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Modal,
  ModalVariant,
  ToggleGroup,
  ToggleGroupItem,
  Form,
  FormGroup,
  TextInput,
  Tabs,
  TabTitleText,
  Tab,
  Title,
} from '@patternfly/react-core';
import React from 'react';
import { ActionStatus, ActionOperations, ActionTypes } from '@app/types/types';
import DateTimePicker from './DateTimePicker';
import { AccountTypeaheadSelect } from './AccountSelector';
import { ClusterTypeaheadSelect } from './ClusterSelector';
import { useUser } from '@app/Contexts/UserContext.tsx';
import { debug } from '@app/utils/debugLogs';
import { api, startCluster, stopCluster, AccountResponseApi, ClusterResponseApi, ActionRequestApi } from '@api';
import { fetchAllPages } from '@app/utils/fetchAllPages';
import { OutlinedClockIcon, CalendarAltIcon, SyncAltIcon } from '@patternfly/react-icons';
import cronValidate from 'cron-validate';

interface ModalPowerManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const ModalPowerManagement: React.FunctionComponent<ModalPowerManagementProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { userEmail } = useUser();

  // Modal From parameters
  const [selectedAccount, setSelectedAccount] = React.useState<AccountResponseApi | null>(null);
  const [selectedCluster, setSelectedCluster] = React.useState<ClusterResponseApi | null>(null);
  const [actionOperation, setActionOperation] = React.useState('');
  const [actionEnabled, setActionEnabled] = React.useState<boolean>(true);
  const [scheduledDateTime, setScheduledDateTime] = React.useState('');
  const [cronExpression, setCronExpression] = React.useState('');
  const [description, setDescription] = React.useState<string>('');

  // Account/Cluster typeahead vars
  const [allAccounts, setAllAccounts] = React.useState<AccountResponseApi[]>([]);
  const [allClusters, setAllClusters] = React.useState<ClusterResponseApi[]>([]);

  // TODO: restore Loading spinner
  //const [loading, setLoading] = React.useState(true);

  // Action type selection
  const [actionType, setActionType] = React.useState<ActionTypes>(ActionTypes.INSTANT_ACTION);
  const [isSelected, setIsSelected] = React.useState('');

  const resetExecutionFields = (next: ActionTypes) => {
    setActionEnabled(true);
    if (next !== ActionTypes.SCHEDULED_ACTION) {
      setScheduledDateTime('');
    }
    if (next !== ActionTypes.CRON_ACTION) {
      setCronExpression('');
    }
  };

  const isValidCronExpression = (expr: string): boolean => {
    if (!expr.trim()) return false;
    const result = cronValidate(expr, { preset: 'default' });
    return result.isValid();
  };

  const isCommonValid = !!selectedAccount && !!selectedCluster && actionOperation.trim() !== '';

  const isExecutionValid =
    actionType === ActionTypes.INSTANT_ACTION ||
    (actionType === ActionTypes.SCHEDULED_ACTION && scheduledDateTime !== '') ||
    (actionType === ActionTypes.CRON_ACTION && cronExpression !== '' && isValidCronExpression(cronExpression));

  const isFormValid = isCommonValid && isExecutionValid;

  // Typeahead clear button functions
  const onAccountClearButtonClick = () => {
    setSelectedAccount(null);
  };

  const onClusterClearButtonClick = () => {
    setSelectedCluster(null);
  };

  // Load accounts when the modal opens.
  React.useEffect(() => {
    if (!isOpen) return;

    const fetchAccounts = async () => {
      //setLoading(true);
      try {
        const accountFullList = await fetchAllPages(async (page, pageSize) => {
          const { data } = await api.accounts.accountsList({ page, page_size: pageSize });
          return { items: data.items || [], count: data.count || 0 };
        });
        setAllAccounts(accountFullList);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setAllAccounts([]);
      } finally {
        //setLoading(false);
      }
    };

    fetchAccounts();
  }, [isOpen]);

  // Reload clusters every time the selected account changes.
  React.useEffect(() => {
    if (!isOpen) return;

    // Reset dependent state when account changes / clears
    setSelectedCluster(null);
    setAllClusters([]);
    setActionEnabled(true);

    const accountId = selectedAccount?.accountId;
    if (!accountId) return;

    const fetchClusters = async () => {
      //setLoading(true);
      try {
        const clusterFullList = await fetchAllPages(async (page, pageSize) => {
          const { data } = await api.accounts.clustersList(accountId, { page, page_size: pageSize });
          return { items: data.items || [], count: data.count || 0 };
        });
        setAllClusters(clusterFullList);
      } catch (error) {
        console.error('Error fetching clusters:', error);
        setAllClusters([]);
      } finally {
        //setLoading(false);
      }
    };

    fetchClusters();
  }, [isOpen, selectedAccount?.accountId]);

  // Reset modal state when closing to avoid leaking previous selections.
  React.useEffect(() => {
    if (isOpen) return;

    setDescription('');
    setActionType(ActionTypes.INSTANT_ACTION);
    setScheduledDateTime('');
    setCronExpression('');
    setSelectedAccount(null);
    setSelectedCluster(null);
    setAllClusters([]);
  }, [isOpen]);

  const handlerConfirmActionCreation = async () => {
    // Ensure clusterID is not undefined before performing any action
    if (!selectedCluster?.clusterId) {
      console.error('ClusterID is undefined. Cannot perform scheduled action');
      return;
    }

    // Instant Action run
    if (actionType === ActionTypes.INSTANT_ACTION) {
      if (actionOperation === ActionOperations.POWER_ON) {
        debug('Powering on the cluster');
        startCluster(selectedCluster?.clusterId, userEmail, description);
      } else if (actionOperation === ActionOperations.POWER_OFF) {
        debug('Powering off the cluster');
        stopCluster(selectedCluster?.clusterId, userEmail, description);
      }
    } else {
      // Creating base action. Tunning depending on ActionType
      const powerActionRequest = {
        accountId: selectedAccount?.accountId,
        clusterId: selectedCluster?.clusterId,
        enabled: actionEnabled,
        operation: actionOperation,
        region: selectedCluster?.region,
        status: ActionStatus.Pending,
        description: description,
      } as ActionRequestApi;

      // Scheduled Action run
      if (actionType === ActionTypes.SCHEDULED_ACTION) {
        // TODO: Convert to data validation
        if (!scheduledDateTime) {
          console.error('Scheduled DateTime is required');
          return;
        }
        powerActionRequest.type = ActionTypes.SCHEDULED_ACTION;
        powerActionRequest.time = scheduledDateTime;
        // Cron Action run
      } else if (actionType === ActionTypes.CRON_ACTION) {
        // TODO: Convert to data validation
        if (!cronExpression.trim()) {
          console.error('Cron expression is empty');
          return;
        }

        powerActionRequest.type = ActionTypes.CRON_ACTION;
        powerActionRequest.cronExpression = cronExpression.trim();
      }

      const powerActionRequests: ActionRequestApi[] = [powerActionRequest];
      console.log(powerActionRequest);
      await api.actions.actionsCreate(powerActionRequests);
      onCreated();
      onClose();
    }

    onClose();
  };

  // Do not render anything if there is no action
  if (!isOpen || !actionType) {
    return null;
  }

  // Scheduling modal for Schedule action
  return (
    <Modal
      variant={ModalVariant.small}
      title="New Action"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="primary" onClick={handlerConfirmActionCreation} isDisabled={!isFormValid}>
          Confirm
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
      appendTo={document.body}
    >
      <Form>
        {/* Action Type selection */}
        <Tabs
          activeKey={actionType}
          onSelect={(_, key) => {
            const next = key as ActionTypes;
            setActionType(next);
            resetExecutionFields(next);
          }}
          isBox
        >
          <Tab
            eventKey={ActionTypes.INSTANT_ACTION}
            title={
              <TabTitleText>
                <OutlinedClockIcon /> Instant Action
              </TabTitleText>
            }
          >
            Create an Action to be executed immediately
          </Tab>
          <Tab
            eventKey={ActionTypes.SCHEDULED_ACTION}
            title={
              <TabTitleText>
                <CalendarAltIcon /> Schedule Action
              </TabTitleText>
            }
          >
            Create an Action to be executed in the future
          </Tab>
          <Tab
            eventKey={ActionTypes.CRON_ACTION}
            title={
              <TabTitleText>
                <SyncAltIcon /> Cron Action
              </TabTitleText>
            }
          >
            Create an Action to be executed as a CronJob
          </Tab>
        </Tabs>

        {/* Account selection */}
        <Title headingLevel="h3">Target</Title>
        <AccountTypeaheadSelect
          accounts={allAccounts}
          selectedAccount={selectedAccount}
          onSelectAccount={account => {
            setSelectedAccount(account);
          }}
          onClearAccount={onAccountClearButtonClick}
        />
        <ClusterTypeaheadSelect
          accountId={selectedAccount?.accountId ?? null}
          clusters={allClusters}
          selectedCluster={selectedCluster}
          onSelectCluster={cluster => {
            setSelectedCluster(cluster);
          }}
          isDisabled={!selectedAccount}
          onClearCluster={onClusterClearButtonClick}
        />
        <Divider />

        {/* Action selection */}
        <Title headingLevel="h3">Action Parameters</Title>
        <FormGroup label="Action Operation" isRequired>
          <ToggleGroup aria-label="Action Operation">
            <ToggleGroupItem
              text="Power On"
              buttonId="action-power-on"
              isSelected={isSelected === 'action-power-on'}
              onChange={() => {
                setActionOperation(ActionOperations.POWER_ON);
                setIsSelected('action-power-on');
              }}
            />
            <ToggleGroupItem
              text="Power Off"
              buttonId="action-power-off"
              isSelected={isSelected === 'action-power-off'}
              onChange={() => {
                setActionOperation(ActionOperations.POWER_OFF);
                setIsSelected('action-power-off');
              }}
            />
          </ToggleGroup>
        </FormGroup>
        <Divider />

        {/* Schedule management */}
        {actionType !== ActionTypes.INSTANT_ACTION && (
          <>
            <Title headingLevel="h3">Execution parameters</Title>
            {actionType === ActionTypes.SCHEDULED_ACTION && (
              <>
                <FormGroup label="Execution time" isRequired>
                  <DateTimePicker onChange={setScheduledDateTime} />
                </FormGroup>
              </>
            )}
            {actionType === ActionTypes.CRON_ACTION && (
              <>
                <FormGroup label="Cron Expression" isRequired>
                  <TextInput
                    type="text"
                    id="cron-expression-input"
                    value={cronExpression}
                    onChange={(_event, value) => setCronExpression(value)}
                    validated={isValidCronExpression(cronExpression) ? 'default' : 'error'}
                    placeholder="0 0 * * *"
                  />
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem>
                        Format: minute hour day-of-month month day-of-week (e.g., &apos;0 0 * * *&apos; for daily at
                        midnight)
                      </HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                </FormGroup>
              </>
            )}
            <FormGroup label="Action Enabled" isRequired>
              <Checkbox
                id="action-enabled"
                label="Enable action"
                isChecked={actionEnabled}
                onChange={(_event, checked) => setActionEnabled(checked)}
              />
            </FormGroup>
            <Divider />
          </>
        )}

        {/* Reason management */}
        <FormGroup label="Description">
          <TextInput
            type="text"
            id="description-input"
            value={description}
            onChange={(_event, value) => setDescription(value)}
            placeholder="Enter action description"
            aria-label="Reason for action"
          />
        </FormGroup>
      </Form>
    </Modal>
  );

  // Fallback: do not render if action does not match any known case
  return null;
};
