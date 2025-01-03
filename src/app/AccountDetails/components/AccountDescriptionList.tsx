import { parseNumberToCurrency, parseScanTimestamp } from '@app/utils/parseFuncs';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';

import { AccountDescriptionListProps } from './types';
import React from 'react';

export const AccountDescriptionList: React.FunctionComponent<AccountDescriptionListProps> = ({ account }) => {
  return (
    <DescriptionList columnModifier={{ lg: '2Col' }} aria-labelledby="open-tabs-example-tabs-list-details-title">
      <DescriptionListGroup>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDescription>{account.name}</DescriptionListDescription>
        <DescriptionListTerm>Account ID</DescriptionListTerm>
        <DescriptionListDescription>{account.id}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Cloud Provider</DescriptionListTerm>
        <DescriptionListDescription>{account.provider}</DescriptionListDescription>
        <DescriptionListTerm>Account Total Cost (Estimated)</DescriptionListTerm>
        <DescriptionListDescription>{parseNumberToCurrency(account.totalCost)}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup></DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Last scanned at</DescriptionListTerm>
        <DescriptionListDescription>{parseScanTimestamp(account.lastScanTimestamp)}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup></DescriptionListGroup>
    </DescriptionList>
  );
};
