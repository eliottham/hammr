import { useState, useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import ClientContext from "../../contexts/client_context";
import CreateComment from "../Comment/CreateComment";
import Track from "../Track/Track";
import Comment from "../Comment/Comment";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import LikeButton from "../LikeButton";
import Typography from "@mui/material/Typography";
import Util from "../../util.js";
import UsernameLink from "../User/UsernameLink";
import UserAvatarLink from "../User/UserAvatarLink";
import PostCommentSort from "./PostCommentSort";

const Item = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: "15px",
  textAlign: "left",
  borderRadius: "0.75rem",
  width: document.documentElement.clientWidth / 2.5 + "px",
}));

function Post() {
  const client = useContext(ClientContext);
  const navigate = useNavigate();
  const { post_id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const onGetPost = (responsePost) => {
      setPost(responsePost);
      setComments(responsePost.comments);
    };
    client.on("get-post", onGetPost);
    client.getPost(post_id);

    const onGetComments = (responseComments) => {
      setComments(responseComments);
    };
    // fired by PostCommentSort
    client.on("get-comments", onGetComments);

    const onDeletePost = () => {
      navigate("/");
    };
    client.on("delete-post", onDeletePost);

    return () => {
      client.un("get-post", onGetPost);
      client.un("get-comments", onGetComments);
      client.un("delete-post", onDeletePost);
    };
  }, [client, post_id, navigate]);

  return (
    <Grid
      container
      direction="column"
      spacing={1}
      alignItems="center"
      sx={{ marginTop: "2px", marginBottom: "10px" }}
    >
      <Grid item>
        <Item>
          <Grid container spacing={1} alignItems="center">
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <UserAvatarLink user={post.author} />
            </Grid>
            <Grid item xs={11}>
              <UsernameLink user={post.author} />
              <Typography
                variant="caption"
                alignItems="center"
                color="text.secondary"
              >
                &nbsp;&bull;&nbsp;
                {Util.getTimeFromNow(post.creationDate)}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={11}>
              <Typography variant="h5">{post.title}</Typography>
            </Grid>
            <Grid item xs={1}>
              <LikeButton post={post} />
            </Grid>
            <Grid item xs={11}>
              <Track track={post.spotifyTrack} />
            </Grid>
            {post.description && (
              <>
                <Grid item xs={1} />
                <Grid item xs={11}>
                  <Typography variant="body1">{post.description}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Item>
      </Grid>
      <Grid item>
        <Item>
          <CreateComment post_id={post_id} />
        </Item>
      </Grid>
      {comments?.length ? (
        <Grid item>
          <Item>
            <PostCommentSort post_id={post_id} />
            <Box mb="15px" />
            {comments.map((comment, i) => {
              return (
                <Box key={comment._id}>
                  <Comment comment={comment} />
                  {i < comments.length - 1 ? (
                    <Divider sx={{ margin: "5px 0 15px 30px" }} />
                  ) : null}
                </Box>
              );
            })}
          </Item>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
}

export default Post;
