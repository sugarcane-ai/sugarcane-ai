import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DocumentScanner from "@mui/icons-material/DocumentScanner";
import Dataset from "@mui/icons-material/Dataset";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Link from "next/link";

export const mainListItems = (
  <React.Fragment>
    <Link href="/dashboard">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>
    <Link href="/dashboard/prompts">
      <ListItemButton>
        <ListItemIcon>
          <DocumentScanner />
        </ListItemIcon>
        <ListItemText primary="Packages" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports xx
    </ListSubheader>

    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
  </React.Fragment>
);
