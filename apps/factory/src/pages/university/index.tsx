import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { FaFolder } from "react-icons/fa";
import Markdown from "react-markdown";
import Footer from "~/components/footer";
import Header from "~/components/marketplace/header";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    router.push({
      query: { ...router.query, page },
    });
  };

  const dummyList = [
    {
      title: "Topics, Topics, Topics",
      date: "11th Feb 2023",
    },
    {
      title: "Another Topic",
      date: "12th Feb 2023",
    },
    {
      title: "Another Topic",
      date: "12th Feb 2023",
    },
    {
      title: "Another Topic",
      date: "12th Feb 2023",
    },
    {
      title: "Another Topic",
      date: "12th Feb 2023",
    },
    {
      title: "Another Topic",
      date: "12th Feb 2023",
    },
  ];
  const markdown =
    "*helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo* *helllo*";

  const videoId = "n9tYg541kWE";
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  const handleClick = () => {
    router.push(`university/${videoId}`);
  };

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
        <Header headerName={`SugarHub`}></Header>
        <Container>
          <Box>
            <Box
              sx={{
                backgroundColor: "var(--sugarhub-tab-color)",
                paddingLeft: 15,
                paddingRight: 15,
                fontSize: 34,
                textAlign: "center",
                fontWeight: "bold",
                height: "35vh",
                borderRadius: 5,
                color: "var(--sugarhub-text-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Sugarcane AI - Open Source Prompt Engineering Framework using AI
              Playground
            </Box>
          </Box>
          <Grid container sx={{ paddingLeft: "15px" }}>
            {dummyList.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "var(--sugarhub-main-color)",
                    width: "350px",
                    height: "480px",
                    border: 0,
                    margin: 1,
                  }}
                  onClick={handleClick}
                >
                  <Box sx={{ cursor: "pointer", borderRadius: 5 }}>
                    <CardMedia
                      sx={{ objectFit: "cover" }}
                      component="img"
                      height="100"
                      image={thumbnailUrl}
                      alt={`Thumbnail for video ${videoId}`}
                    />
                  </Box>
                  <Box
                    sx={{
                      paddingLeft: 2,
                      paddingRight: 2,
                      backgroundColor: "inherit",
                      color: "var(--sugarhub-text-color)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: "bold",
                        paddingTop: 1,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                    >
                      Have a good coding Have a good codingHave a good
                      codingHave a good codingHave a good codingHave a good
                      coding s
                    </Typography>

                    <Grid
                      container
                      sx={{
                        color: "GrayText",
                        paddingTop: 1,
                      }}
                    >
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FaFolder />
                        <Typography
                          sx={{
                            paddingLeft: 1,
                            fontSize: 12,
                            flexDirection: "row",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            display: "-webkit-box",
                            overflow: "hidden",
                          }}
                        >
                          Topics, Topics, Topics, Topics, Topics,{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        paddingTop: 2,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Markdown skipHtml={false}>{markdown}</Markdown>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      paddingTop: 2,
                      display: "grid",
                      gridTemplateRows: "auto 1fr auto",
                    }}
                  >
                    <Button variant="text" sx={{ height: 40 }}>
                      More Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
            <Grid
              item
              sx={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pagination
                onChange={handlePageChange}
                count={2}
                variant="outlined"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "white",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "Highlight",
                    color: "white",
                  },
                  padding: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </Box>
    </>
  );
};
export default index;
