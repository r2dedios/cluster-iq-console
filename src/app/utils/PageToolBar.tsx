import {
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  MenuToggle,
  SearchInput,
  Popper,
  ToolbarFilter,
  ToolbarGroup,
  Badge,
  ToolbarToggleGroup,
} from "@patternfly/react-core";
import React from "react";
import { FilterIcon } from "@patternfly/react-icons";

interface TableToolbarProps {
  setSearchValue: (value: string) => void;
  searchValue: string;
  setStatusSelection: (value: string) => void;
  statusSelection: string;
  enableStatusSelection: boolean;
  setProviderSelections: (value: string[]) => void;
  providerSelections: string[];
}


export const TableToolbar: React.FunctionComponent<TableToolbarProps> = ({
  searchValue,
  setSearchValue,
  setStatusSelection,
  statusSelection,
  enableStatusSelection,
  setProviderSelections,
  providerSelections,
}) => {
  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // Set up name search input
  const searchInput = (
    <SearchInput
      placeholder="Filter by name"
      value={searchValue}
      onChange={(_event, value) => onSearchChange(value)}
      onClear={() => onSearchChange("")}
    />
  );

  // Set up name input
  const [isStatusMenuOpen, setIsStatusMenuOpen] =
    React.useState<boolean>(false);
  const statusToggleRef = React.useRef<HTMLButtonElement>(null);
  const statusMenuRef = React.useRef<HTMLDivElement>(null);
  const statusContainerRef = React.useRef<HTMLDivElement>(null);
  const handleStatusMenuKeys = (event: KeyboardEvent) => {
    if (
      isStatusMenuOpen &&
      statusMenuRef.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsStatusMenuOpen(!isStatusMenuOpen);
        statusToggleRef.current?.focus();
      }
    }
  };

  const handleStatusClickOutside = (event: MouseEvent) => {
    if (
      isStatusMenuOpen &&
      !statusMenuRef.current?.contains(event.target as Node)
    ) {
      setIsStatusMenuOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleStatusMenuKeys);
    window.addEventListener("click", handleStatusClickOutside);
    return () => {
      window.removeEventListener("keydown", handleStatusMenuKeys);
      window.removeEventListener("click", handleStatusClickOutside);
    };
  }, [isStatusMenuOpen, statusMenuRef]);

  const onStatusToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setTimeout(() => {
      if (statusMenuRef.current) {
        const firstElement = statusMenuRef.current.querySelector(
          "li > button:not(:disabled)"
        );
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsStatusMenuOpen(!isStatusMenuOpen);
  };

  function onStatusSelect(
    event: React.MouseEvent | undefined,
    itemId: string | number | undefined
  ) {
    if (typeof itemId === "undefined") {
      return;
    }

    setStatusSelection(itemId.toString());
    setIsStatusMenuOpen(!isStatusMenuOpen);
  }

  const statusToggle = (
    <MenuToggle
      ref={statusToggleRef}
      onClick={onStatusToggleClick}
      isExpanded={isStatusMenuOpen}
      style={
        {
          width: "200px",
        } as React.CSSProperties
      }
    >
      Filter by Status
    </MenuToggle>
  );

  const statusMenu = (
    <Menu
      ref={statusMenuRef}
      id="attribute-search-status-menu"
      onSelect={onStatusSelect}
      selected={statusSelection}
    >
      <MenuContent>
        <MenuList>
          <MenuItem itemId="Unknown">Unknown</MenuItem>
          <MenuItem itemId="Running">Running</MenuItem>
          <MenuItem itemId="Stopped">Stopped</MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const statusSelect = (
    <div ref={statusContainerRef}>
      <Popper
        trigger={statusToggle}
        triggerRef={statusToggleRef}
        popper={statusMenu}
        popperRef={statusMenuRef}
        appendTo={statusContainerRef.current || undefined}
        isVisible={isStatusMenuOpen}
      />
    </div>
  );

  // Set up provider input
  const [isProviderMenuOpen, setIsProviderMenuOpen] =
    React.useState<boolean>(false);
  const providerToggleRef = React.useRef<HTMLButtonElement>(null);
  const providerMenuRef = React.useRef<HTMLDivElement>(null);
  const providerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleProviderMenuKeys = (event: KeyboardEvent) => {
    if (
      isProviderMenuOpen &&
      providerMenuRef.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsProviderMenuOpen(!isProviderMenuOpen);
        providerToggleRef.current?.focus();
      }
    }
  };

  const handleProviderClickOutside = (event: MouseEvent) => {
    if (
      isProviderMenuOpen &&
      !providerMenuRef.current?.contains(event.target as Node)
    ) {
      setIsProviderMenuOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleProviderMenuKeys);
    window.addEventListener("click", handleProviderClickOutside);
    return () => {
      window.removeEventListener("keydown", handleProviderMenuKeys);
      window.removeEventListener("click", handleProviderClickOutside);
    };
  }, [isProviderMenuOpen, providerMenuRef]);

  const onProviderMenuToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setTimeout(() => {
      if (providerMenuRef.current) {
        const firstElement = providerMenuRef.current.querySelector(
          "li > button:not(:disabled)"
        );
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsProviderMenuOpen(!isProviderMenuOpen);
  };

  function onProviderMenuSelect(
    event: React.MouseEvent | undefined,
    itemId: string | number | undefined
  ) {
    if (typeof itemId === "undefined") {
      return;
    }

    const itemStr = itemId.toString();

    setProviderSelections(
      providerSelections.includes(itemStr)
        ? providerSelections.filter((selection) => selection !== itemStr)
        : [itemStr, ...providerSelections]
    );
  }

  const providerToggle = (
    <MenuToggle
      ref={providerToggleRef}
      onClick={onProviderMenuToggleClick}
      isExpanded={isProviderMenuOpen}
      {...(providerSelections.length > 0 && {
        badge: <Badge isRead>{providerSelections.length}</Badge>,
      })}
      style={
        {
          width: "200px",
        } as React.CSSProperties
      }
    >
      Filter by Provider
    </MenuToggle>
  );

  const providerMenu = (
    <Menu
      ref={providerMenuRef}
      id="attribute-search-provider-menu"
      onSelect={onProviderMenuSelect}
      selected={providerSelections}
    >
      <MenuContent>
        <MenuList>
          <MenuItem
            hasCheckbox
            isSelected={providerSelections.includes("AWS")}
            itemId="AWS"
          >
            AWS
          </MenuItem>
          <MenuItem
            hasCheckbox
            isSelected={providerSelections.includes("GCP")}
            itemId="GCP"
          >
            Google Cloud
          </MenuItem>
          <MenuItem
            hasCheckbox
            isSelected={providerSelections.includes("Azure")}
            itemId="Azure"
          >
            Azure
          </MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const providerSelect = (
    <div ref={providerContainerRef}>
      <Popper
        trigger={providerToggle}
        triggerRef={providerToggleRef}
        popper={providerMenu}
        popperRef={providerMenuRef}
        appendTo={providerContainerRef.current || undefined}
        isVisible={isProviderMenuOpen}
      />
    </div>
  );

  // Set up attribute selector
  const [activeAttributeMenu, setActiveAttributeMenu] = React.useState<
    "Name" | "Status" | "Provider"
  >("Name");
  const [isAttributeMenuOpen, setIsAttributeMenuOpen] = React.useState(false);
  const attributeToggleRef = React.useRef<HTMLButtonElement>(null);
  const attributeMenuRef = React.useRef<HTMLDivElement>(null);
  const attributeContainerRef = React.useRef<HTMLDivElement>(null);

  const handleAttribueMenuKeys = (event: KeyboardEvent) => {
    if (!isAttributeMenuOpen) {
      return;
    }
    if (
      attributeMenuRef.current?.contains(event.target as Node) ||
      attributeToggleRef.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsAttributeMenuOpen(!isAttributeMenuOpen);
        attributeToggleRef.current?.focus();
      }
    }
  };

  const handleAttributeClickOutside = (event: MouseEvent) => {
    if (
      isAttributeMenuOpen &&
      !attributeMenuRef.current?.contains(event.target as Node)
    ) {
      setIsAttributeMenuOpen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleAttribueMenuKeys);
    window.addEventListener("click", handleAttributeClickOutside);
    return () => {
      window.removeEventListener("keydown", handleAttribueMenuKeys);
      window.removeEventListener("click", handleAttributeClickOutside);
    };
  }, [isAttributeMenuOpen, attributeMenuRef]);

  const onAttributeToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    setTimeout(() => {
      if (attributeMenuRef.current) {
        const firstElement = attributeMenuRef.current.querySelector(
          "li > button:not(:disabled)"
        );
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsAttributeMenuOpen(!isAttributeMenuOpen);
  };

  const attributeToggle = (
    <MenuToggle
      ref={attributeToggleRef}
      onClick={onAttributeToggleClick}
      isExpanded={isAttributeMenuOpen}
      icon={<FilterIcon />}
    >
      {activeAttributeMenu}
    </MenuToggle>
  );

  function RenderStatusSelectorMenu() {
    if (enableStatusSelection == true) {
      return <MenuItem itemId="Status">Status</MenuItem>
    } else {
      return null
    }
  }

  const attributeMenu = (
    // eslint-disable-next-line no-console
    <Menu
      ref={attributeMenuRef}
      onSelect={(_ev, itemId) => {
        setActiveAttributeMenu(
          itemId?.toString() as "Name" | "Status" | "Provider"
        );
        setIsAttributeMenuOpen(!isAttributeMenuOpen);
      }}
    >
      <MenuContent>
        <MenuList>
          <MenuItem itemId="Name">Name</MenuItem>
          <RenderStatusSelectorMenu/>
          <MenuItem itemId="Provider">Provider</MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const attributeDropdown = (
    <div ref={attributeContainerRef}>
      <Popper
        trigger={attributeToggle}
        triggerRef={attributeToggleRef}
        popper={attributeMenu}
        popperRef={attributeMenuRef}
        appendTo={attributeContainerRef.current || undefined}
        isVisible={isAttributeMenuOpen}
      />
    </div>
  );


  return (
    <Toolbar
      id="attribute-search-filter-toolbar"
      clearAllFilters={() => {
        setSearchValue("");
        setStatusSelection("");
        setProviderSelections([]);
      }}
    >
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>{attributeDropdown}</ToolbarItem>
            <ToolbarFilter
              chips={searchValue !== "" ? [searchValue] : ([] as string[])}
              deleteChip={() => setSearchValue("")}
              deleteChipGroup={() => setSearchValue("")}
              categoryName="Name"
              showToolbarItem={activeAttributeMenu === "Name"}
            >
              {searchInput}
            </ToolbarFilter>
            <ToolbarFilter
              chips={
                statusSelection !== "" ? [statusSelection] : ([] as string[])
              }
              deleteChip={() => setStatusSelection("")}
              deleteChipGroup={() => setStatusSelection("")}
              categoryName="Status"
              showToolbarItem={activeAttributeMenu === "Status"}
            >
              {statusSelect}
            </ToolbarFilter>
            <ToolbarFilter
              chips={providerSelections}
              deleteChip={(category, chip) =>
                onProviderMenuSelect(undefined, chip as string)
              }
              deleteChipGroup={() => setProviderSelections([])}
              categoryName="Provider"
              showToolbarItem={activeAttributeMenu === "Provider"}
            >
              {providerSelect}
            </ToolbarFilter>
          </ToolbarGroup>
        </ToolbarToggleGroup>
      </ToolbarContent>
    </Toolbar>
  );
};
