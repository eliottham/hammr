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
import Notification from "./Notification";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";

function NotificationMenu() {
  const client = useContext(ClientContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationLength, setUnreadNotificationLength] = useState(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    client.socket.on("notification", (notification) => {
      setNotifications(notifications.concat(notification));
    });
  }, [notifications]);

  useEffect(() => {
    setUnreadNotificationLength(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
    // client.updateNotificationRead({
    //   notifications: notifications.filter((n) => !n.read),
    // });
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleClick} size="small">
          <Badge
            color="primary"
            badgeContent={unreadNotificationLength}
            invisible={!unreadNotificationLength}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 360,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "& .MuiAvatar-root": {
              width: "40px",
              height: "40px",
              mr: "16px",
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Typography variant="h6">Notifications</Typography>
        </MenuItem>
        {notifications.length ? (
          notifications.map((notification) => {
            return (
              <Notification
                notification={notification}
                key={notification._id}
              />
            );
          })
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
    </>
  );
}

export default NotificationMenu;
