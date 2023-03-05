import { useState, useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import ClientContext from "../../contexts/client_context";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FollowButton from "../FollowButton";
import PostPreview from "../Post/PostPreview";
import Comment from "../Comment/Comment";

function UserProfilePreview({ user }) {
  const client = useContext(ClientContext);
  const navigate = useNavigate();

  const Item = styled(Paper)(({ theme }) => ({
    position: "relative",
    padding: "15px",
    textAlign: "left",
    borderRadius: "0.75rem",
    width: document.documentElement.clientWidth / 2.5 + "px",
    border: "1px solid #1e1e1e",
    "&:hover": {
      cursor: "pointer",
      borderColor: "white",
    },
  }));

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="center"
      direction="column"
      sx={{ marginTop: "10px", marginBottom: "10px" }}
      onClick={() => navigate(`/user/${user._id}`)}
    >
      <Grid item>
        <Item>
          <Grid
            item
            container
            alignItems="flex-start"
            justifyContent="center"
            spacing={4}
          >
            <Grid item xs={5}>
              <Box justifyContent="flex-end" display="flex">
                <Avatar
                  src={user.avatarUrl}
                  sx={{ height: "150px", width: "150px" }}
                />
              </Box>
            </Grid>
            <Grid item xs={7} container direction="column" spacing={1}>
              <Grid item>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="h5">{user.username}</Typography>
                  {user._id === client.user._id ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate("/user/edit")}
                    >
                      Edit profile
                    </Button>
                  ) : (
                    <>
                      <FollowButton user={user} />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => window.alert("TODO")}
                      >
                        Message
                      </Button>
                    </>
                  )}
                </Stack>
              </Grid>
              <Grid item>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="h7">
                    {user.posts.length} posts
                  </Typography>
                  <Typography variant="h7">
                    {user.followers.length} followers
                  </Typography>
                  <Typography variant="h7">
                    {user.following.length} following
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  Member since{" "}
                  {new Date(user.creationDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">{user.bio}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Item>
      </Grid>
    </Grid>
  );
}

export default UserProfilePreview;
