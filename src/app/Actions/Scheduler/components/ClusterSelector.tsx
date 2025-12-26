import React from 'react';
import {
  FormGroup,
  Select,
  SelectOption,
  MenuToggle,
  TextInputGroup,
  TextInputGroupMain,
} from '@patternfly/react-core';
import { ClusterResponseApi } from '@api';

interface ClusterTypeaheadSelectProps {
  accountId: string | null;
  clusters: ClusterResponseApi[];
  selectedCluster: ClusterResponseApi | null;
  onSelectCluster: (cluster: ClusterResponseApi | null) => void;
  isDisabled: boolean;
}

export const ClusterTypeaheadSelect: React.FunctionComponent<ClusterTypeaheadSelectProps> = ({
  clusters,
  selectedCluster,
  onSelectCluster,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const safeClusters = React.useMemo(() => (Array.isArray(clusters) ? clusters : []), [clusters]);

  const filteredClusters = React.useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return safeClusters;

    return safeClusters.filter(a => {
      const haystack = `${a.clusterName ?? ''} ${a.clusterId ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [safeClusters, inputValue]);

  const onSelect = (_event?: React.MouseEvent<Element>, value?: string | number) => {
    const id = String(value ?? '');
    const acc = safeClusters.find(a => a.clusterId === id) ?? null;

    // Keep input in sync with selection for a predictable UX
    setInputValue(acc ? `${acc.clusterName} (${acc.clusterId})` : '');
    onSelectCluster(acc);
    setIsOpen(false);
  };

  return (
    <FormGroup label="Cluster" isRequired fieldId="cluster-typeahead">
      <Select
        id="cluster-typeahead"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSelect={onSelect}
        selected={selectedCluster?.clusterId ?? null}
        toggle={toggleRef => (
          <MenuToggle
            ref={toggleRef}
            isExpanded={isOpen}
            variant="typeahead"
            onClick={() => setIsOpen(v => !v)}
            isFullWidth
          >
            <TextInputGroup isPlain>
              <TextInputGroupMain
                value={inputValue}
                onClick={() => setIsOpen(true)}
                onChange={(_e, value) => {
                  // Open menu as user types and filter client-side
                  setInputValue(value);
                  setIsOpen(true);
                }}
                placeholder="Search by name or ID..."
                aria-label="Search clusters"
              />
            </TextInputGroup>
          </MenuToggle>
        )}
      >
        {filteredClusters.length === 0 ? (
          <SelectOption isDisabled value="empty">
            No results
          </SelectOption>
        ) : (
          filteredClusters.map(acc => (
            <SelectOption key={acc.clusterId} value={acc.clusterId}>
              <div>
                <div>{acc.clusterName}</div>
                <div style={{ fontSize: '0.85em', opacity: 0.8, fontFamily: 'monospace' }}>{acc.clusterId}</div>
              </div>
            </SelectOption>
          ))
        )}
      </Select>
    </FormGroup>
  );
};
