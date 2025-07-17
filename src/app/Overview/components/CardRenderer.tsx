/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { CardLayout } from '@app/Overview/types.ts';
import { Divider, Flex, FlexItem, Stack } from '@patternfly/react-core';

// TODO Avoid any
export const RenderSingleIcon: React.FunctionComponent<{ content: any[] }> = ({ content }) => content[0]?.icon;
// TODO Avoid any
export const RenderMultiIcon: React.FunctionComponent<{ content: any[] }> = ({ content }) => (
  <Flex display={{ default: 'inlineFlex' }}>
    {content.map(({ icon, value, ref }, index) => (
      <React.Fragment key={index}>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>{icon}</FlexItem>
          <FlexItem>{ref ? <a href={ref}>{value}</a> : <span>{value}</span>}</FlexItem>
        </Flex>
        {content.length > 1 && index < content.length - 1 && <Divider orientation={{ default: 'vertical' }} />}
      </React.Fragment>
    ))}
  </Flex>
);
// TODO Avoid any
export const RenderWithSubtitle: React.FC<{ content: any[] }> = ({ content }) => (
  <Flex justifyContent={{ default: 'justifyContentSpaceAround' }}>
    {content.map(({ icon, status, subtitle }, index) => (
      <Flex key={index}>
        <FlexItem>{icon}</FlexItem>
        <Stack>
          <a href="#">{status}</a>
          <span>{subtitle}</span>
        </Stack>
      </Flex>
    ))}
  </Flex>
);
// TODO Avoid any
export const renderContent = (content: any[], layout: CardLayout) => {
  switch (layout) {
    case CardLayout.SINGLE_ICON:
      return <RenderSingleIcon content={content} />;
    case CardLayout.MULTI_ICON:
      return <RenderMultiIcon content={content} />;
    case CardLayout.WITH_SUBTITLE:
      return <RenderWithSubtitle content={content} />;
  }
};
