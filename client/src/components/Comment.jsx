import React, { useState, useContext, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import PostCommentTrack from "./PostCommentTrack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Util from "../util.js";
import IconButton from "@mui/material/IconButton";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import ClientContext from "../contexts/client_context";

function Comment({ _id, author, comment, spotifyTrack, timestamp }) {
  const client = useContext(ClientContext);
  const theme = useTheme();

  function formatTimeStamp(ts) {
    const { unit, value } = Util.getTimeFromNow(ts);
    return value + " " + unit + " ago";
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        spacing={1}
      >
        <Avatar
          sx={{ width: 24, height: 24 }}
          variant="circle"
          src={author.avatar}
        />
        <Typography variant="caption">
          {author.username} - {formatTimeStamp(timestamp)}
        </Typography>
      </Stack>
      {spotifyTrack && (
        <Stack direction="row">
          <Box sx={{ margin: "5px 0 10px 32px" }}>
            {spotifyTrack && <PostCommentTrack track={spotifyTrack} />}
            <Box sx={{ marginTop: "10px" }}>{comment}</Box>
          </Box>
        </Stack>
      )}
      {!spotifyTrack && <Box sx={{ margin: "0 0 10px 32px" }}>{comment}</Box>}
      {localStorage.getItem("user_id") === author._id && (
        <Stack direction="row">
          <Tooltip title="Delete Comment">
            <IconButton onClick={() => client.deleteComment(_id)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </>
  );
}

export default Comment;
