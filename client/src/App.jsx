import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { ClientProvider } from "./contexts/client_context";
import { UserProvider } from "./contexts/user_context";
import { SpotifyPlayerProvider } from "./contexts/spotify_player_context";

import Client from "./client";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Player from "./components/Player";
import NavBar from "./components/NavBar";
import CreatePost from "./components/CreatePost";
import Post from "./components/Post";

const client = new Client();

const theme = createTheme({
  palette: {
    primary: {
      // main: '#ffbb00',
      // main: '#0070ff'
      main: "#b38500",
    },
    mode: "dark",
  },
});

const pathsWithoutNavAndPlayer = ["/login", "/register"];

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onGetUser = (response) => {
      if (response.success) {
        client.getSpotifyTokens();
      } else {
        navigate("/login");
      }
    };
    client.on("get-user", onGetUser);

    const onRequireAuthentication = () => {
      navigate("/login");
    };
    client.on("require-authentication", onRequireAuthentication);

    return () => {
      client.un("get-user", onGetUser);
    };
  }, []);

  return (
    <div>
      <ClientProvider value={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!pathsWithoutNavAndPlayer.includes(location.pathname) && <NavBar />}
          <Routes>
            <Route path="/" exact element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
          </Routes>
          {!pathsWithoutNavAndPlayer.includes(location.pathname) && <Player />}
        </ThemeProvider>
      </ClientProvider>
    </div>
  );
};

export default App;
