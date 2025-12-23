import React from 'react';
import {
  Flex,
  FlexItem,
  Button,
  PageSection,
  PageSectionVariants,
  Panel,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { parseAsArrayOf, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { ClusterActions } from '@app/types/types';
import { SchedulerTable } from './SchedulerTable';

const filterParams = {
  accountName: parseAsString.withDefault(''),
  action: parseAsArrayOf(parseAsStringEnum<ClusterActions>(Object.values(ClusterActions))).withDefault([]),
  type: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  enabled: parseAsString.withDefault(''),
};

const Scheduler: React.FunctionComponent = () => {
  const [{ accountName, action, type, status, enabled }] = useQueryStates(filterParams);

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
          <SchedulerTable
            type={type}
            accountName={accountName}
            action={action}
            cluster=""
            status={status}
            enabled={enabled as '' | 'yes' | 'no'}
          />
        </Panel>
      </PageSection>
    </React.Fragment>
  );
};

export default Scheduler;
