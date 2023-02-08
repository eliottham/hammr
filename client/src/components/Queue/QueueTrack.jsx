import React, { useEffect, useState, useContext } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import ClientContext from "../../contexts/client_context";

const typographyStyle = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
};

function QueueTrack({ track, index }) {
  const client = useContext(ClientContext);
  const [trackColor, setTrackColor] = useState(track.color || [0, 0, 0]);
  const [trackPlaying, setTrackPlaying] = useState(false);
  const [restartTrack, setRestartTrack] = useState(true);

  useEffect(() => {
    let trackImg;
    let onTrackImgLoad;
    if (!track.color) {
      const colorThief = new window.ColorThief();
      onTrackImgLoad = () => {
        setTrackColor(colorThief.getColor(trackImg));
      };
      if (track) {
        trackImg = document.createElement("img");
        trackImg.setAttribute("hidden", true);
        trackImg.setAttribute("src", track.album.images[2].url);
        trackImg.setAttribute("crossorigin", "anonymous");
        if (trackImg.complete) {
          setTrackColor(colorThief.getColor(trackImg));
        } else {
          trackImg.addEventListener("load", onTrackImgLoad);
        }
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
      if (trackImg) {
        client.un("spotify-player-state-changed", onSpotifyPlayerStateChanged);
        trackImg.removeEventListener("load", onTrackImgLoad);
      }
    };
  }, []);

  function handleRemoveFromQueueClick() {
    client.fire("remove-from-queue", index);
  }

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
    <ListItem
      key={track?.id}
      sx={{
        width: "100%",
        borderTop: "1px solid #282828",
        backgroundColor: `rgba(${trackColor[0]}, ${trackColor[1]}, ${trackColor[2]}, 0.7)`,
        border: "2px solid",
        borderColor: trackPlaying ? "primary.main" : `rgba(0, 0, 0, 0)`,
        "&:hover": {
          backgroundColor: "primary.main",
          color: "neutral.main",
          ".MuiListItemText-secondary": {
            color: "neutral.main",
          },
          ".MuiIconButton-root": {
            color: "neutral.main",
          },
        },
      }}
    >
      <Typography pr="16px" variant="button">
        {index + 1}
      </Typography>
      <ListItemAvatar>
        <Avatar variant="square" src={track?.album.images[0].url} />
      </ListItemAvatar>
      <ListItemText
        primary={track?.name}
        primaryTypographyProps={{
          style: typographyStyle,
        }}
        secondary={track?.artists[0].name}
        secondaryTypographyProps={{
          style: typographyStyle,
        }}
      />
      <Tooltip title="Remove from queue">
        <IconButton onClick={handleRemoveFromQueueClick}>
          <HighlightOffIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <IconButton onClick={handlePlayTrackClick}>
        {trackPlaying ? (
          <PauseCircleOutlineIcon fontSize="small" />
        ) : (
          <PlayCircleOutlineIcon fontSize="small" />
        )}
      </IconButton>
    </ListItem>
  );
}

export default QueueTrack;
