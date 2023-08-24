import { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import ClientContext from "../../contexts/client_context";
import SearchBar from "../SearchBar";
import AddIcon from "@mui/icons-material/Add";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import UsernameLink from "../User/UsernameLink";
import Typography from "@mui/material/Typography";
import Util from "../../util";
import CircleIcon from "@mui/icons-material/Circle";

function Notification({ notification }) {
  const client = useContext(ClientContext);
  const navigate = useNavigate();
  const [notificationText, setNotificationText] = useState("");
  const [navigationPath, setNavigationPath] = useState("");

  useEffect(() => {
    let fromUsername = notification.fromUser.username;
    if (notification.type === "comment" && notification.targetPost) {
      setNotificationText(`${fromUsername} commented on your post.`);
      setNavigationPath(`comment/${notification.comment}`);
    } else if (notification.type === "like") {
      if (notification.targetPost) {
        setNotificationText(`${fromUsername} liked your post.`);
        setNavigationPath(`post/${notification.targetPost}`);
      } else if (notification.targetComment) {
        setNotificationText(`${fromUsername} liked your comment.`);
        setNavigationPath(`comment/${notification.targetComment}`);
      }
    }
  }, []);

  return (
    <MenuItem onClick={() => navigate(navigationPath)}>
      <Avatar src={notification.fromUser.avatarUrl} flex="1" />
      <Box display="flex" flexDirection="column" flex="1">
        <Typography variant="body1" display="flex" component="div">
          <UsernameLink user={notification.fromUser} variant="body1" />
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
        <CircleIcon
          color="primary"
          fontSize="small"
          sx={{ transform: "scale(0.7)" }}
          flex="1"
        />
      )}
    </MenuItem>
  );
}

export default Notification;
