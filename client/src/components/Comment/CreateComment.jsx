import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TrackListItem from "../Track/TrackListItem";
import TrackSearchBar from "../Track/TrackSearchBar";

import ClientContext from "../../contexts/client_context";

function CreateComment({ post_id }) {
  const client = useContext(ClientContext);

  const [spotifyTrack, setSpotifyTrack] = useState();
  const [lastQuery, setLastQuery] = useState("");
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState(client.user.username);

  useEffect(() => {
    const onCreateComment = () => {
      setSpotifyTrack();
      setLastQuery();
      setComment("");
    };
    client.on("create-comment", onCreateComment);

    return () => {
      client.un("create-comment", onCreateComment);
    };
  }, []);

  function handleTrackOnClick(t) {
    setSpotifyTrack(t);
    setLastQuery(t.name);
  }

  return (
    <>
      {username && (
        <Typography variant="caption">Comment as {username}</Typography>
      )}
      <Grid alignItems="stretch" container spacing={1} direction="column">
        <Grid item>
          {!spotifyTrack && (
            <TrackSearchBar
              label="Track"
              placeholder="Search Track"
              customHandleTrackOnClick={handleTrackOnClick}
              initialQuery={lastQuery}
            />
          )}
          {spotifyTrack && (
            <>
              <InputLabel
                shrink
                size="small"
                sx={{ margin: "0px 0px -9px 14px" }}
              >
                Track
              </InputLabel>
              <List disablePadding>
                <TrackListItem
                  track={spotifyTrack}
                  style={{
                    border: "1px solid rgb(82, 82, 82)",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "rgba(82, 82, 82, 0.5)",
                      borderColor: "white",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => setSpotifyTrack()}
                />
              </List>
            </>
          )}
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Comment"
            placeholder="What are your thoughts?"
            multiline
            rows={2}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() =>
              client.createComment({ spotifyTrack, comment, post_id })
            }
            disabled={!comment && !spotifyTrack}
          >
            Comment
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default CreateComment;
