import { useContext } from "react";
import { Box, Paper, Button, Typography } from "@mui/material";
import ClientContext from "../../contexts/client_context";

function SpotifyAuthorization() {
  const client = useContext(ClientContext);

  return (
    <Paper
      elevation={10}
      sx={{
        padding: "20px",
        height: "20vh",
        width: "25vw",
        margin: "100px auto",
      }}
    >
      <Box display="flex" gap={1} flexDirection="column">
        <Typography variant="h6" textAlign="center">
          You must link your Spotify Premium account to use this feature.
        </Typography>
        <Button
          variant="contained"
          href="http://localhost:1337/spotify-authorization"
          onClick={() => client.fire("spotify-authorization-close-dialog")}
        >
          Authorize
        </Button>
        <Button
          variant="contained"
          onClick={() => client.fire("spotify-authorization-close-dialog")}
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}

export default SpotifyAuthorization;
