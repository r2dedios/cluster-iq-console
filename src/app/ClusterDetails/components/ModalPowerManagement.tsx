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
} from '@patternfly/react-core';
import React from 'react';
import { ActionOperations, ActionTypes } from './ClusterDetailsDropdown';
import DateTimePicker from './DateTimePicker';
import { CronAction, ScheduledAction } from './types';
import { useParams } from 'react-router-dom';
import { useUser } from '@app/Contexts/UserContext.tsx';
import { startCluster, stopCluster, createScheduledAction } from '@app/services/api';
import { debug } from '@app/utils/debugLogs';

type PowerManagementData = ScheduledAction | CronAction;

interface ModalPowerManagementProps {
  isOpen: boolean;
  onClose: () => void;
  actionOperation: ActionOperations | null;
  actionType: ActionTypes | null;
}

export const ModalPowerManagement: React.FunctionComponent<ModalPowerManagementProps> = ({
  isOpen,
  onClose,
  actionOperation,
  actionType,
}) => {
  const { clusterID } = useParams();
  const { userEmail } = useUser();
  const [showDescriptionField, setShowDescriptionField] = React.useState(false);
  const [description, setDescription] = React.useState<string>('');
  const [showSchedule, setShowSchedule] = React.useState(false);
  const [scheduleType, setScheduleType] = React.useState<'scheduled_action' | 'cron_action'>('scheduled_action');
  const [scheduledDateTime, setScheduledDateTime] = React.useState('');
  const [cronExpression, setCronExpression] = React.useState('');
  const [action, setAction] = React.useState('');

  const isInstantAction = actionType === ActionTypes.INSTANT_ACTION;
  const isScheduleAction = actionType === ActionTypes.SCHEDULED_ACTION;

  // Reset local state when modal closes
  React.useEffect(() => {
    if (!isOpen || !actionType) {
      setShowDescriptionField(false);
      setDescription('');
      setShowSchedule(false);
      setScheduleType('scheduled_action');
      setScheduledDateTime('');
      setCronExpression('');
    }
  }, [isOpen]);

  const handleConfirmPower = async () => {
    // Ensure clusterID is not undefined before performing any action
    if (!clusterID) {
      console.error('ClusterID is undefined. Cannot perform power action');
      return;
    }

    // Use a static description for direct power actions
    const finalDescription = 'Routine maintenance';

    if (actionOperation === ActionOperations.POWER_ON) {
      debug('Powering on the cluster');
      startCluster(clusterID, userEmail, finalDescription);
    } else if (actionOperation === ActionOperations.POWER_OFF) {
      debug('Powering off the cluster');
      stopCluster(clusterID, userEmail, finalDescription);
    }

    onClose();
  };

  const handleConfirmSchedule = async () => {
    // Ensure clusterID is not undefined before performing any action
    if (!clusterID) {
      console.error('ClusterID is undefined. Cannot perform scheduled action');
      return;
    }

    const finalDescription = showDescriptionField ? description : 'Routine maintenance';

    // Scheduled or Cron Action
    let powerActionRequest: PowerManagementData;
    if (scheduleType === 'scheduled_action') {
      if (!scheduledDateTime) {
        console.error('Scheduled DateTime is required');
        return;
      }
      powerActionRequest = {
        type: 'scheduled_action',
        time: scheduledDateTime,
        operation: action === ActionOperations.POWER_ON ? 'PowerOnCluster' : 'PowerOffCluster',
        target: { clusterID },
        enabled: true,
        status: 'Pending',
        description: finalDescription,
      } as ScheduledAction;
    } else {
      if (!cronExpression.trim()) {
        console.error('Cron expression is empty');
        return;
      }

      powerActionRequest = {
        type: 'cron_action',
        cronExp: cronExpression.trim(),
        operation: action === ActionOperations.POWER_ON ? 'PowerOnCluster' : 'PowerOffCluster',
        target: { clusterID },
        enabled: true,
        status: 'Pending',
        description: finalDescription,
      } as CronAction;
    }

    const requestPayload = [powerActionRequest];

    try {
      await createScheduledAction(requestPayload);
      debug('Scheduled action created:', requestPayload);
    } catch (error) {
      console.error('Failed to schedule action:', error);
    }

    onClose();
  };

  // Do not render anything if there is no action
  if (!isOpen || !actionType) {
    return null;
  }

  // Confirmation modal for direct POWER_ON / POWER_OFF
  if (isInstantAction && !isScheduleAction) {
    return (
      <Modal
        variant={ModalVariant.small}
        title="Confirm Power On/Off Action"
        isOpen={isOpen}
        onClose={onClose}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleConfirmPower}>
            Yes
          </Button>,
          <Button key="cancel" variant="link" onClick={onClose}>
            No
          </Button>,
        ]}
        appendTo={document.body}
      >
        {/* Simple confirmation message */}
        Are you sure you want to {actionOperation} the cluster: {clusterID}?
      </Modal>
    );
  }

  // Scheduling modal for Schedule action
  if (isScheduleAction) {
    return (
      <Modal
        variant={ModalVariant.small}
        title="Power management"
        isOpen={isOpen}
        onClose={onClose}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleConfirmSchedule}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={onClose}>
            Cancel
          </Button>,
        ]}
        appendTo={document.body}
      >
        <Stack hasGutter>
          <StackItem>Configure the power management options for this cluster.</StackItem>

          {/* Action selection */}
          <StackItem>
            <Radio
              id="action-power-on"
              name="action"
              label="Power On"
              onChange={() => setAction(ActionOperations.POWER_ON)}
            />
            <Radio
              id="action-power-off"
              name="action"
              label="Power Off"
              onChange={() => setAction(ActionOperations.POWER_OFF)}
            />
          </StackItem>

          {/* Reason management */}
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

          {/* Schedule management */}
          <StackItem>
            <Checkbox
              label="Schedule"
              isChecked={showSchedule}
              onChange={(_event, checked) => setShowSchedule(checked)}
              id="specify-schedule"
            />
          </StackItem>
          {showSchedule && (
            <>
              <StackItem>
                <Radio
                  id="specific-time"
                  name="scheduleType"
                  label="Specific time"
                  isChecked={scheduleType === 'scheduled_action'}
                  onChange={() => setScheduleType('scheduled_action')}
                />
              </StackItem>
              {scheduleType === 'scheduled_action' && (
                <StackItem>
                  <DateTimePicker onChange={setScheduledDateTime} />
                </StackItem>
              )}
              <StackItem>
                <Radio
                  id="cron-expression"
                  name="scheduleType"
                  label="Cron expression"
                  isChecked={scheduleType === 'cron_action'}
                  onChange={() => setScheduleType('cron_action')}
                />
              </StackItem>
              {scheduleType === 'cron_action' && (
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
        </Stack>
      </Modal>
    );
  }

  // Fallback: do not render if action does not match any known case
  return null;
};
