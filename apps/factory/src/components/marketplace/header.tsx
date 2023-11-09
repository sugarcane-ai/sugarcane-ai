import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar } from "@mui/material";
import Logo1 from "../../../public/navbar-logo.png";
import Logo2 from "../../../public/favicon.ico";
const Header = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1c1c1c" }}>
      <Toolbar>
        <Container maxWidth="lg">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "1000" }}
            >
              <Link href="/" color="inherit" underline="none">
                <IconButton sx={{ p: 0, marginRight: "1rem" }}>
                  <Avatar alt="logo" src={Logo1.src} />
                </IconButton>
                Sugar Hub
              </Link>
            </Typography>
            <nav>
              {/* <Link href="/products/pro" color="inherit" underline="none">
                Pro
              </Link>
              <Link href="/products/teams" color="inherit" underline="none">
                Teams
              </Link>
              <Link href="/products" color="inherit" underline="none">
                Pricing
              </Link> */}
              {/* <Link href="https://docs.npmjs.com" color="inherit" underline="none">
                Documentation
              </Link> */}
            </nav>
            <IconButton sx={{ p: 0, marginRight: "1rem" }}>
              <Avatar alt="logo" src={Logo2.src} />
            </IconButton>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
