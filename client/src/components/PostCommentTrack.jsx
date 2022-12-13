import React, { useState, useContext, useEffect } from "react";
import Stack from "@mui/material/Stack";
import ClientContext from "../contexts/client_context";
import Track from "./Track";
import List from "@mui/material/List";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseIcon from "@mui/icons-material/Pause";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

function PostCommentTrack({ track }) {
  const client = useContext(ClientContext);
  const theme = useTheme();

  const [trackPlaying, setTrackPlaying] = useState(false);
  const [restartTrack, setRestartTrack] = useState(true);

  useEffect(() => {
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
    <Stack
      direction="row"
      spacing={0}
      sx={{
        // backgroundColor: "rgba(82, 82, 82, 0.5)",
        backgroundColor: theme.palette.primary.main,
        borderRadius: "10px",
        width: "fit-content",
      }}
    >
      <IconButton
        onClick={handlePlayTrackClick}
        style={{ margin: "auto -15px auto 0px" }}
      >
        {trackPlaying ? (
          <PauseIcon fontSize="large" />
        ) : (
          <PlayArrowIcon fontSize="large" />
        )}
      </IconButton>
      <List>
        <Track track={track} style={{}} />
      </List>
    </Stack>
  );
}

export default PostCommentTrack;
