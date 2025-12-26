import { renderActionTypeLabel, renderOperationLabel, renderStatusLabel } from '@app/utils/renderUtils';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Label } from '@patternfly/react-core';
import React, { useState, useEffect } from 'react';
import { ActionTypes } from '@app/types/types';
import { Link } from 'react-router-dom';
import { api, ActionResponseApi } from '@api';
import { LoadingSpinner } from '@app/components/common/LoadingSpinner';
import { TablePagination } from '@app/components/common/TablesPagination';
import { paginateItems, filterByActionType } from '@app/utils/tableFilters';
import { fetchAllPages } from '@app/utils/fetchAllPages';
import { ActionsColumn } from '@patternfly/react-table';
import { rowActions } from './ActionsKebabMenu';

export const ScheduleActionsTable: React.FunctionComponent<{
  actionType: ActionTypes | null;
  reloadFlag: number;
}> = ({ actionType, reloadFlag }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [allActions, setAllActions] = useState<ActionResponseApi[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect logic abstracted in this function to be reused in the kebab menu
  const reloadActions = async () => {
    setLoading(true);
    try {
      const allItems = await fetchAllPages(async (page, pageSize) => {
        const { data } = await api.schedule.scheduleList({
          page,
          page_size: pageSize,
        });
        return { items: data.items || [], count: data.count || 0 };
      });
      setAllActions(allItems);
    } catch (error) {
      console.error('Error fetching ScheduleActions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadActions();
  }, [reloadFlag]);

  let filtered = allActions;
  filtered = filterByActionType(filtered, actionType);

  const paginated = paginateItems(filtered, page, perPage);

  const columnNames = {
    id: 'ID',
    type: 'Action Type',
    time: 'Time',
    cronExpression: 'Cron Expression',
    operation: 'Operation',
    status: 'Status',
    clusterId: 'Cluster ID',
    accountId: 'Account ID',
    region: 'Region',
    enabled: 'Enabled',
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table aria-label="ScheduleActions table">
          <Thead>
            <Tr>
              <Th>{columnNames.id}</Th>
              <Th>{columnNames.type}</Th>
              <Th>{columnNames.time}</Th>
              <Th>{columnNames.cronExpression}</Th>
              <Th>{columnNames.operation}</Th>
              <Th>{columnNames.status}</Th>
              <Th>{columnNames.clusterId}</Th>
              <Th>{columnNames.region}</Th>
              <Th>{columnNames.accountId}</Th>
              <Th>{columnNames.enabled}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map(action => (
              <Tr key={action.id}>
                <Td dataLabel={columnNames.id}>{action.id}</Td>
                <Td dataLabel={columnNames.type}>{renderActionTypeLabel(action.type)}</Td>
                <Td dataLabel={columnNames.time}>{action.type === 'scheduled_action' ? action.time : '-'}</Td>
                <Td dataLabel={columnNames.cronExpression}>
                  {action.type === 'cron_action' ? action.cronExpression : '-'}
                </Td>
                <Td dataLabel={columnNames.operation}>{renderOperationLabel(action.operation)}</Td>
                <Td dataLabel={columnNames.status}>{renderStatusLabel(action.status)}</Td>
                <Td dataLabel={columnNames.clusterId}>
                  <Link to={`/clusters/${action.clusterId}`}>{action.clusterId}</Link>
                </Td>
                <Td dataLabel={columnNames.region}>{action.region}</Td>
                <Td dataLabel={columnNames.accountId}>
                  <Link to={`/accounts/${action.accountId}`}>{action.accountId}</Link>
                </Td>
                <Td dataLabel={columnNames.enabled}>
                  {action.enabled ? <Label color="green">Enabled</Label> : <Label color="red">Disabled</Label>}
                </Td>
                {/* Kebab actions per row */}
                <Td isActionCell aria-label="Row actions">
                  <ActionsColumn items={rowActions(action, reloadActions)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <TablePagination
        itemCount={filtered.length}
        page={page}
        perPage={perPage}
        onSetPage={setPage}
        onPerPageSelect={setPerPage}
      />
    </>
  );
};

export default ScheduleActionsTable;
