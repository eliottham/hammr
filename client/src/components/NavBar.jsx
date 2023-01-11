import React, { useCallback, useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ClientContext from "../contexts/client_context";
import SearchBar from "./SearchBar";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

function NavBar() {
  const client = useContext(ClientContext);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!client.user._id);

  // TODO: check if user is logged in and change logout button to login if not
  useEffect(() => {
    const onLogout = () => {
      navigate(0);
    };
    client.on("logout", onLogout);

    return () => {
      client.un("logout", onLogout);
    };
  }, []);

  return (
    <Grid
      sx={{
        position: "sticky",
        top: 0,
        backgroundColor: "#181818",
        borderBottom: "1px solid #282828",
        right: 0,
        padding: "10px 20px 10px 20px",
        zIndex: 999,
      }}
      container
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Grid item xs={4}>
        <Tooltip title="Home">
          <IconButton onClick={() => navigate("/")}>
            <HomeIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={4}>
        <SearchBar />
      </Grid>
      <Grid item xs={2}>
        <Tooltip title="Create Post">
          <IconButton onClick={() => navigate("/post")}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Notifications">
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={2}>
        <Box display="flex" justifyContent="flex-end">
          {!loggedIn && (
            <Button
              variant="contained"
              onClick={() => client.fire("login-link-click")}
            >
              Log In
            </Button>
          )}
          {loggedIn && (
            <Tooltip title="Log Out">
              <IconButton onClick={() => client.logout()}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default NavBar;
