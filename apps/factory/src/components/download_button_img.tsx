import { IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

type DownloadButtonImgProps = {
  output: string;
};

const DownloadButtonImg: React.FC<DownloadButtonImgProps> = ({ output }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = output;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <IconButton
      onClick={handleDownload}
      sx={{
        margin: 1,
        borderRadius: 2,
      }}
    >
      <Tooltip title="Download Image">
        <div style={{ display: "flex", flexDirection: "row", paddingLeft: 5 }}>
          <DownloadForOfflineIcon />
          <Typography style={{ paddingLeft: 8 }}>Download</Typography>
        </div>
      </Tooltip>
    </IconButton>
  );
};

export default DownloadButtonImg;
