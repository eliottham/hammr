import React, { useCallback, useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeUp from "@mui/icons-material/VolumeUp";
import TrackListItem from "./Track/TrackListItem";
import _debounce from "lodash/debounce";
import ClientContext from "../contexts/client_context";

function Player() {
  const client = useContext(ClientContext);

  const [track, setTrack] = useState();
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(100);
  const [trackPosition, setTrackPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  useEffect(() => {
    const onSpotifyPlayTrack = ({ track }) => {
      setTrack(track);
      setPaused(false);
    };
    client.on("spotify-play-track", onSpotifyPlayTrack);

    return () => {
      client.un("spotify-play-track", onSpotifyPlayTrack);
    };
  }, []);

  useEffect(() => {
    const onGetSpotifyTokens = ({ spotifyAccessToken, track }) => {
      const previousScript = document.getElementById("spotify-player");
      if (previousScript) {
        previousScript.remove();
      }
      const script = document.createElement("script", {
        is: "spotify-web-player",
      });
      script.id = "spotify-player";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
      window.onSpotifyWebPlaybackSDKReady = () => {
        client.spotifyPlayer = new window.Spotify.Player({
          name: "Zam Web Player",
          getOAuthToken: async (cb) => {
            cb(spotifyAccessToken);
          },
        });
        client.spotifyPlayer.addListener("ready", ({ device_id }) => {
          client.spotifyDeviceId = device_id;
          if (track) {
            client.spotifyPlayTrack(track, device_id);
          }
        });
        client.spotifyPlayer.addListener(
          "player_state_changed",
          ({ position, duration, paused, track_window: { current_track } }) => {
            setTrackPosition(position);
            setTrackDuration(duration);
            setPaused(paused);
            if (track !== current_track) {
              setTrack(current_track);
            }
            if (position === duration) {
              setTrackPosition(0);
              setPaused(true);
            }
            client.fire("spotify-player-state-changed", {
              position,
              duration,
              paused,
              current_track,
            });
          }
        );
        // TODO: Add detailed error message to user
        // https://developer.spotify.com/documentation/web-playback-sdk/reference/#error-reference
        client.spotifyPlayer.on("initialization_error", ({ message }) => {
          console.error("Failed to initialize", message);
        });
        client.spotifyPlayer.on("authentication_error", ({ message }) => {
          console.error("Failed to authenticate", message);
        });
        client.spotifyPlayer.on("account_error", ({ message }) => {
          console.error("Failed to validate Spotify account", message);
        });
        client.spotifyPlayer.on("playback_error", ({ message }) => {
          console.error("Failed to perform playback", message);
        });
        client.spotifyPlayer.connect();
      };
    };
    client.on("get-spotify-tokens", onGetSpotifyTokens);

    return () => {
      client.un("get-spotify-tokens", onGetSpotifyTokens);
    };
  }, []);

  useEffect(() => {
    let intervalId;
    if (!paused) {
      intervalId = setInterval(
        () => setTrackPosition(trackPosition + 1000),
        1000
      );
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [paused, trackPosition]);

  function msToMinSec(ms) {
    let min = Math.floor(ms / 60000);
    let sec = ((ms % 60000) / 1000).toFixed(0);
    if (sec === 60) {
      min += 1;
      sec = 0;
    }
    return `${min}:${String(sec).padStart(2, "0")}`;
  }

  function handlePlayback() {
    setPaused(!paused);
    if (paused) {
      client.spotifyPlayer.resume();
    } else {
      client.spotifyPlayer.pause();
    }
  }

  function handlePositionChange(e, newValue) {
    setTrackPosition(newValue);
    client.spotifyPlayer.seek(newValue);
  }
  const debounceHandlePositionChange = useCallback(
    _debounce(handlePositionChange, 50)
  );

  function handleVolumeChange(e, newValue) {
    setVolume(newValue);
    client.spotifyPlayer.setVolume(volume / 100);
  }

  return (
    <Grid
      sx={{
        position: "fixed",
        bottom: 0,
        backgroundColor: "#181818",
        borderTop: "1px solid #282828",
        right: 0,
        height: "80px",
      }}
      container
      alignItems="center"
    >
      <Grid item xs={3}>
        <List disablePadding>
          <TrackListItem track={track} style={{}} />
        </List>
      </Grid>
      <Grid item xs={6}>
        <Stack direction="column">
          <Stack direction="row" sx={{ margin: "0 auto 0 auto" }}>
            <IconButton>
              <SkipPreviousIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={handlePlayback}>
              {paused ? (
                <PlayCircleIcon fontSize="large" />
              ) : (
                <PauseCircleIcon fontSize="large" />
              )}
            </IconButton>
            <IconButton>
              <SkipNextIcon fontSize="large" />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", margin: "-10px 0 10px 0" }}
          >
            {trackPosition !== 0 && trackDuration !== 0 && (
              <span>{msToMinSec(trackPosition)}</span>
            )}
            <Slider
              sx={{ width: "50%", margin: "0px 10px 0 10px" }}
              size="small"
              value={trackPosition}
              min={0}
              step={1}
              max={trackDuration}
              onChange={debounceHandlePositionChange}
            />
            {trackPosition !== 0 && trackDuration !== 0 && (
              <span>{msToMinSec(trackDuration)}</span>
            )}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={3}>
        <Stack
          sx={{ width: "35%", marginLeft: "auto", marginRight: "10%" }}
          spacing={2}
          direction="row"
          alignItems="center"
        >
          <VolumeUp fontSize="small" />
          <Slider
            aria-label="Volume"
            size="small"
            value={volume}
            onChange={handleVolumeChange}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Player;
