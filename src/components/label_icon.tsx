import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import * as Icons from '@mui/icons-material';

interface LabelStateIconsProps {
  logId: string;
  onLabelChange: (logId: string, labelState: string) => void;
  labelledState: string;
}

const labelStateIcons = {
  UNLABELLED: Icons.ThumbUp,
  SELECTED: Icons.CheckCircle,
  REJECTED: Icons.Cancel,
  NOTSURE: Icons.Help,
};

const LabelIcons: React.FC<LabelStateIconsProps> = ({ logId, onLabelChange, labelledState }) => {
  const labelStates = Object.keys(labelStateIcons);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(labelledState);

  const handleIconClick = (state: string) => {
    setSelectedLabel(state);
    onLabelChange(logId, state);
  };

  return (
    <div className="flex space-x-2">
      {labelStates.map((state) => {
        const IconComponent = labelStateIcons[state];
        const isSelected = selectedLabel === state;

        return (
          <Tooltip key={state} title={state} arrow>
            <span>
              <IconButton
                size="small"
                onClick={() => handleIconClick(state)}
                disabled={isSelected}
              >
                <IconComponent />
              </IconButton>
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default LabelIcons;