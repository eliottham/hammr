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
import ListIcon from "@mui/icons-material/List";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";

const POST_SORT_FILTER = {
  CATEGORY: "post_sort_filter_category",
  NEWEST: "post_sort_filter_newest",
  TOP: "post_sort_filter_top",
  POSTED: "post_sort_filter_posted",
};

const Item = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: "15px",
  borderRadius: "0.75rem",
}));

const initialNewest = localStorage.getItem(POST_SORT_FILTER.NEWEST);
const initialTop = localStorage.getItem(POST_SORT_FILTER.TOP);

function Feed() {
  const client = useContext(ClientContext);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(
    client.user?._id
      ? localStorage.getItem(POST_SORT_FILTER.CATEGORY) || POST_CATEGORY.ALL
      : POST_CATEGORY.ALL
  );
  const [newest, setNewest] = useState(
    initialNewest ? initialNewest === "true" : true
  );
  const [top, setTop] = useState(initialTop ? initialTop === "true" : false);
  const [posted, setPosted] = useState(
    localStorage.getItem(POST_SORT_FILTER.POSTED) ||
      POST_COMMENT_DATE_RANGE.TODAY
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function filterChange(params) {
    setPage(1);
    params.page = 1;
    client.getPosts(params);
  }

  function handleCategoryChange(e) {
    localStorage.setItem(POST_SORT_FILTER.CATEGORY, e.target.value);
    setCategory(e.target.value);
    filterChange({ category: e.target.value, newest, top, posted });
  }

  function handleNewestClick() {
    localStorage.setItem(POST_SORT_FILTER.NEWEST, true);
    setNewest(true);
    localStorage.setItem(POST_SORT_FILTER.TOP, false);
    setTop(false);
    filterChange({ category, newest: true, top: false, posted });
  }

  function handleTopClick() {
    localStorage.setItem(POST_SORT_FILTER.TOP, true);
    setTop(true);
    localStorage.setItem(POST_SORT_FILTER.NEWEST, false);
    setNewest(false);
    filterChange({ category, newest: false, top: true, posted });
  }

  function handlePostedChange(e) {
    localStorage.setItem(POST_SORT_FILTER.POSTED, e.target.value);
    setPosted(e.target.value);
    filterChange({ category, newest, top, posted: e.target.value });
  }

  function handlePageChange(event, value) {
    setPage(value);
    client.getPosts({
      category,
      newest,
      top,
      posted,
      page: value,
    });
  }

  useEffect(() => {
    const onGetPosts = (response) => {
      setPosts(response.docs);
      setTotalPages(response.totalPages);
    };
    client.on("get-posts", onGetPosts);

    client.getPosts({ category, newest, top, posted, page });

    return () => {
      client.un("get-posts", onGetPosts);
    };
  }, []);

  return (
    <Box sx={{ margin: "10px auto 10px auto", width: "40%" }}>
      <Item>
        <Box display="flex" alignItems="center">
          <Box display="flex" gap={1} flex="1">
            <TextField
              select
              size="small"
              label="Category"
              value={category}
              onChange={handleCategoryChange}
            >
              <MenuItem value={POST_CATEGORY.ALL}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <PublicIcon />
                  &emsp;
                  {POST_CATEGORY.ALL}
                </Box>
              </MenuItem>
              <MenuItem value={POST_CATEGORY.FOLLOWING}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <PeopleAltIcon />
                  &emsp;
                  {POST_CATEGORY.FOLLOWING}
                </Box>
              </MenuItem>
            </TextField>
            <Button
              size="small"
              startIcon={<NewReleasesIcon />}
              variant={newest ? "contained" : "outlined"}
              onClick={handleNewestClick}
            >
              New
            </Button>
            <Button
              size="small"
              startIcon={<ThumbUp />}
              variant={top ? "contained" : "outlined"}
              onClick={handleTopClick}
            >
              Top
            </Button>
            {top && (
              <TextField
                select
                size="small"
                label="Posted"
                value={posted}
                onChange={handlePostedChange}
              >
                {Object.entries(POST_COMMENT_DATE_RANGE).map((entry) => {
                  return (
                    <MenuItem key={entry[0]} value={entry[1]}>
                      {entry[1]}
                    </MenuItem>
                  );
                })}
              </TextField>
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            flex="1"
            alignItems="center"
          >
            <ListIcon fontSize="large" />
            &nbsp;
            <Typography fontWeight={500} variant="h6">
              Feed
            </Typography>
          </Box>
        </Box>
      </Item>
      {posts.map((post) => (
        <Box sx={{ marginTop: "10px" }} key={post._id}>
          <PostPreview post={post} />
        </Box>
      ))}
      <Box alignItems="center" mt="10px" justifyContent="center" display="flex">
        <Pagination
          page={page}
          count={totalPages}
          shape="rounded"
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}

export default Feed;
