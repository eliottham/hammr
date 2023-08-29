import { useContext, useEffect, useState } from "react";
import ClientContext from "../../contexts/client_context";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Notification from "./Notification";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";

const limit = 7;

function NotificationMenu() {
  const client = useContext(ClientContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationLength, setNotificationLength] = useState(0);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const onGetLastXNotifications = (response) => {
      setNotifications(response.notifications);
      setNotificationLength(response.unreadTotalCount);
    };
    client.on("get-last-x-notifications", onGetLastXNotifications);
    client.getLastXNotifications({ limit });

    const onUpdateNotificationsRead = () => {
      client.getLastXNotifications({ limit });
    };
    client.on("update-notifications-read", onUpdateNotificationsRead);

    return () => {
      client.un("get-last-x-notifications", onGetLastXNotifications);
      client.un("update-notifications-read", onUpdateNotificationsRead);
      client.socket.removeAllListeners("notification");
    };
  }, []);

  useEffect(() => {
    client.socket.removeAllListeners("notification");
    client.socket.on("notification", (notification) => {
      const newNotifications = notifications;
      if (newNotifications.length === limit) {
        newNotifications.splice(limit - 1, 1);
      }
      newNotifications.unshift(notification);
      setNotifications(notifications);
      setNotificationLength(notificationLength + 1);
    });
  }, [notifications, notificationLength]);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
    client.updateNotificationsRead({
      notifications,
    });
  }

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleClick} size="small">
          <Badge
            color="primary"
            badgeContent={notificationLength}
            invisible={!notificationLength}
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
        disableScrollLock
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
        <MenuItem
          sx={{
            opacity: "1 !important",
            "&:hover": {
              cursor: "default",
              backgroundColor: "background.paper",
            },
          }}
        >
          <Box
            display="flex"
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            width="100%"
          >
            <Typography variant="h6">Notifications</Typography>
            <Typography
              variant="body1"
              color="primary"
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/notifications")}
            >
              See all
            </Typography>
          </Box>
        </MenuItem>
        {notifications.length ? (
          notifications.map((notification) => {
            return (
              <MenuItem key={notification._id}>
                <Notification notification={notification} />
              </MenuItem>
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
