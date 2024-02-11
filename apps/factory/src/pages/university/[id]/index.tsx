import { Box, Container } from "@mui/material";
import React from "react";
import Header from "~/components/marketplace/header";
import VideoPlayer from "~/components/video_player";
import VideoDetails from "~/components/video_details";
import Footer from "~/components/footer";
import { useRouter } from "next/router";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { id } = router.query as { id: string };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "var(--sugarhub-main-color)",
          height: "100vh",
          width: "100vw",
          overflowY: "scroll",
        }}
      >
        <Header headerName={`Sugarcane AI`}></Header>
        <Container>
          <VideoPlayer videoId={id} />
          <VideoDetails />
        </Container>
        <Footer />
      </Box>
    </>
  );
};
export default index;
