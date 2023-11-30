import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Divider,
  Flex,
  FlexItem,
  Gallery,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Stack,
  Spinner,
  TextContent,
  Text,
} from "@patternfly/react-core";
import CheckCircleIcon from "@patternfly/react-icons/dist/js/icons/check-circle-icon";
import { OpenshiftIcon, AwsIcon, GoogleIcon, AzureIcon, ErrorCircleOIcon, WarningTriangleIcon } from "@patternfly/react-icons";
import { getClusters, getAccounts, getInstances } from "../services/api";
import { AccountList, ClusterList, InstanceList } from '../types/types';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AggregateStatusCards: React.FunctionComponent = () => {
  const [accountList, setAccountList] = useState<AccountList | null>(null);
  const [clusterList, setClusterList] = useState<ClusterList | null>(null);
  const [instanceList, setInstanceList] = useState<InstanceList | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedAccounts = await getAccounts();
        setAccountList(fetchedAccounts);

        const fetchedClusters = await getClusters();
        setClusterList(fetchedClusters);

        const fetchedInstances = await getInstances();
        setInstanceList(fetchedInstances)
      } catch (error) {
        console.error("Error fetching Overview data:", error);
      }
    };

    fetchData();
  }, []);

  if (!accountList || !clusterList || !instanceList) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spinner aria-label="Loading data" />
        </div>
      );
  }

  const activeClusters = clusterList.clusters.filter(cluster => cluster.status === "Running").length;
  const inactiveClusters = clusterList.clusters.filter(cluster => cluster.status === "Stopped").length;
  const unknownStatusClusters = clusterList.clusters.filter(cluster => cluster.status === "Unknown").length;

  const clusterCounts = {};
  accountList.accounts.forEach(account => {
    const provider = account.provider;
    //const clusterCount = Object.keys(account.clusters).length;
    const clusterCount = account.clusterCount
    clusterCounts[provider] = (clusterCounts[provider] || 0) + clusterCount;
  });

  const accountCounts = {};
  accountList.accounts.forEach(account => {
    const provider = account.provider;
    //const clusterCount = Object.keys(account.clusters).length;
    accountCounts[provider] = (accountCounts[provider] || 0) + 1;
  });

  // to-do instead of static structure of page content make it dynamic (lets saywe add tomorrow IBM cloud, we dont need to change the FE)
    const cardData = {
      clusters: [
        {
          title: "Clusters",
          content: [
            {
              icon: (
                <CheckCircleIcon color="var(--pf-v5-global--success-color--100)" />
              ),
              count: activeClusters,
              ref: "/clusters?status=Running",
            },
            {
              icon: (
                <ErrorCircleOIcon color="var(--pf-v5-global--danger-color--100)" />
              ),
              count: inactiveClusters,
              ref: "/clusters?status=Stopped",
            },
            {
              icon: (
                <WarningTriangleIcon color="var(--pf-v5-global--warning-color--100)" />
              ),
              count: unknownStatusClusters,
              ref: "/clusters?status=Unknown",
            },
          ],
          layout: "multiIcon",
        },
            {
          title: "Servers",
          content: [
            {
              count: instanceList.count,
              ref: "/servers"
            },
          ],
          layout: "multiIcon",
        },
        {
          title: "Scanners",
          content: [
            {
              count: 1
            },
          ],
          layout: "multiIcon",
        },

      ],
      clustersPerProvider: [
        {
          title: "AWS",
          content: [
            {
              count: (clusterCounts["AWS"] || 0) + " Cluster(s)",
              icon: (
                <OpenshiftIcon color="var(--pf-v5-global--danger-color--100)" />
              ),
              ref: "/clusters?provider=AWS",
            },
            {
              count: (accountCounts["AWS"] || 0) + " Account(s)",
              icon: (
                <AwsIcon color="var(--pf-v5-global--danger-color--100)" />
              ),
              ref: "/accounts?provider=AWS",
            },
          ],
          layout: "multiIcon",
        },
        {
          title: "GCP Clusters",
          content: [
            {
              count: (clusterCounts["GCP"] || 0) + " Cluster(s)",
              icon: (
                <OpenshiftIcon color="var(--pf-v5-global--danger-color--100)" />
              ),
              ref: "/clusters?provider=GCP",
            },
            {
              count: (accountCounts["GCP"] || 0) + " Account(s)",
              icon: (
                <GoogleIcon color="var(--pf-v5-global--danger-color--100)" />
              ),
              ref: "/accounts?provider=GCP",
            },
          ],
          layout: "multiIcon",
        },
        {
          title: "Azure Clusters",
          content: [
            {
              count: (clusterCounts["Azure"] || 0) + " Cluster(s)",
              icon: (
                <OpenshiftIcon color="var(--pf-v5-global--danger-color--100)" />
              ),
              ref: "/clusters?provider=Azure",
            },
            {
              count: (accountCounts["Azure"] || 0) + " Account(s)",
              icon: (
                <AzureIcon color="var(--pf-v5-global--danger-color--100)" />
              ),
              ref: "/accounts?provider=Azure",
            },
          ],
          layout: "multiIcon",
        }
      ],


    };


    const renderContent = (title: string, content: any[], layout: string) => {
    if (layout === "icon") {
      return content[0].icon;
    }
    if (layout === "multiIcon") {
      return (
        <Flex display={{ default: "inlineFlex" }}>
          {content.map(({ icon, count, ref }, index: number) => (
            <React.Fragment key={index}>
              <Flex spaceItems={{ default: "spaceItemsSm" }}>
                <FlexItem>{icon}</FlexItem>
                <FlexItem>
                  <a href={ref}>{count}</a>
                </FlexItem>
              </Flex>
              {content.length > 1 && index < content.length -1 && (
                <Divider
                  key={`${index}_d`}
                  orientation={{
                    default: "vertical",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Flex>
      );
    }
    if (layout === "withSubtitle") {
      return (
        <Flex justifyContent={{ default: "justifyContentSpaceAround" }}>
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
    }
  };
  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Overview</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          {Object.keys(cardData).map((cardGroup, groupIndex) => {
            let galleryWidth;
            let cardAlign;
            let titleAlign;
            if (cardGroup === "withSubtitle") {
              galleryWidth = "25%";
              cardAlign = "";
              titleAlign = "center";
            } else {
              galleryWidth = "30%";
              cardAlign = "center";
            }
            return (
              <GridItem key={groupIndex}>
                <Gallery
                  hasGutter
                  style={
                    {
                      "--pf-v5-l-gallery--GridTemplateColumns--min":
                        galleryWidth,
                    } as any
                  }
                >
                  {cardData[cardGroup].map(
                    ({ title, content, layout }, cardIndex) => (
                      <Card
                        style={{ textAlign: cardAlign }}
                        key={`${groupIndex}${cardIndex}`}
                        component="div"
                      >
                        <CardTitle style={{ textAlign: titleAlign }}>
                          {title}
                        </CardTitle>
                        <CardBody>{renderContent(title, content, layout)}</CardBody>
                      </Card>
                    )
                  )}
                </Gallery>
              </GridItem>
            );
          })}
        </Grid>
      </PageSection>
    </React.Fragment>
  );
};

export default AggregateStatusCards;
