import { useContext } from "react";
import { Grid, Paper, Button } from "@mui/material";
import ClientContext from "../../contexts/client_context";

function SpotifyAuthorization() {
  const client = useContext(ClientContext);

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
