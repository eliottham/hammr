import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Dialog } from "@mui/material";

import { ClientProvider } from "./contexts/client_context";

import Client from "./client";

import Login from "./components/Dialog/Login";
import Register from "./components/Dialog/Register";
import Feed from "./components/Feed";
import Player from "./components/Player";
import NavBar from "./components/NavBar";
import CreatePost from "./components/Post/CreatePost";
import Post from "./components/Post/Post";
import UserProfile from "./components/User/UserProfile";
import SpotifyAuthorization from "./components/Dialog/SpotifyAuhorization";
import EditUserProfile from "./components/User/EditUserProfile";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Queue from "./components/Queue/Queue";
import SearchResults from "./components/SearchResults";

const client = new Client();
client.socket = new window.io("http://127.0.0.1:1337");

const theme = createTheme({
  palette: {
    background: {
      default: "#0e0e0e",
    },
    primary: {
      main: "#CCCCFF",
    },
    neutral: {
      main: "#181818",
    },
    mode: "dark",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
});

const App = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openSpotifyAuthDialog, setOpenSpotifyAuthDialog] = useState(false);
  const [render, rerender] = useState(false);
  const [alert, setAlert] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("app mount");
    const onGetCurrentUser = (user) => {
      client.user = user;
      client.socket.emit("user", user._id);
      console.log("manual rerender");
      // Manually rerender so all child components have access to current user through the client context
      rerender(!render);
    };
    client.on("get-current-user", onGetCurrentUser);
    client.getCurrentUser();

    const onLogin = () => {
      console.log("on login");
      setOpenLoginDialog(false);
      console.log("navigate");
      navigate(0);
    };
    client.on("login", onLogin);

    const onLogout = () => {
      navigate("/");
    };
    client.on("logout", onLogout);

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

    const onCloseSpotifyAuthorizationDialog = () => {
      setOpenSpotifyAuthDialog(false);
    };
    client.on(
      "spotify-authorization-close-dialog",
      onCloseSpotifyAuthorizationDialog
    );

    const onAlert = (a) => {
      setAlert(a);
      setTimeout(() => {
        setAlert();
      }, 5000);
    };
    client.on("alert", onAlert);

    return () => {
      client.un("get-current-user", onGetCurrentUser);
      client.un("login", onLogin);
      client.un("logout", onLogout);
      client.un("require-authentication", onRequireAuthentication);
      client.un("login-link-click", onRequireAuthentication);
      client.un("register-link-click", onRegisterLinkClick);
      client.un(
        "spotify-authorization-link-click",
        onCloseSpotifyAuthorizationDialog
      );
      client.un("alert", onAlert);
    };
  }, []);

  if (client.user === undefined) {
    return <></>;
  }

  return (
    <Box height="100%">
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
          <Queue />
          <Box
            sx={{
              paddingTop: "60px",
              paddingBottom: "80px",
            }}
          >
            <Routes>
              <Route path="/" exact element={<Feed />} />
              <Route path="/post" element={<CreatePost />} />
              <Route path="/post/:post_id" element={<Post />} />
              <Route path="/user/:user_id" element={<UserProfile />} />
              <Route path="/user/edit" element={<EditUserProfile />} />
              <Route path="/search/:query" element={<SearchResults />} />
            </Routes>
          </Box>
          <Box
            sx={{
              overflow: "hidden",
              position: "fixed",
              bottom: "80px",
              width: "100%",
              pointerEvents: "none",
            }}
          >
            <Slide direction="up" in={!!alert}>
              <Alert severity={alert?.severity}>{alert?.message}</Alert>
            </Slide>
          </Box>
          <Player />
        </ThemeProvider>
      </ClientProvider>
    </Box>
  );
};

export default App;
