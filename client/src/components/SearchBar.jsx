import React, { useCallback, useState, useContext } from "react";
import { TextField, Divider, List } from "@mui/material";
import _debounce from "lodash/debounce";
import ClientContext from "../contexts/client_context";
import TrackListItem from "./Track/TrackListItem";
import Stack from "@mui/material/Stack";

function SearchBar() {
  const client = useContext(ClientContext);

  const [query, setQuery] = useState("");

  const debounceSearch = useCallback(_debounce(search, 500), []);

  function search(q) {
    client.search(q);
  }

  function handleOnChange(e) {
    setQuery(e.target.value);
    debounceSearch(e.target.value);
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
        label={"Search"}
        value={query}
        onChange={(e) => handleOnChange(e)}
        autoComplete="off"
      />
    </Stack>
  );
}

export default SearchBar;
