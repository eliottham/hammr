import { useContext, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
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
  }, []);

  function handleEditButtonClick() {
    setEdit(!edit);
  }

  if (edit) {
    return (
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={1}
      >
        <Avatar
          sx={{ width: 24, height: 24 }}
          variant="circle"
          src={thisComment.author.avatar}
        />
        <Stack direction="column" spacing={1} sx={{ width: "90%" }}>
          <Typography variant="caption" sx={{ display: "flex" }}>
            <UsernameLink author={thisComment.author} />
            &nbsp;-
            {thisComment.edited ? (
              <Box sx={{ fontStyle: "italic" }}>
                &nbsp;edited {Util.getTimeFromNow(thisComment.timestamp)}
              </Box>
            ) : (
              <Box sx={{ fontStyle: "default" }}>
                &nbsp;{Util.getTimeFromNow(thisComment.timestamp)}
              </Box>
            )}
          </Typography>
          <EditComment
            originalComment={thisComment}
            cancelEditFunction={() => setEdit(false)}
          />
          <Stack direction="row" alignItems="center">
            <LikeButton comment={thisComment} />
            {client.user._id === thisComment.author._id && (
              <Box sx={{ marginLeft: "8px" }}>
                <Tooltip title="Edit Comment">
                  <IconButton onClick={handleEditButtonClick}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Comment">
                  <IconButton
                    onClick={() => client.deleteComment(thisComment._id)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={1}
      >
        <Avatar
          sx={{ width: 24, height: 24 }}
          variant="circle"
          src={thisComment.author.avatar}
        />
        <Stack direction="column" spacing={1}>
          <Typography variant="caption" sx={{ display: "flex" }}>
            <UsernameLink author={thisComment.author} />
            &nbsp;-
            {thisComment.edited ? (
              <Box sx={{ fontStyle: "italic" }}>
                &nbsp;edited {Util.getTimeFromNow(thisComment.timestamp)}
              </Box>
            ) : (
              <Box sx={{ fontStyle: "default" }}>
                &nbsp;{Util.getTimeFromNow(thisComment.timestamp)}
              </Box>
            )}
          </Typography>
          {thisComment.spotifyTrack && (
            <Track track={thisComment.spotifyTrack} />
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
        </Stack>
      </Stack>
    );
  }
}

export default Comment;
