import React from "react";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import toast from "react-hot-toast";

interface CopyToClipboardButtonProps {
  textToCopy: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  textToCopy,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied");
  };

  return (
    <>
      <IconButton
        onClick={handleCopy}
        sx={{
          margin: 1,
        }}
      >
        <FileCopyIcon />
      </IconButton>
    </>
  );
};

export default CopyToClipboardButton;
