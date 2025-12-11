import { ClusterStates } from '@app/types/types';
import { Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleElement } from '@patternfly/react-core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ModalPowerManagement } from './ModalPowerManagement';

export enum ActionOperations {
  POWER_ON = 'Power On',
  POWER_OFF = 'Power Off',
}

export enum ActionTypes {
  INSTANT_ACTION = 'Instant Action',
  SCHEDULED_ACTION = 'Scheduled Action',
}

interface ClusterDetailsDropdownProps {
  clusterStatus: ClusterStates | null;
}

export const ClusterDetailsDropdown: React.FunctionComponent<ClusterDetailsDropdownProps> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [actionOperation, setActionOperation] = React.useState<ActionOperations | null>(null);
  const [actionType, setActionType] = React.useState<ActionTypes | null>(null);

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    const operation = value as ActionOperations | undefined;
    if (operation === ActionOperations.POWER_ON || operation === ActionOperations.POWER_OFF) {
      setActionOperation(operation);
      setActionType(ActionTypes.INSTANT_ACTION);
    } else {
      setActionOperation(null);
      setActionType(ActionTypes.SCHEDULED_ACTION);
    }
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const resetModalState = () => {
    setIsModalOpen(false);
    setActionOperation(null);
    setActionType(null);
  };

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        onSelect={onSelect}
        onOpenChange={setIsOpen}
        popperProps={{
          position: 'end',
        }}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle ref={toggleRef} onClick={() => setIsOpen(!isOpen)} isExpanded={isOpen}>
            Actions
          </MenuToggle>
        )}
      >
        <DropdownList>
          <DropdownItem value={ActionOperations.POWER_ON} type={ActionTypes.INSTANT_ACTION} key="power on">
            {ActionOperations.POWER_ON}
          </DropdownItem>
          <DropdownItem value={ActionOperations.POWER_OFF} type={ActionTypes.INSTANT_ACTION} key="power off">
            {ActionOperations.POWER_OFF}
          </DropdownItem>
          <DropdownItem value="schedule" key="schedule">
            {ActionTypes.SCHEDULED_ACTION}
          </DropdownItem>
        </DropdownList>
      </Dropdown>

      <ModalPowerManagement
        isOpen={isModalOpen}
        onClose={resetModalState}
        actionOperation={actionOperation}
        actionType={actionType}
      />
    </>
  );
};
