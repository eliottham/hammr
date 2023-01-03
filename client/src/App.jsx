import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Dialog } from "@mui/material";

import { ClientProvider } from "./contexts/client_context";

import Client from "./client";

import Login from "./components/Dialog/Login";
import Register from "./components/Dialog/Register";
import Dashboard from "./components/Dashboard";
import Player from "./components/Player";
import NavBar from "./components/NavBar";
import CreatePost from "./components/Post/CreatePost";
import Post from "./components/Post/Post";
import SpotifyAuthorization from "./components/Dialog/SpotifyAuhorization";

const client = new Client();

const theme = createTheme({
  palette: {
    primary: {
      // main: '#ffbb00',
      // main: '#0070ff'
      // main: "#b38500",
      main: "rgba(56, 82, 56, 1)",
      grey: "#d6cdcb",
    },
    mode: "dark",
  },
});

const App = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openSpotifyAuthDialog, setOpenSpotifyAuthDialog] = useState(false);

  const navigate = useNavigate();

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
            disableScrollLock
          />
          <Dialog
            open={openRegisterDialog}
            onClose={() => setOpenLoginDialog(false)}
            PaperComponent={Register}
            disableScrollLock
          />
          <Dialog
            open={openSpotifyAuthDialog}
            onClose={() => setOpenSpotifyAuthDialog(false)}
            PaperComponent={SpotifyAuthorization}
            disableScrollLock
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
