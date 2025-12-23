import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { EmptyState, EmptyStateHeader, EmptyStateIcon } from '@patternfly/react-core';
import { SystemEventResponseApi } from '@api';
import { Link } from 'react-router-dom';
import { getResultIcon } from '@app/utils/renderUtils';
import { resolveResourcePath } from '@app/utils/parseFuncs';
import { InboxIcon } from '@patternfly/react-icons';

interface ActivityTableProps {
  events: SystemEventResponseApi[];
}

export const ActivityTable: React.FunctionComponent<ActivityTableProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <EmptyState>
        <EmptyStateHeader titleText="No recent events" headingLevel="h4" icon={<EmptyStateIcon icon={InboxIcon} />} />
      </EmptyState>
    );
  }

  return (
    <Table aria-label="Recent events table" variant="compact">
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Result</Th>
          <Th>Action</Th>
          <Th>Resource</Th>
          <Th>Triggered By</Th>
          <Th>Time</Th>
        </Tr>
      </Thead>
      <Tbody>
        {events.map(event => (
          <Tr key={event.id}>
            <Td>{getResultIcon(event.result)}</Td>
            <Td>{event.result}</Td>
            <Td>{event.action}</Td>
            <Td>
              <Link to={resolveResourcePath(event.resourceType ?? '-', event.resourceId ?? '-')}>
                {event.resourceId}
              </Link>
            </Td>
            <Td>{event.triggeredBy}</Td>
            <Td>{event.timestamp ? new Date(event.timestamp).toLocaleString() : '-'}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
