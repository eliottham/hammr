import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ClientContext from "../contexts/client_context";
import SearchBar from "./SearchBar";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import UserMenu from "./User/UserMenu";
import NotificationMenu from "./Notification/NotificationMenu";

function NavBar() {
  const client = useContext(ClientContext);
  const navigate = useNavigate();

  useEffect(() => {
    const onLogout = () => {
      navigate(0);
    };
    client.on("logout", onLogout);

    client.socket?.on("new-comment", (comment) => {
      console.log(comment);
    });

    return () => {
      client.un("logout", onLogout);
    };
  }, []);

  return (
    <Grid
      sx={{
        position: "fixed",
        top: 0,
        backgroundColor: "neutral.main",
        borderBottom: "1px solid #282828",
        right: 0,
        padding: "10px 20px 9px 20px",
        zIndex: 998,
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
        <NotificationMenu />
      </Grid>
      <Grid item xs={2}>
        <Box display="flex" justifyContent="flex-end">
          {!!!client.user._id && (
            <Button
              variant="contained"
              onClick={() => client.fire("login-link-click")}
            >
              Log In
            </Button>
          )}
          {!!client.user._id && <UserMenu />}
        </Box>
      </Grid>
    </Grid>
  );
}

export default NavBar;
