import * as React from 'react';
import {
  Page,
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import { RedhatIcon } from '@patternfly/react-icons';
import SidebarNavigation from './SidebarNavigation';
import { useUser } from '../Contexts/UserContext';
import { NavLink } from 'react-router-dom';

interface IAppLayout {
  children: React.ReactNode;
}

const PF_BREAKPOINT_XL = 1200;

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const { userEmail } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isDesktop = () => window.innerWidth >= PF_BREAKPOINT_XL;
  const previousDesktopState = React.useRef(isDesktop());

  const onResize = React.useCallback(() => {
    const desktop = isDesktop();
    if (desktop !== previousDesktopState.current) {
      setIsSidebarOpen(false);
    } else if (desktop) {
      setIsSidebarOpen(true);
    }
    previousDesktopState.current = desktop;
  }, []);

  const onSidebarToggle = () => {
    setIsSidebarOpen(prev => !prev);
  };

  React.useEffect(() => {
    window.addEventListener('resize', onResize);
    if (isDesktop()) {
      setIsSidebarOpen(true);
    }
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const headerToolbar = (
    <Toolbar id="toolbar" isFullHeight isStatic style={{ width: '100%' }}>
      <ToolbarContent style={{ width: '100%' }}>
        <ToolbarItem style={{ marginLeft: 'auto' }}>
          <span
            style={{
              color: 'white',
              padding: '0 24px',
              fontWeight: 'normal',
            }}
          >
            {userEmail || 'User'}
          </span>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

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
        <MastheadBrand style={{ marginLeft: '10px', color: 'white', fontSize: '2em' }}>
          <NavLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
            ClusterIQ
          </NavLink>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent style={{ width: '100%' }}>{headerToolbar}</MastheadContent>
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
