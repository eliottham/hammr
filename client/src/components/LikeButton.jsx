import React, { useState, useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ClientContext from "../contexts/client_context";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

function LikeButton({
  post,
  comment,
  size = "small",
  countLocation = "right",
}) {
  const client = useContext(ClientContext);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (post && post.liked_users) {
      setLiked(post.liked_users.includes(localStorage.getItem("user_id")));
      setLikeCount(post.liked_users.length);
    } else if (comment && comment.liked_users) {
      setLiked(comment.liked_users.includes(localStorage.getItem("user_id")));
      setLikeCount(comment.liked_users.length);
    }
  }, []);

  function handleOnClick() {
    if (liked) {
      client.dislike({ post, comment });
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      client.like({ post, comment });
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  }

  if (post) {
    return (
      <Stack direction="column" alignItems="center">
        <Tooltip title={liked ? "Dislike" : "Like"}>
          <IconButton onClick={handleOnClick}>
            {liked && <ThumbUpAltIcon fontSize={"large"} />}
            {!liked && <ThumbUpOffAltIcon fontSize={"large"} />}
          </IconButton>
        </Tooltip>
        <Typography variant="h6" sx={{ marginTop: "-10px" }}>
          {likeCount}
        </Typography>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" alignItems="center">
        <Tooltip title={liked ? "Dislike" : "Like"}>
          <IconButton onClick={handleOnClick}>
            {liked && <ThumbUpAltIcon fontSize={"small"} />}
            {!liked && <ThumbUpOffAltIcon fontSize={"small"} />}
          </IconButton>
        </Tooltip>
        <Typography variant="body1">{likeCount}</Typography>
      </Stack>
    );
  }
}

export default LikeButton;
