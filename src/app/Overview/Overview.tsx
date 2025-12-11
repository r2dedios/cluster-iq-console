/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Gallery,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
} from '@patternfly/react-core';
import { LoadingSpinner } from '@app/components/common/LoadingSpinner';
import { generateCards } from './components/CardData';
import { CloudProvider } from './types';
import { renderContent } from './components/CardRenderer';
import { useDashboardData } from './hooks/useDashboardData';
import { useEventsData } from './hooks/useEventsData';

const AggregateStatusCards: React.FunctionComponent = () => {
  const { inventoryData } = useDashboardData();
  const { events, loading: eventsLoading, error: eventsError } = useEventsData();

  if (!inventoryData) {
    return <LoadingSpinner />;
  }

  const dashboardState = {
    clustersByStatus: {
      running: inventoryData?.clusters?.running || 0,
      stopped: inventoryData?.clusters?.stopped || 0,
      unknown: inventoryData?.clusters?.unknown || 0,
      terminated: inventoryData?.clusters?.archived || 0,
    },
    instancesByStatus: {
      running: inventoryData?.instances?.running || 0,
      stopped: inventoryData?.instances?.stopped || 0,
      terminated: inventoryData?.instances?.archived || 0,
    },
    clustersByProvider: {
      [CloudProvider.AWS]: inventoryData.providers.aws?.cluster_count || 0,
      [CloudProvider.GCP]: inventoryData.providers.gcp?.cluster_count || 0,
      [CloudProvider.AZURE]: inventoryData.providers.azure?.cluster_count || 0,
    },
    accountsByProvider: {
      [CloudProvider.AWS]: inventoryData.providers.aws?.account_count || 0,
      [CloudProvider.GCP]: inventoryData.providers.gcp?.account_count || 0,
      [CloudProvider.AZURE]: inventoryData.providers.azure?.account_count || 0,
    },
    instances: (inventoryData?.instances?.running || 0) + (inventoryData?.instances?.stopped || 0),
    lastScanTimestamp: inventoryData.scanner?.last_scan_timestamp,
  };

  const cardData = generateCards(dashboardState, events);

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Overview</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          {Object.entries(cardData).map(([groupName, cards], groupIndex) => (
            <GridItem key={groupIndex} span={groupName === 'activityCards' ? 12 : undefined}>
              {groupName === 'activityCards' ? (
                // Full width Activity card with double height
                <Card style={{ minHeight: '500px' }} component="div">
                  <CardTitle style={{ textAlign: 'center' }}>{cards[0].title}</CardTitle>
                  <CardBody style={{ minHeight: '450px', padding: '1rem' }}>
                    {eventsLoading ? (
                      <LoadingSpinner />
                    ) : eventsError ? (
                      <div style={{ color: 'red' }}>
                        Error: {eventsError}
                        <br />
                        <small>Check console for details</small>
                      </div>
                    ) : cards[0].customComponent ? (
                      cards[0].customComponent
                    ) : (
                      renderContent(cards[0].content, cards[0].layout, cards[0].totalCount)
                    )}
                  </CardBody>
                </Card>
              ) : (
                // Regular cards in Gallery
                <Gallery
                  hasGutter
                  style={
                    {
                      '--pf-v5-l-gallery--GridTemplateColumns--min': '30%',
                    } as any
                  }
                >
                  {cards.map((card, cardIndex) => (
                    <Card style={{ textAlign: 'center' }} key={`${groupIndex}${cardIndex}`} component="div">
                      <CardTitle>{card.title}</CardTitle>
                      <CardBody>{renderContent(card.content, card.layout, card.totalCount)}</CardBody>
                    </Card>
                  ))}
                </Gallery>
              )}
            </GridItem>
          ))}
        </Grid>
      </PageSection>
    </React.Fragment>
  );
};

export default AggregateStatusCards;
