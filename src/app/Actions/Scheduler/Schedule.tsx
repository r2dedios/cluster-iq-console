import React from 'react';
import { ModalPowerManagement } from './components/ModalPowerManagement';
import {
  Flex,
  FlexItem,
  Button,
  PageSection,
  PageSectionVariants,
  Panel,
  TextContent,
  Text,
} from '@patternfly/react-core';
import ScheduleActionsTable from './components/ActionsTable';

const Scheduler: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [reloadFlag, setReloadFlag] = React.useState(0);

  const onClick = () => {
    setIsModalOpen(true);
  };

  const resetModalState = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <TextContent>
              <Text component="h1">Scheduled Actions</Text>
            </TextContent>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={onClick}>
              New Action
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <ScheduleActionsTable actionType={null} reloadFlag={reloadFlag} />
        </Panel>
        <ModalPowerManagement
          isOpen={isModalOpen}
          onClose={resetModalState}
          onCreated={() => setReloadFlag(k => k + 1)}
        />
      </PageSection>
    </React.Fragment>
  );
};

export default Scheduler;
