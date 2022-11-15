import React, { useCallback, useState, useContext } from "react";
import { TextField, Divider, List } from "@mui/material";
import _debounce from "lodash/debounce";
import ClientContext from "../contexts/client_context";
import Track from "./Track";
import Stack from "@mui/material/Stack";

function SearchBar({
  customHandleTrackOnClick,
  label,
  placeholder,
  initialQuery,
}) {
  const client = useContext(ClientContext);

  const [query, setQuery] = useState(initialQuery || "");
  const [tracks, setTracks] = useState([]);
  const [cachedTracks, setCachedTracks] = useState([]);
  const [mouseOverTrack, setMouseOverTrack] = useState(false);

  const debounceSearch = useCallback(_debounce(search, 300), []);

  // useState(() => {
  // const onSpotifySearch = ({ tracks }) => {
  // 	setTracks(tracks.slice(0, Math.min(tracks.length, 5)));
  // 	setCachedTracks(tracks.slice(0, Math.min(tracks.length, 5)));
  // };
  // client.on('spotify-search', onSpotifySearch);

  // return () => {
  // 	client.un('spotify-search');
  // };
  // }, []);

  async function search(q) {
    if (q) {
      const tracks = await client.spotifySearch(q);
      setTracks(tracks.slice(0, Math.min(tracks.length, 5)));
      setCachedTracks(tracks.slice(0, Math.min(tracks.length, 5)));
    } else {
      setTracks([]);
      setCachedTracks([]);
    }
  }

  function handleOnChange(e) {
    setQuery(e.target.value);
    debounceSearch(e.target.value);
  }

  function handleOnFocus(e) {
    if (e.target.value === query) {
      setTracks(cachedTracks);
    } else {
      search(e.target.value);
    }
  }

  function handleMouseOver(flag) {
    setMouseOverTrack(flag);
  }

  function handleOnBlur(e) {
    if (!mouseOverTrack) {
      setTracks([]);
    }
  }

  function handleTrackOnClick(track) {
    if (customHandleTrackOnClick) {
      customHandleTrackOnClick(track);
    } else {
      client.spotifyPlayTrack(track, client.spotifyDeviceId);
    }
    setQuery(track.name);
    setTracks([]);
  }

  return (
    <Stack
      justifyContent="flex-start"
      alignItems="center"
      spacing={0}
      sx={{ position: "relative" }}
    >
      <TextField
        sx={{
          width: "100%",
        }}
        size="small"
        label={label || "Search"}
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleOnChange(e)}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        autoComplete="off"
        autoFocus={!!initialQuery}
      />
      <List sx={{ width: "100%", position: "absolute", marginTop: "35px" }}>
        {tracks.map((track, i) => {
          return (
            <React.Fragment key={track.id}>
              <Track
                track={track}
                mouseOver={handleMouseOver}
                onClick={handleTrackOnClick}
              />
              {i < tracks.length - 1 ? <Divider key={track.id} /> : null}
            </React.Fragment>
          );
        })}
      </List>
    </Stack>
  );
}

export default SearchBar;
