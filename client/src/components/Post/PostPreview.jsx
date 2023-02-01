import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Track from "../Track/Track";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import LikeButton from "../LikeButton";
import Grid from "@mui/material/Grid";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import IconButton from "@mui/material/IconButton";
import UsernameLink from "../User/UsernameLink";
import UserAvatarLink from "../User/UserAvatarLink";
import Util from "../../util.js";

const PostPreviewDescription = styled("div")({
  position: "relative",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  display: "-webkit-box",
  maxHeight: "100px",
  WebkitBoxOrient: "vertical",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    height: "100%",
    width: "100%",
    background:
      "linear-gradient(rgba(30, 30, 30, 0) 30px, rgba(30, 30, 30, 1))",
  },
});

function PostPreview({ post }) {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        borderRadius: "0.75rem",
        padding: "15px",
        border: "1px solid #1e1e1e",
        "&:hover": {
          cursor: "pointer",
          borderColor: "white",
        },
      }}
      onClick={() => navigate(`/post/${post._id}`)}
    >
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
              <PostPreviewDescription>
                <Typography variant="body1" color="white">
                  {post.description}
                </Typography>
              </PostPreviewDescription>
            </Grid>
          </>
        )}
        <Grid item xs={1} />
        <Grid item xs={11}>
          <IconButton edge="start">
            <ModeCommentOutlinedIcon fontSize="small" />
            <Typography variant="caption">
              &nbsp;{post.comments.length} Comments
            </Typography>
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PostPreview;
