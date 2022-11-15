import React, { useState, useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import ClientContext from "../contexts/client_context";
import Track from "./Track";
import CreateComment from "./CreateComment";
import List from "@mui/material/List";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import IconButton from "@mui/material/IconButton";

function Post() {
  const client = useContext(ClientContext);
  const { id } = useParams();

  const [post, setPost] = useState({});
  const [postTrackPlaying, setPostTrackPlaying] = useState(false);
  const [playPostTrackFromStart, setPlayPostTrackFromStart] = useState(true);

  useEffect(() => {
    const onGetPost = (response) => {
      setPost(response.post);
    };
    client.on("get-post", onGetPost);
    client.getPost(id);

    return () => {
      client.un("get-post", onGetPost);
    };
  }, [client, id]);

  useEffect(() => {
    const onSpotifyPlayerStateChanged = ({
      paused,
      current_track,
      position,
      duration,
    }) => {
      if (post.spotifyTrack.id === current_track.id) {
        setPostTrackPlaying(!paused);
        setPlayPostTrackFromStart(false);
        if (position === duration) {
          setPlayPostTrackFromStart(true);
          setPostTrackPlaying(false);
        }
      } else {
        setPlayPostTrackFromStart(true);
        setPostTrackPlaying(false);
      }
    };
    client.on("spotify-player-state-changed", onSpotifyPlayerStateChanged);
    return () => {
      client.un("spotify-player-state-changed", onSpotifyPlayerStateChanged);
    };
  }, [client, post]);

  function handlePlayTrackClick() {
    if (playPostTrackFromStart) {
      client.spotifyPlayTrack(post.spotifyTrack, client.spotifyDeviceId);
    } else if (postTrackPlaying) {
      client.spotifyPlayer.pause();
    } else {
      client.spotifyPlayer.resume();
    }
  }

  const Item = styled(Paper)(({ theme }) => ({
    position: "relative",
    margin: "10px auto 0px auto !important",
    padding: "20px",
    textAlign: "left",
    width: "50%",
  }));

  return (
    <React.Fragment>
      <Stack spacing={1}>
        <Item>
          <h2>{post.title}</h2>
          <Stack
            direction="row"
            spacing={0}
            sx={{
              backgroundColor: "rgba(82, 82, 82, 0.5)",
              borderRadius: "10px",
              marginBottom: "25px",
            }}
          >
            <IconButton onClick={handlePlayTrackClick} size="large">
              {postTrackPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <List>
              <Track track={post.spotifyTrack} style={{}} />
            </List>
          </Stack>
          <p>{post.description}</p>
        </Item>
        <Item>
          <CreateComment />
        </Item>
      </Stack>
    </React.Fragment>
  );
}

export default Post;
