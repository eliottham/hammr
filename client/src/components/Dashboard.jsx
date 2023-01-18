import React, { useCallback, useState, useContext, useEffect } from "react";
import ClientContext from "../contexts/client_context";
import PostPreview from "./Post/PostPreview";
import Box from "@mui/material/Box";

function Dashboard() {
  const client = useContext(ClientContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const onGetPosts = (responsePosts) => {
      setPosts(responsePosts);
    };
    client.on("get-posts", onGetPosts);

    client.getPosts();

    return () => {
      client.un("get-posts", onGetPosts);
    };
  }, []);

  return (
    <Box sx={{ margin: "10px auto 0px auto", width: "40%" }}>
      {posts.map((post) => (
        <Box sx={{ marginBottom: "10px" }} key={post._id}>
          <PostPreview post={post} />
        </Box>
      ))}
    </Box>
  );
}

export default Dashboard;
