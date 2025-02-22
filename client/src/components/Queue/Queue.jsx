import React, { useState, useContext, useEffect } from "react";
import ClientContext from "../../contexts/client_context";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import QueueTrack from "./QueueTrack";
import List from "@mui/material/List";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";

function Queue() {
  const client = useContext(ClientContext);
  const [tracks, setTracks] = useState([]);
  const [currentPageTracks, setCurrentPageTracks] = useState([]);

  useEffect(() => {
    const onSpotifyPlayerStateChanged = ({
      paused,
      current_track,
      position,
      duration,
    }) => {
      const nextIndex = client.queueTrackIndex + 1;
      if (position === duration && nextIndex < tracks.length) {
        client.spotifyPlayTrack(tracks[nextIndex], nextIndex);
      }
    };
    client.on("spotify-player-state-changed", onSpotifyPlayerStateChanged);

    const onAddToQueue = (t) => {
      setTracks(tracks.concat(t));
    };
    client.on("add-to-queue", onAddToQueue);

    const onRemoveFromQueue = (index) => {
      // can't splice array since this mutates the state directly
      setTracks(tracks.filter((t, i) => i !== index));
    };
    client.on("remove-from-queue", onRemoveFromQueue);

    const onPreviousButtonClick = () => {
      const previousIndex = client.queueTrackIndex - 1;
      if (previousIndex >= 0 && previousIndex < tracks.length) {
        client.spotifyPlayTrack(tracks[previousIndex], previousIndex);
      }
    };
    client.on("previous-button-click", onPreviousButtonClick);

    const onNextButtonClick = () => {
      const nextIndex = client.queueTrackIndex + 1;
      if (nextIndex < tracks.length) {
        client.spotifyPlayTrack(tracks[nextIndex], nextIndex);
      }
    };
    client.on("next-button-click", onNextButtonClick);

    return () => {
      client.un("spotify-player-state-changed", onSpotifyPlayerStateChanged);
      client.un("add-to-queue", onAddToQueue);
      client.un("remove-from-queue", onRemoveFromQueue);
      client.un("previous-button-click", onPreviousButtonClick);
      client.un("next-button-click", onNextButtonClick);
    };
  }, [tracks]);

  useEffect(() => {
    // fired when Feed / UserProfile renders
    const onGetPosts = (response) => {
      setCurrentPageTracks(response.docs.map((post) => post.spotifyTrack));
    };
    client.on("get-posts", onGetPosts);

    // fired when Post renders
    const onGetPost = (post) => {
      setCurrentPageTracks(
        [post.spotifyTrack].concat(
          post.comments
            ?.filter((comment) => !!comment.spotifyTrack)
            .map((comment) => comment.spotifyTrack)
        )
      );
    };
    client.on("get-post", onGetPost);

    // fired when UserProfile renders and when comments are sorted on a Post
    const onGetComments = (response) => {
      if (response.fromPost) {
        // if get-comments was fired from getting a post, add the post track as the first track
        setCurrentPageTracks(
          [currentPageTracks[0]].concat(
            response.docs
              ?.filter((comment) => !!comment.spotifyTrack)
              .map((comment) => comment.spotifyTrack)
          )
        );
      } else {
        setCurrentPageTracks(
          response.docs
            ?.filter((comment) => !!comment.spotifyTrack)
            .map((comment) => comment.spotifyTrack)
        );
      }
    };
    client.on("get-comments", onGetComments);

    // fired from switching between user profile's posts and comments
    const onUpdateQueueTracks = (tracks) => {
      setCurrentPageTracks(tracks);
    };
    client.on("update-queue-tracks", onUpdateQueueTracks);

    return () => {
      client.un("get-post", onGetPost);
      client.un("get-posts", onGetPosts);
      client.un("get-comments", onGetComments);
      client.un("update-queue-tracks", onUpdateQueueTracks);
    };
  }, [currentPageTracks]);

  function handleAddAllClick() {
    setTracks(tracks.concat(currentPageTracks));
  }

  function handleRemoveAllClick() {
    setTracks([]);
  }

  function handlePlayQueueClick() {
    if (tracks.length > 0) {
      client.spotifyPlayTrack(tracks[0], 0);
    }
  }

  return (
    <Box
      sx={{
        width: "350px",
        position: "fixed",
        backgroundColor: "neutral.main",
        marginTop: "60px",
        height: "calc(100vh - 140px)",
        borderRight: "1px solid #282828",
      }}
    >
      <Box textAlign="center">
        <Box
          borderBottom="1px solid"
          borderColor="#282828"
          display="flex"
          padding="5px"
          alignItems="center"
          justifyContent="center"
          height="50px"
        >
          <Box flex="1" />
          <Box flex="1" display="flex" justifyContent="center">
            <QueueMusicIcon />
            &nbsp;<Typography variant="subtitle2">Queue</Typography>
          </Box>
          <Box flex="1" display="flex" justifyContent="flex-end">
            <Tooltip title="Add current page tracks">
              <IconButton onClick={handleAddAllClick}>
                <PlaylistAddCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove all">
              <IconButton onClick={handleRemoveAllClick}>
                <HighlightOffIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box pr="13px">
              <Tooltip title="Play queue">
                <IconButton onClick={handlePlayQueueClick}>
                  <PlayCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        {tracks.length ? (
          <Box
            sx={{
              height: "calc(100vh - 140px - 50px)",
              overflowY: "auto",
            }}
          >
            <List disablePadding>
              {tracks.map((track, i) => {
                return (
                  <QueueTrack key={track.id + i} track={track} queueIndex={i} />
                );
              })}
            </List>
          </Box>
        ) : (
          <Typography variant="subtitle1">No tracks in queue</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Queue;
