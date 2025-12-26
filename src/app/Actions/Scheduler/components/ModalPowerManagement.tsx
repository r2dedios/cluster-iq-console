import {
  Button,
  Checkbox,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Modal,
  ModalVariant,
  Radio,
  Stack,
  StackItem,
  TextInput,
  Divider,
  Flex,
  FlexItem,
  Text,
} from '@patternfly/react-core';
import React from 'react';
import { ActionOperations, ActionTypes } from '@app/types/types';
import DateTimePicker from './DateTimePicker';
import { AccountTypeaheadSelect } from './AccountSelector';
import { ClusterTypeaheadSelect } from './ClusterSelector';
import { ActionStatus } from '@app/types/types';
import { useUser } from '@app/Contexts/UserContext.tsx';
import { debug } from '@app/utils/debugLogs';
import { api, startCluster, stopCluster, AccountResponseApi, ClusterResponseApi, ActionRequestApi } from '@api';
import { fetchAllPages } from '@app/utils/fetchAllPages';

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
  const [showDescriptionField, setShowDescriptionField] = React.useState(false);
  const [description, setDescription] = React.useState<string>('');
  const [showSchedule, setShowSchedule] = React.useState(false);
  const [scheduledDateTime, setScheduledDateTime] = React.useState('');
  const [cronExpression, setCronExpression] = React.useState('');
  const [actionOperation, setActionOperation] = React.useState('');
  const [selectedAccount, setSelectedAccount] = React.useState<AccountResponseApi | null>(null);
  const [selectedCluster, setSelectedCluster] = React.useState<ClusterResponseApi | null>(null);
  // TODO: restore Loading spinner
  //const [loading, setLoading] = React.useState(true);
  const [allAccounts, setAllAccounts] = React.useState<AccountResponseApi[]>([]);
  const [allClusters, setAllClusters] = React.useState<ClusterResponseApi[]>([]);
  const [actionType, setActionType] = React.useState<ActionTypes>(ActionTypes.INSTANT_ACTION);

  // const isInstantAction = actionType === ActionTypes.INSTANT_ACTION;
  // const isScheduleAction = actionType === ActionTypes.SCHEDULED_ACTION;

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

    setShowDescriptionField(false);
    setDescription('');
    setShowSchedule(false);
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

    const finalDescription = showDescriptionField ? description : 'Routine maintenance';

    // Instant Action run
    if (actionType === ActionTypes.INSTANT_ACTION) {
      if (actionOperation === ActionOperations.POWER_ON) {
        debug('Powering on the cluster');
        startCluster(selectedCluster?.clusterId, userEmail, finalDescription);
      } else if (actionOperation === ActionOperations.POWER_OFF) {
        debug('Powering off the cluster');
        stopCluster(selectedCluster?.clusterId, userEmail, finalDescription);
      }
    } else {
      // Creating base action. Tunning depending on ActionType
      const powerActionRequest = {
        accountId: selectedAccount?.accountId,
        clusterId: selectedCluster?.clusterId,
        enabled: true,
        operation: actionOperation,
        region: selectedCluster?.region,
        status: ActionStatus.Pending,
        description: finalDescription,
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
      title="Power management"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="primary" onClick={handlerConfirmActionCreation}>
          Confirm
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
      appendTo={document.body}
    >
      {/* Account selection */}

      <Stack hasGutter>
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Text component="h2">Target</Text>
          </FlexItem>
          <FlexItem grow={{ default: 'grow' }}>
            <Divider />
          </FlexItem>
        </Flex>
        <StackItem>
          <AccountTypeaheadSelect
            accounts={allAccounts}
            selectedAccount={selectedAccount}
            onSelectAccount={account => {
              setSelectedAccount(account);
            }}
          />
          <ClusterTypeaheadSelect
            accountId={selectedAccount?.accountId ?? null}
            clusters={allClusters}
            selectedCluster={selectedCluster}
            onSelectCluster={cluster => {
              setSelectedCluster(cluster);
            }}
            isDisabled={!selectedAccount}
          />
        </StackItem>
        <Divider />

        {/* Action selection */}
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Text component="h2">Action</Text>
          </FlexItem>
          <FlexItem grow={{ default: 'grow' }}>
            <Divider />
          </FlexItem>
        </Flex>
        <StackItem>
          <Radio
            id="action-power-on"
            name="action"
            label="Power On"
            onChange={() => setActionOperation(ActionOperations.POWER_ON)}
          />
          <Radio
            id="action-power-off"
            name="action"
            label="Power Off"
            onChange={() => setActionOperation(ActionOperations.POWER_OFF)}
          />
        </StackItem>

        {/* Schedule management */}
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Text component="h2">Execution</Text>
          </FlexItem>
          <FlexItem grow={{ default: 'grow' }}>
            <Divider />
          </FlexItem>
        </Flex>
        <StackItem>
          <Checkbox
            id="scheduled-action-type"
            name="scheduled-action-type"
            label="Schedule Action"
            isChecked={showSchedule}
            onChange={(_event, checked) => {
              setShowSchedule(checked);
              setActionType(checked ? ActionTypes.SCHEDULED_ACTION : ActionTypes.INSTANT_ACTION);
            }}
          />
        </StackItem>
        {showSchedule && (
          <>
            <StackItem>
              <Radio
                id="specific-time"
                name="scheduleType"
                label="Specific time"
                isChecked={actionType === ActionTypes.SCHEDULED_ACTION}
                onChange={() => setActionType(ActionTypes.SCHEDULED_ACTION)}
              />
            </StackItem>
            {actionType === ActionTypes.SCHEDULED_ACTION && (
              <StackItem>
                <DateTimePicker onChange={setScheduledDateTime} />
              </StackItem>
            )}
            <StackItem>
              <Radio
                id="cron-expression"
                name="scheduleType"
                label="Cron expression"
                isChecked={actionType === ActionTypes.CRON_ACTION}
                onChange={() => setActionType(ActionTypes.CRON_ACTION)}
              />
            </StackItem>
            {actionType === ActionTypes.CRON_ACTION && (
              <StackItem>
                <TextInput
                  type="text"
                  id="cron-expression-input"
                  value={cronExpression}
                  onChange={(_event, value) => setCronExpression(value)}
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
              </StackItem>
            )}
          </>
        )}

        {/* Reason management */}
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Text component="h2">Description (Optional)</Text>
          </FlexItem>
          <FlexItem grow={{ default: 'grow' }}>
            <Divider />
          </FlexItem>
        </Flex>
        <StackItem>
          <Checkbox
            label="Specify reason"
            isChecked={showDescriptionField}
            onChange={(_event, checked) => setShowDescriptionField(checked)}
            id="specify-reason"
          />
        </StackItem>
        {showDescriptionField && (
          <StackItem>
            <TextInput
              type="text"
              id="description-input"
              value={description}
              onChange={(_event, value) => setDescription(value)}
              placeholder="Enter reason"
              aria-label="Reason for action"
            />
          </StackItem>
        )}
      </Stack>
    </Modal>
  );

  // Fallback: do not render if action does not match any known case
  return null;
};
