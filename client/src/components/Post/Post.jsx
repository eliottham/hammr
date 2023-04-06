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
import Tooltip from "@mui/material/Tooltip";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";

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
  const [edit, setEdit] = useState(false);
  const [editedPostDesc, setEditedPostDesc] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("top");

  useEffect(() => {
    const onGetPost = (responsePost) => {
      setPost(responsePost);
      setEditedPostDesc(responsePost.description);
      setEdit(false);
      client.getComments({
        post_id,
        sortBy: sort,
        page: page,
      });
    };
    client.on("get-post", onGetPost);
    client.getPost(post_id);

    const onGetComments = (response) => {
      setComments(response.docs);
      setTotalPages(response.totalPages);
    };
    client.on("get-comments", onGetComments);

    const onDeletePost = () => {
      navigate("/");
    };
    client.on("delete-post", onDeletePost);

    const onCreateComment = (response) => {
      if (response.post === post_id) {
        setSort("newest");
        setPage(1);
        client.getComments({
          post_id,
          sortBy: "newest",
          page: 1,
        });
      }
    };

    client.on("create-comment", onCreateComment);

    return () => {
      client.un("get-post", onGetPost);
      client.un("get-comments", onGetComments);
      client.un("delete-post", onDeletePost);
      client.un("create-comment", onCreateComment);
    };
  }, [client, post_id, navigate]);

  function handleSortChange(e) {
    setSort(e.target.value);
    client.getComments({ post_id, sortBy: e.target.value, page: 1 });
  }

  function handlePageChange(event, value) {
    setPage(value);
    client.getComments({
      post_id,
      sortBy: sort,
      page: value,
    });
  }

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
            <Grid item xs={10}>
              <Track track={post.spotifyTrack} />
            </Grid>
            <Grid item xs={1} />
            {edit ? (
              <>
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    onChange={(e) => setEditedPostDesc(e.target.value)}
                    value={editedPostDesc}
                  />
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={11}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ marginRight: "8px" }}
                    onClick={() =>
                      client.editPost({
                        post_id,
                        description: editedPostDesc,
                      })
                    }
                    disabled={post.description === editedPostDesc}
                  >
                    Save Edit
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setEdit(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </>
            ) : (
              post.description && (
                <>
                  <Grid item xs={1} />
                  <Grid item xs={10}>
                    <Typography variant="body1">{post.description}</Typography>
                  </Grid>
                  <Grid item xs={1} />
                </>
              )
            )}
            {client.user?._id === post.author?._id && (
              <>
                <Grid item xs={1} />
                <Grid item xs={11}>
                  <Tooltip title="Edit Comment">
                    <IconButton onClick={() => setEdit(!edit)} edge="start">
                      <EditOutlinedIcon fontSize="small" />
                      <Typography variant="button">&nbsp;Edit</Typography>
                    </IconButton>
                  </Tooltip>
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
        <>
          <Grid item>
            <Item>
              <PostCommentSort
                post_id={post_id}
                sort={sort}
                handleSortChange={handleSortChange}
              />
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
          <Box
            alignItems="center"
            mt="10px"
            justifyContent="center"
            display="flex"
          >
            <Pagination
              page={page}
              count={totalPages}
              shape="rounded"
              onChange={handlePageChange}
            />
          </Box>
        </>
      ) : (
        <></>
      )}
    </Grid>
  );
}

export default Post;
