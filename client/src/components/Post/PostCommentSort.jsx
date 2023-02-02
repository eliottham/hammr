import React, { useState, useContext, useEffect } from "react";
import ClientContext from "../../contexts/client_context";
import Box from "@mui/material/Box";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import ThumbUp from "@mui/icons-material/ThumbUp";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";

function PostCommentSort({ post_id }) {
  const client = useContext(ClientContext);
  const [sort, setSort] = useState("top");

  function handleSortChange(e) {
    setSort(e.target.value);
    client.getComments({ post_id, sortBy: e.target.value });
  }

  return (
    <TextField
      select
      size="small"
      variant="standard"
      label="Sort"
      fullWidth
      value={sort}
      onChange={handleSortChange}
    >
      <MenuItem value={"top"}>
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <ThumbUp fontSize="small" />
          &emsp;Top
        </Box>
      </MenuItem>
      <MenuItem value={"newest"}>
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <NewReleasesIcon fontSize="small" />
          &emsp;New
        </Box>
      </MenuItem>
      <MenuItem value={"bottom"}>
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <ThumbDownIcon fontSize="small" />
          &emsp;Bottom
        </Box>
      </MenuItem>
      <MenuItem value={"oldest"}>
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <ElderlyWomanIcon fontSize="small" />
          &emsp;Old
        </Box>
      </MenuItem>
    </TextField>
  );
}

export default PostCommentSort;
