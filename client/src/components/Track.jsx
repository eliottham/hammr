import React, { useState, useContext, useEffect } from "react";
import Stack from "@mui/material/Stack";
import ClientContext from "../contexts/client_context";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

function Track({ track }) {
  const client = useContext(ClientContext);
  const theme = useTheme();

  const [trackPlaying, setTrackPlaying] = useState(false);
  const [restartTrack, setRestartTrack] = useState(true);
  const [trackImgColor, setTrackImgColor] = useState(
    theme.palette.primary.main
  );

  useEffect(() => {
    if (track) {
      const colorThief = new window.ColorThief();
      const trackImg = document.createElement("img");
      trackImg.setAttribute("hidden", true);
      trackImg.setAttribute("src", track.album.images[2].url);
      trackImg.setAttribute("crossorigin", "anonymous");
      if (trackImg.complete) {
        setTrackImgColor(colorThief.getColor(trackImg));
      } else {
        trackImg.addEventListener("load", () => {
          setTrackImgColor(colorThief.getColor(trackImg));
        });
      }
    }

    const onSpotifyPlayerStateChanged = ({
      paused,
      current_track,
      position,
      duration,
    }) => {
      if (track.id === current_track.id) {
        setTrackPlaying(!paused);
        setRestartTrack(false);
        if (position === duration) {
          setRestartTrack(true);
          setTrackPlaying(false);
        }
      } else {
        setRestartTrack(true);
        setTrackPlaying(false);
      }
    };
    client.on("spotify-player-state-changed", onSpotifyPlayerStateChanged);
    return () => {
      client.un("spotify-player-state-changed", onSpotifyPlayerStateChanged);
    };
  }, []);

  function handlePlayTrackClick() {
    if (restartTrack) {
      client.spotifyPlayTrack(track, client.spotifyDeviceId);
    } else if (trackPlaying) {
      client.spotifyPlayer.pause();
    } else {
      client.spotifyPlayer.resume();
    }
  }

  return (
    <Grid
      container
      alignItems="center"
      direction="row"
      sx={{
        backgroundColor: `rgba(${trackImgColor[0]}, ${trackImgColor[1]}, ${trackImgColor[2]}, 0.7)`,
        borderRadius: "0.75rem",
        width: "572px",
        height: "160px",
      }}
    >
      <Grid
        item
        xs={3}
        sx={{
          padding: "20px",
        }}
      >
        <img
          src={track?.album.images[0].url}
          width="120px"
          height="120px"
          style={{
            borderRadius: "8px",
            boxShadow: "-5px 5px 5px rgba(0, 0, 0, 0.65)",
          }}
        />
      </Grid>
      <Grid item xs={7} sx={{ paddingLeft: "20px" }}>
        <Typography gutterBottom variant="h5">
          {track?.name}
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          mt={-1}
          color={"text.secondary"}
        >
          {track?.artists[0].name}
        </Typography>
      </Grid>
      <Grid item xs={2} alignItems="flex-end">
        <IconButton
          onClick={handlePlayTrackClick}
          style={{ margin: "auto 0 auto 0" }}
        >
          {trackPlaying ? (
            <PauseCircleIcon fontSize="large" />
          ) : (
            <PlayCircleIcon fontSize="large" />
          )}
        </IconButton>
      </Grid>
    </Grid>
    // <Stack
    //   direction="row"
    //   spacing={0}
    //   sx={{
    //     // backgroundColor: "rgba(82, 82, 82, 0.5)",
    //     backgroundColor: theme.palette.primary.main,
    //     borderRadius: "10px",
    //     width: "fit-content",
    //   }}
    // >
    //   <IconButton
    //     onClick={handlePlayTrackClick}
    //     style={{ margin: "auto -15px auto 0px" }}
    //   >
    //     {trackPlaying ? (
    //       <PauseIcon fontSize="large" />
    //     ) : (
    //       <PlayArrowIcon fontSize="large" />
    //     )}
    //   </IconButton>
    //   <Track track={track} />
    //   {/* <List>
    //     <TrackListItem track={track} style={{}} />
    //   </List> */}
    // </Stack>
  );
}

export default Track;
