import React, { useState, useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import ClientContext from "../contexts/client_context";
import CreateComment from "./CreateComment";
import Track from "./Track";
import Comment from "./Comment";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LikeButton from "./LikeButton";
import Typography from "@mui/material/Typography";

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
    padding: "15px",
    textAlign: "left",
    width: document.documentElement.clientWidth / 2.5 + "px",
  }));

  return (
    <Grid
      container
      direction="column"
      spacing={1}
      justifyContent="space-around"
      alignItems="center"
      sx={{ marginTop: "0px", marginBottom: "5px" }}
    >
      <Grid item>
        <Item>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <LikeButton post={post} />
            </Grid>
            <Grid item container direction="column" xs={11} spacing={2}>
              <Grid item>
                <Typography variant="h4">{post.title}</Typography>
              </Grid>
              <Grid item>
                <Track track={post.spotifyTrack} />
              </Grid>
              <Grid item>
                <Typography variant="body1">{post.description}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Item>
      </Grid>
      <Grid item>
        <Item>
          <CreateComment post_id={post_id} />
        </Item>
      </Grid>
      {post.comments && (
        <Grid item>
          <Item>
            {post.comments.map((comment, i) => {
              return (
                <Box key={comment._id}>
                  <Comment comment={comment} />
                  {i < post.comments.length - 1 ? (
                    <Divider sx={{ margin: "5px 0 15px 0" }} />
                  ) : null}
                </Box>
              );
            })}
          </Item>
        </Grid>
      )}
    </Grid>
  );
}

export default Post;
