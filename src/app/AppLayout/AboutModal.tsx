import { AboutModal, TextContent, TextList, TextListItem } from '@patternfly/react-core';
import React from 'react';
import brandImg from '../../assets/favicon.png';
import modalBackground from '../../assets/modal_background.png';
import { APP_VERSION, PRODUCT_NAME, MAINTAINER_NAME, REPOSITORY_URL } from '@app/constants';

interface AboutModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModalComponent: React.FunctionComponent<AboutModalComponentProps> = ({ isOpen, onClose }) => {
  return (
    <AboutModal
      isOpen={isOpen}
      onClose={onClose}
      productName={PRODUCT_NAME}
      brandImageAlt="Red Hat logo"
      brandImageSrc={brandImg}
      backgroundImageSrc={modalBackground}
    >
      <TextContent>
        <TextList component="dl">
          <TextListItem component="dt">Version</TextListItem>
          <TextListItem component="dd">{APP_VERSION}</TextListItem>

          <TextListItem component="dt">Maintainer</TextListItem>
          <TextListItem component="dd">{MAINTAINER_NAME}</TextListItem>

          <TextListItem component="dt">Repository</TextListItem>
          <TextListItem component="dd">
            <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </TextListItem>
        </TextList>
      </TextContent>
    </AboutModal>
  );
};

export default AboutModalComponent;
