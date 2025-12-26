import { ResourceStatusApi } from '@api';
import { Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleElement } from '@patternfly/react-core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ActionOperations, ActionTypes } from '@app/types/types';

interface ClusterDetailsDropdownProps {
  clusterStatus: ResourceStatusApi | null;
}

export const ClusterDetailsDropdown: React.FunctionComponent<ClusterDetailsDropdownProps> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  useParams();

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

  // TODO restore ModalWindow for confirming action
  //const resetModalState = () => {
  //  setIsModalOpen(false);
  //  setActionOperation(null);
  //  setActionType(null);
  //};

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
        </DropdownList>
      </Dropdown>
    </>
  );
};
