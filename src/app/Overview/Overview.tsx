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

const AggregateStatusCards: React.FunctionComponent = () => {
  const { inventoryData } = useDashboardData();

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
    instances: inventoryData.instances.count,
    lastScanTimestamp: inventoryData.scanner?.last_scan_timestamp,
  };

  const cardData = generateCards(dashboardState);

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Overview</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          {Object.entries(cardData).map(([, cards], groupIndex) => (
            <GridItem key={groupIndex}>
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
                    <CardBody>{renderContent(card.content, card.layout)}</CardBody>
                  </Card>
                ))}
              </Gallery>
            </GridItem>
          ))}
        </Grid>
      </PageSection>
    </React.Fragment>
  );
};

export default AggregateStatusCards;
