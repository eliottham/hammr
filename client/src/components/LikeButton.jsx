import React, { useState, useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ClientContext from "../contexts/client_context";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

function LikeButton({ post, comment }) {
  const client = useContext(ClientContext);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (post && post.likedUsers) {
      setLiked(post.likedUsers.includes(client.user._id));
      setLikeCount(post.likedUsers.length);
    } else if (comment && comment.likedUsers) {
      setLiked(comment.likedUsers.includes(client.user._id));
      setLikeCount(comment.likedUsers.length);
    }
  }, [post, comment]);

  async function handleOnClick(e) {
    e.stopPropagation();
    if (liked) {
      const resultStatus = await client.dislike({ post, comment });
      if (resultStatus === 200) {
        setLiked(false);
        setLikeCount(likeCount - 1);
      }
    } else {
      const resultStatus = await client.like({ post, comment });
      if (resultStatus === 200) {
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    }
  }

  if (post) {
    return (
      <Stack direction="column" alignItems="center">
        <Tooltip title={liked ? "Dislike" : "Like"}>
          <IconButton onClick={handleOnClick}>
            {liked && <ThumbUpAltIcon fontSize={"large"} color="primary" />}
            {!liked && <ThumbUpOffAltIcon fontSize={"large"} />}
          </IconButton>
        </Tooltip>
        <Typography
          variant="h6"
          sx={{ marginTop: "-10px" }}
          color={liked ? "primary" : "white"}
        >
          {likeCount}
        </Typography>
      </Stack>
    );
  } else if (comment) {
    return (
      <Stack direction="row" alignItems="center">
        <Tooltip title={liked ? "Dislike" : "Like"}>
          <IconButton onClick={handleOnClick} edge="start">
            {liked && <ThumbUpAltIcon fontSize={"small"} color="primary" />}
            {!liked && <ThumbUpOffAltIcon fontSize={"small"} />}
            <Typography variant="button" color={liked ? "primary" : "white"}>
              &nbsp;{likeCount}
            </Typography>
          </IconButton>
        </Tooltip>
      </Stack>
    );
  }
}

export default LikeButton;
