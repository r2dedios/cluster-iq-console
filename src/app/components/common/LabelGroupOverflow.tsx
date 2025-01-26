import { Tag } from '@app/types/types';
import { LabelGroup, Label } from '@patternfly/react-core';
import React from 'react';

interface LabelGroupOverflowProps {
  labels: Array<Tag>;
}

export const LabelGroupOverflow: React.FunctionComponent<LabelGroupOverflowProps> = ({ labels }) => (
  <LabelGroup>
    {labels.map(label => (
      <Label key={label.key}>
        {label.key}: {label.value}
      </Label>
    ))}
  </LabelGroup>
);
