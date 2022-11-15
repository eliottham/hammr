import React, { useState, useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import SearchBar from "./SearchBar";
import Grid from "@mui/material/Grid";
import Track from "./Track";
import List from "@mui/material/List";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import ClientContext from "../contexts/client_context";

function CreatePost() {
  const client = useContext(ClientContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [spotifyTrack, setSpotifyTrack] = useState();
  const [description, setDescription] = useState("");
  const [lastQuery, setLastQuery] = useState("");

  useEffect(() => {
    const onCreatePost = ({ post }) => {
      navigate("/post/" + post._id);
    };
    client.on("create-post", onCreatePost);

    return () => {
      client.un("create-post", onCreatePost);
    };
  }, [client, navigate]);

  function handleTrackOnClick(t) {
    setSpotifyTrack(t);
    setLastQuery(t.name);
  }

  return (
    <React.Fragment>
      <h2 style={{ width: "50%", margin: "30px auto 0px auto" }}>
        Create Post
      </h2>
      <Paper
        sx={{
          position: "relative",
          width: "50%",
          margin: "10px auto 0px auto",
          height: "550px",
          padding: "30px",
        }}
      >
        <Grid alignItems="stretch" container spacing={2} direction="column">
          <Grid item>
            <TextField
              fullWidth
              size="small"
              label="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </Grid>
          {!spotifyTrack && (
            <Grid item>
              <SearchBar
                label="Track"
                placeholder="Search Track"
                customHandleTrackOnClick={handleTrackOnClick}
                initialQuery={lastQuery}
              />
            </Grid>
          )}
          {spotifyTrack && (
            <Grid item sx={{ marginTop: "-30px" }}>
              <InputLabel
                shrink
                size="small"
                sx={{ margin: "22px 0px -20px 14px" }}
              >
                Track
              </InputLabel>
              <List sx={{ margin: "5px 0 -10px 0" }}>
                <Track
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
            </Grid>
          )}
          <Grid item>
            <TextField
              fullWidth
              label="Description"
              placeholder="Text (optional)"
              multiline
              rows={10}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() =>
                client.createPost({ title, spotifyTrack, description })
              }
              disabled={!title}
            >
              Post
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default CreatePost;
