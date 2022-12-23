import React, { useState, useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ClientContext from "../contexts/client_context";

function LikeButton({ post, comment, size = "small" }) {
  const client = useContext(ClientContext);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (post && post.liked_users) {
      setLiked(post.liked_users.includes(localStorage.getItem("user_id")));
    } else if (comment && comment.liked_users) {
      setLiked(comment.liked_users.includes(localStorage.getItem("user_id")));
    }
  }, []);

  function handleOnClick() {
    if (liked) {
      client.dislike({ post, comment });
      setLiked(false);
    } else {
      client.like({ post, comment });
      setLiked(true);
    }
  }

  return (
    <IconButton onClick={handleOnClick}>
      {liked && <ThumbUpAltIcon fontSize={size} />}
      {!liked && <ThumbUpOffAltIcon fontSize={size} />}
    </IconButton>
  );
}

export default LikeButton;
