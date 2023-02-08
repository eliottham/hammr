import React, { useCallback, useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ClientContext from "../../contexts/client_context";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import QueueTrack from "./QueueTrack";
import List from "@mui/material/List";

function Queue() {
  const client = useContext(ClientContext);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const onAddToQueue = (t) => {
      setTracks(tracks.concat(t));
    };
    client.on("add-to-queue", onAddToQueue);

    const onRemoveFromQueue = (index) => {
      // can't splice array since this mutates the state directly
      setTracks(tracks.filter((t, i) => i !== index));
    };
    client.on("remove-from-queue", onRemoveFromQueue);

    return () => {
      client.un("add-to-queue", onAddToQueue);
      client.un("remove-from-queue", onRemoveFromQueue);
    };
  }, [tracks]);

  return (
    <Box
      sx={{
        width: "350px",
        position: "fixed",
        backgroundColor: "neutral.main",
        // backgroundColor: "black",
        marginTop: "60px",
        height: "calc(100vh - 140px)",
        borderRight: "1px solid #282828",
        // borderRight: "1px solid",
        // borderColor: "primary.main",
      }}
    >
      <Box width="100%" textAlign="center">
        <Box
          borderBottom="1px solid"
          borderColor="#282828"
          display="flex"
          flexDirection="row"
          padding="5px"
          alignItems="center"
          justifyContent="center"
        >
          <QueueMusicIcon />
          &nbsp;<Typography variant="subtitle2">Queue</Typography>
        </Box>
        {tracks.length ? (
          <List disablePadding>
            {tracks.map((track, i) => {
              return <QueueTrack key={track.id} track={track} index={i} />;
            })}
          </List>
        ) : (
          <Typography variant="subtitle1">No tracks in queue</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Queue;
