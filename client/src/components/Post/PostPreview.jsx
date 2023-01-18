import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import ClientContext from "../../contexts/client_context";
import Track from "../Track/Track";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import LikeButton from "../LikeButton";
import Grid from "@mui/material/Grid";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import IconButton from "@mui/material/IconButton";
import UsernameLink from "../User/UsernameLink";
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
      <Grid container spacing={1}>
        <Grid
          item
          xs={1}
          onClick={(e) => e.stopPropagation()}
          sx={{ marginTop: "125px", width: "fit-content" }}
        >
          <LikeButton post={post} />
        </Grid>
        <Grid item container direction="column" xs={10} spacing={2}>
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              Posted by <UsernameLink author={post.author} />{" "}
              {Util.getTimeFromNow(post.timestamp)}
            </Typography>
            <Typography variant="h5">{post.title}</Typography>
          </Grid>
          {post.spotifyTrack && (
            <Grid item sx={{ width: "fit-content" }}>
              <Track track={post.spotifyTrack} />
            </Grid>
          )}
          {post.description && (
            <Grid item>
              <PostPreviewDescription>
                <Typography variant="body1" color="white">
                  {post.description}
                </Typography>
              </PostPreviewDescription>
            </Grid>
          )}
          <Grid item container>
            <IconButton edge="start">
              <ModeCommentOutlinedIcon fontSize="small" />
              <Typography variant="caption">
                &nbsp;{post.comments.length} Comments
              </Typography>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PostPreview;
