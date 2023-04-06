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

function Notification({ notification }) {
  const client = useContext(ClientContext);
  const navigate = useNavigate();
  const [notificationText, setNotificationText] = useState("");
  const [navigationPath, setNavigationPath] = useState("");

  useEffect(() => {
    if (notification.type === "comment" && notification.targetPost) {
      setNotificationText(
        `${notification.fromUser.username} commented on your post`
      );
      setNavigationPath(`comment/${notification.comment._id}`);
    }
  }, []);

  return (
    <MenuItem onClick={() => navigate(navigationPath)}>
      <Avatar src={notification.fromUser.avatarUrl} />
      {notificationText}
    </MenuItem>
  );
}

export default Notification;
