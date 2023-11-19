import { Tooltip } from "@mui/material";
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
    <div style={{ cursor: "pointer" }}>
      <Tooltip title="Download Image" sx={{ ml: 1 }}>
        <DownloadForOfflineIcon onClick={handleDownload} />
      </Tooltip>
    </div>
  );
};

export default DownloadButtonImg;
