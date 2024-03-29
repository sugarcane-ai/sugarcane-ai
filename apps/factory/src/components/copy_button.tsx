import React from "react";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import toast from "react-hot-toast";
import { Tooltip } from "@mui/material";

interface CopyToClipboardButtonProps {
  textToCopy: string;
  textToDisplay: string;
  cube?: boolean;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  textToCopy,
  textToDisplay,
  cube,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied");
  };

  return (
    <Tooltip title={textToDisplay} placement="top">
      <IconButton
        onClick={handleCopy}
        sx={{
          margin: 1,
        }}
      >
        <FileCopyIcon
          sx={{
            color: "var(--sugarhub-text-color)",
            fontSize: cube ? "1rem" : "1.4rem",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
