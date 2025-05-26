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
  Dropdown,
  DropdownItem,
  MenuToggle,
  ToolbarGroup,
  DropdownList,
} from '@patternfly/react-core';
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import { QuestionCircleIcon, RedhatIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import SidebarNavigation from './SidebarNavigation';
import { useUser } from '../Contexts/UserContext';
import { NavLink } from 'react-router-dom';
import AboutModalComponent from './AboutModal';
import { REPOSITORY_URL } from '@app/constants';
interface IAppLayout {
  children: React.ReactNode;
}

const PF_BREAKPOINT_XL = 1200;

const AppLayout: React.FunctionComponent<IAppLayout> = ({ children }) => {
  const { userEmail } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = React.useState(false);
  const isDesktop = () => window.innerWidth >= PF_BREAKPOINT_XL;
  const previousDesktopState = React.useRef(isDesktop());

  const defaultHelpLinks = [
    {
      label: 'Documentation',
      onClick: () => window.open(REPOSITORY_URL, '_blank'),
      isExternal: true,
    },
    {
      label: 'About',
      onClick: () => setIsAboutModalOpen(true),
    },
  ];

  const helpDropdownItems = defaultHelpLinks.map(link => {
    const content = (
      <>
        {link.label}
        {link.isExternal && (
          <span style={{ marginLeft: 'var(--pf-v5-global--spacer--sm)', verticalAlign: 'middle' }}>
            {' '}
            <ExternalLinkAltIcon />
          </span>
        )}
      </>
    );
    return (
      <DropdownItem key={link.label} onClick={link.onClick} component="button">
        {content}
      </DropdownItem>
    );
  });

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
        <ToolbarGroup align={{ default: 'alignRight' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <ToolbarItem>
            <Dropdown
              isOpen={isHelpMenuOpen}
              onOpenChange={setIsHelpMenuOpen}
              onSelect={() => setIsHelpMenuOpen(false)}
              popperProps={{
                position: 'right',
              }}
              toggle={toggleRef => (
                <MenuToggle
                  ref={toggleRef}
                  aria-label="Help dropdown"
                  variant="plain"
                  onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                  isExpanded={isHelpMenuOpen}
                >
                  <QuestionCircleIcon />
                </MenuToggle>
              )}
            >
              <DropdownList>{helpDropdownItems}</DropdownList>
            </Dropdown>
          </ToolbarItem>
          <ToolbarItem>
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
        </ToolbarGroup>
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
    <>
      <Page header={header} sidebar={sidebar} mainContainerId={pageId}>
        {children}
      </Page>
      <AboutModalComponent isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)}></AboutModalComponent>
    </>
  );
};

export { AppLayout };
