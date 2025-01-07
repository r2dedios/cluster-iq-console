import { Flex, FlexItem, Label, PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import { AccountsHeaderProps } from './types';
import React from 'react';

export const AccountsHeader: React.FunctionComponent<AccountsHeaderProps> = ({ accountName, label }) => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Flex
        spaceItems={{ default: 'spaceItemsMd' }}
        alignItems={{ default: 'alignItemsFlexStart' }}
        flexWrap={{ default: 'nowrap' }}
      >
        <FlexItem>
          <Label color="blue">{label}</Label>
        </FlexItem>
        <FlexItem>
          <Title headingLevel="h1" size="2xl">
            {accountName}
          </Title>
        </FlexItem>
      </Flex>
    </PageSection>
  );
};

export default AccountsHeader;
