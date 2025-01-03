import { ClusterStates } from '@app/types/types';
import { Label } from '@patternfly/react-core';

export function renderStatusLabel(labelText: string | null | undefined) {
  switch (labelText) {
    case ClusterStates.Running:
      return <Label color="green">{labelText}</Label>;
    case ClusterStates.Stopped:
      return <Label color="red">{labelText}</Label>;
    case ClusterStates.Terminated:
      return <Label color="purple">{labelText}</Label>;
    case ClusterStates.Unknown:
      return <Label color="gold">{labelText}</Label>;
    default:
      return <Label color="grey">{labelText}</Label>;
  }
}
