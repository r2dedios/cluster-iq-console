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
} from '@patternfly/react-core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { startCluster, stopCluster } from '@app/services/api';

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

  const handleConfirm = () => {
    if (modalAction) {
      console.log(`Sending request to ${modalAction.toLowerCase()} the cluster...`);
      if (modalAction === PowerAction.POWER_ON) {
        startCluster(clusterID);
        console.log('Powering on the cluster');
      } else if (modalAction === PowerAction.POWER_OFF) {
        stopCluster(clusterID);
        console.log('Powering off the cluster');
      }
    }
    setIsModalOpen(false);
    setModalAction(null);
  };

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        onSelect={onSelect}
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
          onClose={() => setIsModalOpen(false)}
          actions={[
            <Button key="confirm" variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>,
            <Button key="cancel" variant="link" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
          ]}
        >
          Are you sure you want to {modalAction?.toLowerCase()} the cluster?
        </Modal>
      )}
    </>
  );
};
