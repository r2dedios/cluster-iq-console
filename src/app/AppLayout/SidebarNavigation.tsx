import { Nav, NavExpandable, NavItem, NavList } from '@patternfly/react-core';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SidebarNavigation: React.FunctionComponent = () => {
  const location = useLocation();

  return (
    <Nav aria-label="Nav">
      <NavList>
        <NavItem itemId="overview">
          <NavLink to="/" end>
            Overview
          </NavLink>
        </NavItem>
        <NavItem itemId="accounts">
          <NavLink to="/accounts">Accounts</NavLink>
        </NavItem>

        <NavExpandable title="Clusters" groupId="clusters-group" isExpanded={location.pathname.startsWith('/clusters')}>
          <NavItem
            groupId="clusters-group"
            itemId="clusters-active"
            isActive={location.pathname === '/clusters' && !location.search}
          >
            <NavLink to="/clusters" end>
              Active
            </NavLink>
          </NavItem>
          <NavItem
            groupId="clusters-group"
            itemId="clusters-history"
            isActive={location.pathname === '/clusters' && location.search === '?archived=true'}
          >
            <NavLink to="/clusters?archived=true">History</NavLink>
          </NavItem>
        </NavExpandable>

        <NavExpandable title="Servers" groupId="servers-group" isExpanded={location.pathname.startsWith('/servers')}>
          <NavItem
            groupId="servers-group"
            itemId="servers-active"
            isActive={location.pathname === '/servers' && !location.search}
          >
            <NavLink to="/servers" end>
              Active
            </NavLink>
          </NavItem>
          <NavItem
            groupId="servers-group"
            itemId="servers-history"
            isActive={location.pathname === '/servers' && location.search === '?archived=true'}
          >
            <NavLink to="/servers?archived=true">History</NavLink>
          </NavItem>
        </NavExpandable>
        <NavExpandable title={'Observe'} groupId={'observe-group'} isExpanded={location.pathname.startsWith('/observe')}>
          <NavItem groupId={'observe-group'} itemId="audit-logs" isActive={location.pathname === '/observe' && !location.search}>
            <NavLink to="/observe/audit-logs" end> Audit logs</NavLink>
          </NavItem>
          <NavItem groupId={'observe-group'} itemId="scheduler" isActive={location.pathname === '/observe' && !location.search}>
            <NavLink to="/observe/scheduler" end> Scheduler </NavLink>
          </NavItem>
        </NavExpandable>
      </NavList>
    </Nav>
  );
};

export default SidebarNavigation;
