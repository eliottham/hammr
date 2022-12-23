import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Dialog } from "@mui/material";

import { ClientProvider } from "./contexts/client_context";

import Client from "./client";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Player from "./components/Player";
import NavBar from "./components/NavBar";
import CreatePost from "./components/CreatePost";
import Post from "./components/Post";
import SpotifyAuthorization from "./components/SpotifyAuhorization";

const client = new Client();

const theme = createTheme({
  palette: {
    primary: {
      // main: '#ffbb00',
      // main: '#0070ff'
      // main: "#b38500",
      main: "rgba(56, 82, 56, 1)",
    },
    mode: "dark",
  },
});

const App = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openSpotifyAuthDialog, setOpenSpotifyAuthDialog] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onLogin = ({ user_id, username }) => {
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", username);
      client.getSpotifyTokens();
      setOpenLoginDialog(false);
      navigate(0);
    };
    client.on("login", onLogin);

    const onRequireAuthentication = () => {
      setOpenLoginDialog(true);
      setOpenRegisterDialog(false);
    };
    client.on("require-authentication", onRequireAuthentication);
    client.on("login-link-click", onRequireAuthentication);

    const onRegisterLinkClick = () => {
      setOpenRegisterDialog(true);
      setOpenLoginDialog(false);
    };
    client.on("register-link-click", onRegisterLinkClick);

    const onRequireSpotifyAuthorization = () => {
      setOpenSpotifyAuthDialog(true);
    };
    client.on("require-spotify-authorization", onRequireSpotifyAuthorization);

    const onSpotifyAuthorizationLinkClick = () => {
      setOpenSpotifyAuthDialog(false);
    };
    client.on(
      "spotify-authorization-link-click",
      onSpotifyAuthorizationLinkClick
    );

    return () => {
      client.un("login", onLogin);
      client.un("require-authentication", onRequireAuthentication);
      client.un("login-link-click", onRequireAuthentication);
      client.un("register-link-click", onRegisterLinkClick);
      client.un(
        "spotify-authorization-link-click",
        onSpotifyAuthorizationLinkClick
      );
    };
  }, []);

  return (
    <div>
      <ClientProvider value={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Dialog
            open={openLoginDialog}
            onClose={() => setOpenLoginDialog(false)}
            PaperComponent={Login}
          />
          <Dialog
            open={openRegisterDialog}
            onClose={() => setOpenLoginDialog(false)}
            PaperComponent={Register}
          />
          <Dialog
            open={openSpotifyAuthDialog}
            onClose={() => setOpenSpotifyAuthDialog(false)}
            PaperComponent={SpotifyAuthorization}
          />
          <NavBar />
          <div style={{ paddingBottom: "80px" }}>
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/post" element={<CreatePost />} />
              <Route path="/post/:post_id" element={<Post />} />
            </Routes>
          </div>
          <Player />
        </ThemeProvider>
      </ClientProvider>
    </div>
  );
};

export default App;
