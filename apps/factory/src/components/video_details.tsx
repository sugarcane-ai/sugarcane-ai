import { Box, Card, Grid, Typography } from "@mui/material";
import React from "react";
import { FaFolder } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import Markdown from "react-markdown";

type VideoDetailsProps = {};

const VideoDetails: React.FC<VideoDetailsProps> = () => {
  const markdown =
    "*helllo* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae possimus vero enim natus tenetur quasi aliquid, dolor obcaecati maxime ad dicta odit odio ratione ab numquam, minus similique optio rerum. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae possimus vero enim natus tenetur quasi aliquid, dolor obcaecati maxime ad dicta odit odio ratione ab numquam, minus similique optio rerum. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae possimus vero enim natus tenetur quasi aliquid, dolor obcaecati maxime ad dicta odit odio ratione ab numquam, minus similique optio rerum. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae possimus vero enim natus tenetur quasi aliquid, dolor obcaecati maxime ad dicta odit odio ratione ab numquam, minus similique optio rerum. ";

  return (
    <>
      <Box
        sx={{
          paddingLeft: 2,
          paddingRight: 2,
          backgroundColor: "inherit",
          color: "var(--sugarhub-text-color)",
        }}
      >
        <Typography sx={{ fontSize: 28, fontWeight: "bold", paddingTop: 3 }}>
          Have a good coding Have a good codingHave a good codingHave a good
          codingHave a good codingHave a good coding s
        </Typography>
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "row",
            color: "GrayText",
            paddingTop: 2,
          }}
        >
          <Grid
            item
            sm={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 4,
            }}
          >
            <FaFolder />
            <Typography sx={{ paddingLeft: 2, paddingRight: 2 }}>
              Topics, Topics, Topics,Topics, Topics, Topics, Topics, Topics,
              Topics,{" "}
            </Typography>
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <FaRegClock />
            <Typography sx={{ paddingLeft: 2, paddingRight: 2 }}>
              11th Feb 2023{" "}
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Markdown skipHtml={false}>{markdown}</Markdown>
        </Box>
      </Box>
    </>
  );
};
export default VideoDetails;
