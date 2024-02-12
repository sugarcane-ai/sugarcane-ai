import { Box, CircularProgress, Container } from "@mui/material";
import React from "react";
import Header from "~/components/marketplace/header";
import VideoPlayer from "~/components/video_player";
import VideoDetails from "~/components/video_details";
import Footer from "~/components/footer";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const { slug } = router.query as { slug: string };

  const { data: blogData, isLoading } = api.blog.getBlog.useQuery({
    slug: slug,
  });

  return (
    <>
      {blogData === undefined || isLoading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            backgroundColor: "var(--sugarhub-main-color)",
            height: "100vh",
            width: "100vw",
            overflowY: "scroll",
          }}
        >
          <Header headerName={`Sugar University`}></Header>
          <Container>
            <VideoPlayer videoLink={blogData!.mediaUrl} />
            <VideoDetails blogData={blogData} />
          </Container>
          <Footer />
        </Box>
      )}
    </>
  );
};
export default index;
