import { ClusterStates } from '@app/types/types';
import {
  Dropdown,
  MenuToggleElement,
  MenuToggle,
  DropdownList,
  DropdownItem,
  Modal,
  ModalVariant,
  Button,
  Checkbox,
  Stack,
  StackItem,
  TextArea,
} from '@patternfly/react-core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { startCluster, stopCluster } from '@app/services/api';
import { useUser } from '@app/Contexts/UserContext';

export enum PowerAction {
  POWER_ON = 'Power on',
  POWER_OFF = 'Power off',
}

interface ClusterDetailsDropdownProps {
  clusterStatus: ClusterStates | null;
}

export const ClusterDetailsDropdown: React.FunctionComponent<ClusterDetailsDropdownProps> = ({ clusterStatus }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { clusterID } = useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalAction, setModalAction] = React.useState<PowerAction | null>(null);
  const [showDescriptionField, setShowDescriptionField] = React.useState(false);
  const [description, setDescription] = React.useState<string>('');
  const { userEmail } = useUser();

  // Disable actions based on cluster status
  const isPowerOnDisabled =
    clusterStatus === null || [ClusterStates.Running, ClusterStates.Terminated].includes(clusterStatus);

  const isPowerOffDisabled =
    clusterStatus === null || [ClusterStates.Stopped, ClusterStates.Terminated].includes(clusterStatus);

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (value === PowerAction.POWER_ON || value === PowerAction.POWER_OFF) {
      setModalAction(value as PowerAction);
      setIsModalOpen(true);
      setIsOpen(false);
    }
  };

  const resetModalState = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setShowDescriptionField(false);
    setDescription('');
  };

  const handleConfirm = () => {
    if (modalAction) {
      console.log(`Sending request to ${modalAction.toLowerCase()} the cluster...`);
      if (modalAction === PowerAction.POWER_ON) {
        startCluster(clusterID, userEmail, showDescriptionField ? description : undefined);
        console.log('Powering on the cluster');
      } else if (modalAction === PowerAction.POWER_OFF) {
        stopCluster(clusterID, userEmail, showDescriptionField ? description : undefined);
        console.log('Powering off the cluster');
      }
    }
    resetModalState();
  };

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        onSelect={onSelect}
        onOpenChange={setIsOpen}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle ref={toggleRef} onClick={() => setIsOpen(!isOpen)} isExpanded={isOpen}>
            Actions
          </MenuToggle>
        )}
      >
        <DropdownList>
          <DropdownItem value={PowerAction.POWER_ON} key="power on" isDisabled={isPowerOnDisabled}>
            {PowerAction.POWER_ON}
          </DropdownItem>
          <DropdownItem value={PowerAction.POWER_OFF} key="power off" isDisabled={isPowerOffDisabled}>
            {PowerAction.POWER_OFF}
          </DropdownItem>
        </DropdownList>
      </Dropdown>

      {isModalOpen && (
        <Modal
          variant={ModalVariant.small}
          title="Confirmation"
          isOpen={isModalOpen}
          onClose={resetModalState}
          actions={[
            <Button key="confirm" variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>,
            <Button key="cancel" variant="link" onClick={resetModalState}>
              Cancel
            </Button>,
          ]}
        >
          <Stack hasGutter>
            <StackItem>Are you sure you want to {modalAction?.toLowerCase()} the cluster?</StackItem>

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
                <TextArea
                  value={description}
                  onChange={(_event, value) => setDescription(value)}
                  aria-label="Enter a reason..."
                  placeholder="Enter a reason..."
                  resizeOrientation="vertical"
                />
              </StackItem>
            )}
          </Stack>
        </Modal>
      )}
    </>
  );
};
