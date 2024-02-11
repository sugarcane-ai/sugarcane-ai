import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ReactPlayer from "react-player";

type VideoPlayerProps = {
  videoId: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Grid xs={12} sm={6} md={12} lg={12}>
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
                  url={`https://www.youtube.com/watch?v=${videoId}`}
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
      </Grid>
    </>
  );
};
export default VideoPlayer;
