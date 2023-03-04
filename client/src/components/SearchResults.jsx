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
import ArticleIcon from "@mui/icons-material/Article";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";

const Item = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: "15px",
  borderRadius: "0.75rem",
}));

function SearchResults() {
  const client = useContext(ClientContext);
  const [viewPosts, setViewPosts] = useState(true);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const onSearch = (results) => {
      setUsers(results.users);
      setPosts(results.posts);
    };
    client.on("search", onSearch);

    return () => {
      client.un("search", onSearch);
    };
  }, []);

  return (
    <Box sx={{ margin: "10px auto 10px auto", width: "40%" }}>
      <Item>
        <Box display="flex" alignItems="center">
          <Box display="flex" gap={1} flex="1">
            <Button
              size="small"
              startIcon={<ArticleIcon />}
              variant={viewPosts ? "contained" : "outlined"}
              onClick={() => setViewPosts(true)}
            >
              Posts
            </Button>
            <Button
              size="small"
              startIcon={<AccountBoxIcon />}
              variant={!viewPosts ? "contained" : "outlined"}
              onClick={() => setViewPosts(false)}
            >
              Users
            </Button>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            flex="1"
            alignItems="center"
          >
            <SearchIcon />
            &nbsp;
            <Typography fontWeight={500} variant="h7">
              Search
            </Typography>
          </Box>
        </Box>
      </Item>
      {viewPosts ? (
        posts.length ? (
          posts.map((post) => (
            <Box sx={{ marginTop: "10px" }} key={post._id}>
              <PostPreview post={post} />
            </Box>
          ))
        ) : (
          <Item sx={{ marginTop: "10px", textAlign: "center" }}>
            No posts found
          </Item>
        )
      ) : users.length ? (
        users.map((user) => (
          <Box sx={{ marginTop: "10px" }} key={user._id}>
            {user.username}
          </Box>
        ))
      ) : (
        <Item sx={{ marginTop: "10px", textAlign: "center" }}>
          No users found
        </Item>
      )}
    </Box>
  );
}

export default SearchResults;
