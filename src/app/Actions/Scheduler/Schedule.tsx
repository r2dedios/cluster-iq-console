import React from 'react';
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
            <Button variant="primary" onClick={() => navigate('/actions/create')}>
              New Action
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <ScheduleActionsTable actionType={null} />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Scheduler;
