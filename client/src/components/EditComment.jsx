import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TrackListItem from "./TrackListItem";
import SearchBar from "./SearchBar";

import ClientContext from "../contexts/client_context";

function EditComment({ originalComment, cancelEditFunction }) {
  const client = useContext(ClientContext);

  const [spotifyTrack, setSpotifyTrack] = useState();
  const [lastQuery, setLastQuery] = useState(
    originalComment.spotifyTrack?.name || ""
  );
  const [comment, setComment] = useState("");

  useEffect(() => {
    setSpotifyTrack(originalComment.spotifyTrack);
    setComment(originalComment.comment);
  }, []);

  function handleTrackOnClick(t) {
    setSpotifyTrack(t);
    setLastQuery(t.name);
  }

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        {!spotifyTrack && (
          <SearchBar
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
          size="small"
          sx={{ marginRight: "8px" }}
          onClick={() =>
            client.editComment({
              originalComment,
              spotifyTrack,
              comment,
            })
          }
          disabled={!comment && !spotifyTrack}
        >
          Save Edit
        </Button>
        <Button variant="contained" size="small" onClick={cancelEditFunction}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}

export default EditComment;
