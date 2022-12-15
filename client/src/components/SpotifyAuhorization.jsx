import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ClientContext from "../contexts/client_context";

function SpotifyAuthorization() {
  const client = useContext(ClientContext);
  const theme = useTheme();

  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{
          padding: "20px",
          height: "55vh",
          width: "25vw",
          margin: "100px auto",
        }}
      >
        <p>Spotify Authorization is required to use this feature</p>
        <Button
          variant="contained"
          href="http://localhost:1337/spotify-authorization"
          onClick={() => client.fire("spotify-authorization-link-click")}
        >
          Authorize
        </Button>
      </Paper>
    </Grid>
  );
}

export default SpotifyAuthorization;
