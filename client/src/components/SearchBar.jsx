import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

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
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`/search/${query}`);
          }
        }}
        autoComplete="off"
      />
    </Stack>
  );
}

export default SearchBar;
