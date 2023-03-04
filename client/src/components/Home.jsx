import React, { useState, useContext, useEffect } from "react";
import ClientContext from "../contexts/client_context";
import PostPreview from "./Post/PostPreview";
import Box from "@mui/material/Box";
import { POST_CATEGORY, POST_COMMENT_DATE_RANGE } from "../constants.js";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import PublicIcon from "@mui/icons-material/Public";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Button from "@mui/material/Button";
import ThumbUp from "@mui/icons-material/ThumbUp";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Feed from "./Feed";
import SearchResults from "./SearchResults";

function Home() {
  const client = useContext(ClientContext);
  const [showFeed, setShowFeed] = useState(true);

  useEffect(() => {
    const onSearch = (results) => {
      setShowFeed(!!results.noSearch);
    };
    client.on("search", onSearch);

    return () => {
      client.un("search", onSearch);
    };
  }, []);

  return showFeed ? <Feed /> : <SearchResults />;
}

export default Home;
