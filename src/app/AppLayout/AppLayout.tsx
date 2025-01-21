import * as React from 'react';
import {
  Page,
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
} from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import { RedhatIcon } from '@patternfly/react-icons';
import SidebarNavigation from './SidebarNavigation';

interface IAppLayout {
  children: React.ReactNode;
}

const PF_BREAKPOINT_XL = 1200; // Desktop breakpoint

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isDesktop = () => window.innerWidth >= PF_BREAKPOINT_XL;
  const previousDesktopState = React.useRef(isDesktop());

  const onResize = React.useCallback(() => {
    const desktop = isDesktop();
    if (desktop !== previousDesktopState.current) {
      // Only close sidebar on viewport change
      setIsSidebarOpen(false);
    } else if (desktop) {
      // In desktop mode, open sidebar by default
      setIsSidebarOpen(true);
    }
    previousDesktopState.current = desktop;
  }, []);

  const onSidebarToggle = () => {
    setIsSidebarOpen(prev => !prev);
  };

  React.useEffect(() => {
    window.addEventListener('resize', onResize);

    // Initial setup for desktop
    if (isDesktop()) {
      setIsSidebarOpen(true);
    }

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const header = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton
          variant="plain"
          aria-label="Global navigation"
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={onSidebarToggle}
          id="vertical-nav-toggle"
        >
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <RedhatIcon style={{ color: 'red', fontSize: '2.8em' }} />
        <MastheadBrand
          style={{ marginLeft: '10px', color: 'white', fontSize: '2em' }}
          href="https://github.com/RHEcosystemAppEng/cluster-iq"
          target="_blank"
        >
          ClusterIQ
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen} id="vertical-sidebar">
      <PageSidebarBody>
        <SidebarNavigation />
      </PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  return (
    <Page header={header} sidebar={sidebar} mainContainerId={pageId}>
      {children}
    </Page>
  );
};

export { AppLayout };
