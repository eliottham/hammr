import React, { useState, useContext, useEffect } from "react";
import ClientContext from "../../contexts/client_context";
import Grid from "@mui/material/Grid";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import AddToQueueButton from "../Queue/AddToQueueButton";

function Track({ track }) {
  const client = useContext(ClientContext);
  const theme = useTheme();

  const [trackPlaying, setTrackPlaying] = useState(false);
  const [restartTrack, setRestartTrack] = useState(true);
  const [trackImgColor, setTrackImgColor] = useState(
    theme.palette.primary.main
  );

  useEffect(() => {
    if (client && client.spotifyPlayer) {
      client.spotifyPlayer.getCurrentState().then((state) => {
        if (state) {
          const sameTrack = track?.id === state.track_window.current_track.id;
          setTrackPlaying(sameTrack);
          setRestartTrack(!sameTrack);
        }
      });
    }

    const colorThief = new window.ColorThief();
    let trackImg;
    const onTrackImgLoad = () => {
      const color = colorThief.getColor(trackImg);
      track.color = color;
      setTrackImgColor(color);
    };
    if (track) {
      trackImg = document.createElement("img");
      trackImg.setAttribute("hidden", true);
      trackImg.setAttribute("src", track.album.images[2].url);
      trackImg.setAttribute("crossorigin", "anonymous");
      if (trackImg.complete) {
        // setTrackImgColor(colorThief.getColor(trackImg));
        const color = colorThief.getColor(trackImg);
        track.color = color;
        setTrackImgColor(color);
      } else {
        trackImg.addEventListener("load", onTrackImgLoad);
      }
    }

    const onSpotifyPlayerStateChanged = ({
      paused,
      current_track,
      position,
      duration,
    }) => {
      if (track.id === current_track.id && isNaN(client.queueTrackIndex)) {
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
      if (trackImg) {
        trackImg.removeEventListener("load", onTrackImgLoad);
      }
    };
  }, [client, track]);

  function handlePlayTrackClick(e) {
    e.stopPropagation();
    if (restartTrack) {
      client.spotifyPlayTrack(track);
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
        height: "160px",
        boxShadow: "-5px 5px 5px rgba(0, 0, 0, 0.35)",
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
          alt="album"
          width="120px"
          height="120px"
          style={{
            borderRadius: "8px",
            boxShadow: "-5px 5px 5px rgba(0, 0, 0, 0.65)",
          }}
        />
      </Grid>
      <Grid item xs={6} sx={{ paddingLeft: "20px" }}>
        <Typography gutterBottom variant="h6">
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
      <Grid item xs={3}>
        <AddToQueueButton track={track} />
        <IconButton onClick={handlePlayTrackClick}>
          {trackPlaying ? (
            <PauseCircleIcon fontSize="large" />
          ) : (
            <PlayCircleIcon fontSize="large" />
          )}
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default Track;
