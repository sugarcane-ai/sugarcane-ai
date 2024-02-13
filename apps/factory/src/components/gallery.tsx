import { Box } from "@mui/material";
import React from "react";
import DownloadButtonBase64 from "./download_button_base64";
import { LogListOutput } from "~/validators/prompt_log";

const Gallery = ({ imagesData }: { imagesData: LogListOutput | undefined }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {imagesData?.data?.map((imageData: any) => {
          return (
            <Box
              key={imageData.id}
              sx={{
                position: "relative",
                width: "200px",
                height: "200px",
                margin: "1rem",
                borderRadius: "10px",
                overflow: "hidden",
                "&:hover": {
                  "&:before": {
                    content: "''",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 1,
                  },
                  "& > div": {
                    opacity: 1,
                  },
                },
              }}
            >
              <img
                src={`${
                  process.env.NEXT_PUBLIC_APP_URL
                }/generated/assets/logs/${imageData.id}?w=${200}&h=${200}`}
                alt=""
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                  transition: "opacity 0.3s ease",
                  zIndex: 2,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 3,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <DownloadButtonBase64 logId={imageData.id} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default Gallery;
