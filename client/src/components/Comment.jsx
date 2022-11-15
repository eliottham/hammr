import React, { useState, useContext, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";

function Comment({ user_id, username, userAvatar, comment, id, spotifyTrack }) {
  const theme = useTheme();

  useEffect(() => {}, []);

  return (
    <ListItem key={id}>
      <ListItemAvatar>
        <Avatar variant="square" src={userAvatar} />
      </ListItemAvatar>
      <ListItemText primary={username} secondary={comment} />
    </ListItem>
  );
}

export default Comment;
