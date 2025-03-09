import { FC } from "react";

interface SidebarControlsProps {
  isPlannedVisible: boolean;
  togglePlanned: () => void;
  areEntrancesVisible: boolean;
  toggleEntrances: () => void;
  isAccessibilityVisible: boolean;
  toggleAccessibility: () => void;
}

export const SidebarControls: FC<SidebarControlsProps> = ({
  isPlannedVisible,
  togglePlanned,
  areEntrancesVisible,
  toggleEntrances,
  isAccessibilityVisible,
  toggleAccessibility,
}) => (
  <div>
    <input
      type="checkbox"
      checked={isPlannedVisible}
      onChange={togglePlanned}
    />
    Planned
    <br />
    <input
      type="checkbox"
      checked={areEntrancesVisible}
      onChange={toggleEntrances}
    />
    Entrances
    <br />
    <input
      type="checkbox"
      checked={isAccessibilityVisible}
      onChange={toggleAccessibility}
    />
    Accessibility
  </div>
);
