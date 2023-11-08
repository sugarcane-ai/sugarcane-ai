import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {
  Link as MUILink,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";

import { api } from "~/utils/api";
import { packageVisibility } from "~/validators/base";
import LikeButton from "./like_button";
import TimeAgo from "react-timeago";
import PromptTags from "./prompt_tags";
import LaunchIcon from "@mui/icons-material/Launch";

function PublicPackages() {
  const { data: packages, refetch: refectchPackages } =
    api.marketplace.getPackages.useQuery({
      visibility: packageVisibility.Enum.PUBLIC,
    });
  return (
    <Grid container spacing={1}>
      {packages && packages.length > 0 ? (
        packages.map((pkg, index) => (
          <Grid item key={index} xs={12} sm={6} md={12} lg={12}>
            <Card sx={{ backgroundColor: "#1e1e1e", color: "#FFFFFF" }}>
              <CardHeader
                title={`${pkg?.User.username} / ${pkg?.name}`}
                avatar={
                  <Avatar
                    src={pkg?.User?.image || "/default-avatar.png"}
                    alt=""
                    sx={{ width: 42, height: 42, borderRadius: "50%" }}
                  />
                }
                action={
                  <span>
                    <IconButton
                      href={`/marketplace/packages/${pkg?.id}`}
                      sx={{ color: "#FFFFFF" }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  </span>
                }
                subheader={
                  <TimeAgo
                    title="Updated at"
                    date={pkg?.updatedAt}
                    style={{ color: "#FFFFFF" }}
                  />
                }
              />
              <CardContent>
                <Typography>{pkg?.description}</Typography>
              </CardContent>
              <CardActions>
                {/* <PromptTags></PromptTags> */}
                <Grid
                  direction="row"
                  container
                  alignItems="left"
                  spacing={2}
                ></Grid>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            padding: "0",
            margin: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "#FFFFFF", fontSize: "1.4rem" }}>
            No cards created
          </Typography>
        </Box>
      )}
    </Grid>
  );
}

export default PublicPackages;
