import { useEffect, useState } from "react";
import { Box, Card, CircularProgress, Grid } from "@mui/material";
import ReactPlayer from "react-player";

type VideoPlayerProps = {
  videoLink: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoLink }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Card
        sx={{
          backgroundColor: "var(--sugarhub-card-color)",
          color: "var(--sugarhub-text-color)",
        }}
      >
        <Box>
          {isClient ? (
            <Box flex={1}>
              <ReactPlayer
                url={videoLink}
                className="react-player"
                controls
                width={"100%"}
                height={"60vh"}
              />
            </Box>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Card>
    </>
  );
};
export default VideoPlayer;
