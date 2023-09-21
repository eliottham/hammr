import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import UsernameLink from "../User/UsernameLink";
import UserAvatarLink from "../User/UserAvatarLink";
import Typography from "@mui/material/Typography";
import Util from "../../util";
import CircleIcon from "@mui/icons-material/Circle";

function Notification({ notification }) {
  const navigate = useNavigate();
  const [notificationText, setNotificationText] = useState("");
  const [navigationPath, setNavigationPath] = useState("");

  useEffect(() => {
    if (notification.type === "comment" && notification.targetPost) {
      setNotificationText("commented on your post.");
      setNavigationPath(`comment/${notification.comment}`);
    } else if (notification.type === "like") {
      if (notification.targetPost) {
        setNotificationText("liked your post.");
        setNavigationPath(`post/${notification.targetPost}`);
      } else if (notification.targetComment) {
        setNotificationText("liked your comment.");
        setNavigationPath(`comment/${notification.targetComment}`);
      }
    }
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="10px"
      width="95%"
      onClick={() => navigate(navigationPath)}
    >
      <UserAvatarLink
        user={notification.fromUser}
        width={40}
        height={40}
        flex="1"
      />
      <Box
        display="flex"
        flexDirection="column"
        flex="1"
        alignItems="flex-start"
      >
        <Typography variant="body1" display="flex" component="div">
          <UsernameLink user={notification.fromUser} />
          &nbsp;
          {notificationText}
        </Typography>
        <Typography
          variant="body2"
          color={notification.read ? null : "primary"}
        >
          {Util.getTimeFromNow(notification.creationDate)}
        </Typography>
      </Box>
      {!notification.read && (
        <Box flex="1" justifyContent="flex-end" display="flex">
          <CircleIcon
            color="primary"
            fontSize="small"
            sx={{ transform: "scale(0.7)" }}
          />
        </Box>
      )}
    </Box>
  );
}

export default Notification;
