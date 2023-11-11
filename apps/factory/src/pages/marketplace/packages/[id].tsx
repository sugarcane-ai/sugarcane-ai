import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Paper,
  CardContent,
  Collapse,
  CardActions,
  IconButton,
  Card,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Header from "~/components/marketplace/header";
import { NextPage } from "next";
import { api } from "~/utils/api";
import { packageVisibility } from "~/validators/base";
import React from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { PackagePublicOutput as ppt } from "~/validators/marketplace";
import { TemplateOutput as ptt } from "~/validators/prompt_template";
// import { CreateVersionInput, VersionOutput as pv } from "~/validators/prompt_version";
import { getRandomValue } from "~/utils/math";
import { PromptIntegration } from "~/components/integration/prompt_integration";
import PromptHeader from "~/components/marketplace/prompt_header";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PublicUrl from "~/components/integration/public_url";

const MarketplacePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: pp, refetch: rpp } = api.marketplace.getPackage.useQuery({
    id: id,
    visibility: packageVisibility.Enum.PUBLIC,
  });

  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const subheader = () => {
    return `Public • Published 1 days ago • ${pp?.User?.username}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: "#1c1c1c",
        width: "100vw",
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <Container>
        <Header headerName="Sugar Hub"></Header>
        <Box
          sx={{
            backgroundColor: "#454545",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <PromptHeader pp={pp as ppt}></PromptHeader>
          <MyTabs pp={pp as ppt}></MyTabs>
        </Box>
      </Container>
    </Box>
  );
};

export default MarketplacePage;

function Row({ pt, pp }: { pt: ptt; pp: ppt }) {
  // const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: "#FFFFFF" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: "#FFFFFF" }}>
          {pt?.name}
        </TableCell>
        <TableCell align="right" sx={{ color: "#FFFFFF" }}>
          {pt?.releaseVersion?.version || "NA"}
        </TableCell>
        <TableCell align="right" sx={{ color: "#FFFFFF" }}>
          {pt?.previewVersion?.version || "NA"}
        </TableCell>
        <TableCell align="right" sx={{ color: "#FFFFFF" }}>
          {pt?.releaseVersion?.llmProvider}
        </TableCell>
        <TableCell align="right" sx={{ color: "#FFFFFF" }}>
          {pt?.releaseVersion?.llmModel}
        </TableCell>
        <TableCell align="right" sx={{ color: "#FFFFFF" }}>
          {getRandomValue(1000, 5000)}
        </TableCell>
        <TableCell align="right" sx={{ color: "#FFFFFF" }}>
          {getRandomValue(2000, 4000)}
        </TableCell>
        <TableCell align="right" sx={{ color: "#FFFFFF" }}>
          {getRandomValue(70, 98)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "#FFFFFF" }}
              >
                Templates
              </Typography>

              {pt?.releaseVersion && (
                <Typography component="p" gutterBottom>
                  <PublicUrl
                    title={"Release URL"}
                    url={`/${pp?.User?.username}/${pp?.name}/${pt.name}/release`}
                  />
                  Release ({pt?.releaseVersion?.version}):{" "}
                  {pt?.releaseVersion?.template}
                </Typography>
              )}

              {pt?.previewVersion && (
                <Typography component="p" gutterBottom>
                  <PublicUrl
                    title={"Preview URL"}
                    url={`/${pp?.User?.username}/${pp?.name}/${pt.name}/preview`}
                  />
                  Preview ({pt?.previewVersion?.version}):{" "}
                  {pt?.previewVersion?.template}
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function CollapsibleTable({ pp }: { pp: ppt }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "#1f1f1f", borderRadius: "0.5rem" }}
    >
      <Table
        aria-label="collapsible table"
        sx={{ backgroundColor: "#1f1f1f", borderRadius: "0.5rem" }}
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ color: "white" }}>Template</TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Release
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Preview
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              LLM Provider
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              LLM Model
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Latency(p95) &nbsp;(ms)
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Token (p95) &nbsp;(count)
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Accuracy &nbsp;(%)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pp?.templates &&
            pp?.templates.length > 0 &&
            pp.templates.map(
              (pt, index) =>
                (pt.releaseVersion || pt.previewVersion) && (
                  <Row key={index} pt={pt} pp={pp} />
                ),
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function MyTabs({ pp }: { pp: ppt }) {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div
      style={{
        backgroundColor: "#686868",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable" // This makes the tabs scrollable
        scrollButtons="auto" // This makes scroll buttons appear when there are more tabs than can fit
        aria-label="Scrollable tabs example"
        TabIndicatorProps={{ style: { background: "white" } }}
        sx={{
          ".Mui-selected": {
            color: `#FFFFFF`,
          },
        }}
      >
        <Tab label="Prompt Package" sx={{ color: "white" }} />
        <Tab label="Integration" sx={{ color: "white" }} />
        {/* Add more tabs as needed */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Paper sx={{ backgroundColor: "#262B32", borderRadius: "0.5rem" }}>
          <Card
            sx={{
              backgroundColor: "#262B32",
              borderRadius: "0.5rem",
              color: "white",
            }}
          >
            <CardContent>
              <Typography paragraph variant="body1">
                {pp?.description}
              </Typography>

              <Typography paragraph variant="body1">
                templates • {pp?.templates?.length}
              </Typography>

              <CollapsibleTable pp={pp} />
            </CardContent>
          </Card>
        </Paper>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Paper sx={{ backgroundColor: "#262b32" }}>
          <PromptIntegration ns={pp?.User} pp={pp}></PromptIntegration>
        </Paper>
      </TabPanel>
    </div>
  );
}
