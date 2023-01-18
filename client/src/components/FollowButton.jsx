import React, { useState, useContext, useEffect } from "react";
import ClientContext from "../contexts/client_context";
import Button from "@mui/material/Button";

// TODO: add genres / tags for users to follow (currently can only follow other users)
function FollowButton({ user }) {
  const client = useContext(ClientContext);

  const [following, setFollowing] = useState(
    user.followers.includes(client.user._id)
  );

  useEffect(() => {
    const onGetUser = (responseUser) => {
      if (responseUser._id === user._id) {
        setFollowing(responseUser.followers.includes(client.user._id));
      }
    };
    client.on("get-user", onGetUser);

    return () => {
      client.un("get-user", onGetUser);
    };
  }, []);

  return (
    <Button
      variant={following ? "outlined" : "contained"}
      size="small"
      onClick={
        following
          ? () => client.unfollow({ user })
          : () => client.follow({ user })
      }
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}

export default FollowButton;
