import { useContext, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Track from "../Track/Track";
import Typography from "@mui/material/Typography";
import Util from "../../util.js";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import ClientContext from "../../contexts/client_context";
import LikeButton from "../LikeButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import EditComment from "./EditComment";
import UsernameLink from "../User/UsernameLink";
import UserAvatarLink from "../User/UserAvatarLink";
import Grid from "@mui/material/Grid";

function Comment({ comment }) {
  const client = useContext(ClientContext);
  const [thisComment, setThisComment] = useState(comment);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const onEditComment = (responseComment) => {
      if (responseComment._id === thisComment._id) {
        setThisComment(responseComment);
        setEdit(false);
      }
    };
    client.on("edit-comment", onEditComment);

    return () => {
      client.un("edit-comment", onEditComment);
    };
  }, [comment]);

  function handleEditButtonClick() {
    setEdit(!edit);
  }

  if (edit) {
    return (
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <UserAvatarLink user={thisComment.author} />
        </Grid>
        <Grid item xs={11} alignItems="baseline" display="flex">
          <UsernameLink user={thisComment.author} />
          <Typography
            variant="caption"
            alignContent="center"
            color="text.secondary"
            fontStyle={thisComment.edited ? "italic" : "default"}
          >
            &nbsp;&bull;&nbsp;
            {thisComment.edited && "edited "}
            {Util.getTimeFromNow(thisComment.creationDate)}
          </Typography>
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={9}>
          <EditComment
            originalComment={thisComment}
            cancelEditFunction={() => setEdit(false)}
          />
          <Stack direction="row" alignItems="center">
            <LikeButton comment={thisComment} />
            {client.user._id === thisComment.author._id && (
              <>
                <Tooltip title="Edit Comment">
                  <IconButton onClick={handleEditButtonClick} edge="start">
                    <EditOutlinedIcon fontSize="small" />
                    <Typography variant="button">&nbsp;Edit</Typography>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Comment">
                  <IconButton
                    edge="start"
                    onClick={() => client.deleteComment(thisComment._id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                    <Typography variant="button">&nbsp;Delete</Typography>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    );
  } else {
    return (
      <Grid container columns={24} spacing={1} alignItems="center">
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <UserAvatarLink user={thisComment.author} />
        </Grid>
        <Grid item xs={23} alignItems="baseline" display="flex">
          <UsernameLink user={thisComment.author} />
          <Typography
            variant="caption"
            alignContent="center"
            color="text.secondary"
            fontStyle={thisComment.edited ? "italic" : "default"}
          >
            &nbsp;&bull;&nbsp;
            {thisComment.edited && "edited "}
            {Util.getTimeFromNow(thisComment.creationDate)}
          </Typography>
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={21}>
          {thisComment.spotifyTrack && (
            <Box mb="10px">
              <Track track={thisComment.spotifyTrack} />
            </Box>
          )}
          <Typography variant="body1">{thisComment.comment}</Typography>
          <Stack direction="row" alignItems="center">
            <LikeButton comment={thisComment} />
            {client.user._id === thisComment.author._id && (
              <>
                <Tooltip title="Edit Comment">
                  <IconButton onClick={handleEditButtonClick} edge="start">
                    <EditOutlinedIcon fontSize="small" />
                    <Typography variant="button">&nbsp;Edit</Typography>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Comment">
                  <IconButton
                    edge="start"
                    onClick={() => client.deleteComment(thisComment._id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                    <Typography variant="button">&nbsp;Delete</Typography>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
          <Grid item xs={2} />
        </Grid>
      </Grid>
    );
  }
}

export default Comment;
