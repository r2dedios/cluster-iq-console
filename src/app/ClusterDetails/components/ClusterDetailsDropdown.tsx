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
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCluster, startCluster, stopCluster } from '@app/services/api';

export enum PowerAction {
  POWER_ON = 'Power on',
  POWER_OFF = 'Power off',
}

export const ClusterDetailsDropdown: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { clusterID } = useParams();
  const [isPowerOnDisabled, setIsPowerOnDisabled] = React.useState(false);
  const [isPowerOffDisabled, setIsPowerOffDisabled] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalAction, setModalAction] = React.useState<PowerAction | null>(null);

  useEffect(() => {
    const checkClusterState = async () => {
      const fetchedCluster = await getCluster(clusterID);
      const isRunning = fetchedCluster.clusters[0]?.status === ClusterStates.Running;
      setIsPowerOnDisabled(isRunning);
      setIsPowerOffDisabled(!isRunning);
    };

    checkClusterState();
  }, [clusterID]);

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
