import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useSession, signOut, signIn } from "next-auth/react";
import { Avatar, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import Logo1 from "../../../public/navbar-logo.png";
import Logo2 from "../../../public/favicon.ico";

const Header = (props: any) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState<boolean>(false);

  async function handleProfileCardClick() {
    await router.push("/dashboard/profile");
  }

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
            {sessionData && (
              <>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    className="h-8 w-8"
                    alt="Profile Image"
                    src={sessionData?.user?.image || "/images/avatar.png"}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setOpen(!open)}
                  />
                  {open && (
                    <Box
                      sx={{
                        position: "absolute",
                        backgroundColor: "#686868",
                        borderRadius: "0.5rem",
                        top: "2rem",
                      }}
                    >
                      <MenuItem>
                        <Typography
                          textAlign="center"
                          onClick={() => void handleProfileCardClick()}
                        >
                          Profile
                        </Typography>
                      </MenuItem>
                      <MenuItem>
                        <Typography
                          textAlign="center"
                          onClick={() => void signOut()}
                        >
                          Logout
                        </Typography>
                      </MenuItem>
                    </Box>
                  )}
                </Box>
              </>
            )}
            {!sessionData && (
              <>
                <Box sx={{ position: "relative" }}>
                  <IconButton>
                    <Avatar
                      alt="logo"
                      src={Logo2.src}
                      sx={{ cursor: "pointer" }}
                      onClick={() => setOpen(!open)}
                    />
                  </IconButton>
                  {open && (
                    <Box
                      sx={{
                        position: "absolute",
                        backgroundColor: "#686868",
                        borderRadius: "0.5rem",
                        top: "3.2rem",
                      }}
                    >
                      <MenuItem>
                        <Typography
                          textAlign="center"
                          onClick={() => void signIn()}
                        >
                          Login
                        </Typography>
                      </MenuItem>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
