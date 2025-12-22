import { PageSection, PageSectionVariants, Panel, TextContent, Text } from '@patternfly/react-core';
import React from 'react';
import ScheduleActionsTable from './components/ActionsTable';

const ScheduleActions: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Scheduled Actions</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Panel>
          <ScheduleActionsTable actionType={null} />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default ScheduleActions;
