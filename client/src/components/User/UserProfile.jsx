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
import UsernameLink from "./UsernameLink";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FollowButton from "../FollowButton";

function UserProfile() {
  const client = useContext(ClientContext);
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [user, setUser] = useState();

  useEffect(() => {
    const onGetUser = (responseUser) => {
      if (responseUser._id === user_id) {
        setUser(responseUser);
      }
    };
    client.on("get-user", onGetUser);
    client.getUser(user_id);

    return () => {
      client.un("get-user", onGetUser);
    };
  }, [user_id]);

  const Item = styled(Paper)(({ theme }) => ({
    position: "relative",
    padding: "15px",
    textAlign: "left",
    borderRadius: "0.75rem",
    width: document.documentElement.clientWidth / 2.5 + "px",
  }));

  return user ? (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="center"
      direction="column"
      sx={{ marginTop: "10px", marginBottom: "10px" }}
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
                  src={user.avatar}
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
                  Member since {new Date(user.timestamp).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">{user.bio}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Item>
      </Grid>
      <Grid item>
        <Item></Item>
      </Grid>
    </Grid>
  ) : null;
}

export default UserProfile;
