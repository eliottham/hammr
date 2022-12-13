import React, { useState, useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import ClientContext from "../contexts/client_context";
import CreateComment from "./CreateComment";
import PostCommentTrack from "./PostCommentTrack";
import Comment from "./Comment";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

function Post() {
  const client = useContext(ClientContext);
  const navigate = useNavigate();
  const { post_id } = useParams();

  const [post, setPost] = useState({});

  useEffect(() => {
    const onGetPost = (responsePost) => {
      setPost(responsePost);
    };
    client.on("get-post", onGetPost);
    client.getPost(post_id);

    const onDeletePost = () => {
      navigate("/");
    };
    client.on("delete-post", onDeletePost);

    return () => {
      client.un("get-post", onGetPost);
      client.un("delete-post", onDeletePost);
    };
  }, [post_id]);

  const Item = styled(Paper)(({ theme }) => ({
    position: "relative",
    margin: "5px auto 5px auto !important",
    padding: "10px 20px 10px 20px",
    textAlign: "left",
    width: "50%",
  }));

  return (
    <Box sx={{ margin: "5px 0 5px 0" }}>
      <Stack spacing={1}>
        <Item>
          <h2>{post.title}</h2>
          <PostCommentTrack track={post.spotifyTrack} />
          <p>{post.description}</p>
          {localStorage.getItem("user_id") === post.author && (
            <Stack direction="row">
              <Tooltip title="Delete Post">
                <IconButton onClick={() => client.deletePost(post_id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Item>
        <Item>
          <CreateComment post_id={post_id} />
        </Item>
        {post.comments && (
          <Item>
            {post.comments.map((comment, i) => {
              let sx = { margin: "5px 0 5px 0" };
              if (i === 0) {
                sx = { margin: "0 0 5px 0" };
              } else if (i === post.comments.length - 1) {
                sx = { margin: "5px 0 0 0" };
              }
              return (
                <Box key={comment._id} sx={sx}>
                  <Comment {...comment} />
                  {i < post.comments.length - 1 ? <Divider /> : null}
                </Box>
              );
            })}
          </Item>
        )}
      </Stack>
    </Box>
  );
}

export default Post;
