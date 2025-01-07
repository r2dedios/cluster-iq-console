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
import { ClusterStates } from '@app/types/types';
import { generateCards } from './components/CardData';
import { CloudProvider } from './types';
import { renderContent } from './components/CardRenderer';
import { useDashboardData } from './hooks/useDashboardData';

const AggregateStatusCards: React.FunctionComponent = () => {
  const { clusterData, clusterPerCP, instances } = useDashboardData();

  if (!clusterData || !clusterPerCP || !instances) {
    return <LoadingSpinner />;
  }

  const dashboardState = {
    clustersByStatus: {
      running: clusterData.clusters.filter(cluster => cluster.status === ClusterStates.Running).length,
      stopped: clusterData.clusters.filter(cluster => cluster.status === ClusterStates.Stopped).length,
      unknown: clusterData.clusters.filter(cluster => cluster.status === ClusterStates.Unknown).length,
      terminated: clusterData.clusters.filter(cluster => cluster.status === ClusterStates.Terminated).length,
    },
    clustersByProvider: clusterPerCP.accounts.reduce(
      (acc, account) => {
        const provider = account.provider as CloudProvider;
        acc[provider] = (acc[provider] || 0) + account.clusterCount;
        return acc;
      },
      {} as Record<CloudProvider, number>
    ),
    accountsByProvider: clusterPerCP.accounts.reduce(
      (acc, account) => {
        const provider = account.provider as CloudProvider;
        acc[provider] = (acc[provider] || 0) + 1;
        return acc;
      },
      {} as Record<CloudProvider, number>
    ),
    instances: instances.count,
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
          {Object.entries(cardData).map(([_group, cards], groupIndex) => (
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
