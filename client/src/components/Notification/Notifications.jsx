import { useContext, useEffect, useState } from "react";
import Notification from "./Notification";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import ClientContext from "../../contexts/client_context";

const limit = 20;

const Item = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: "15px",
  border: "1px solid #1e1e1e",
  borderRadius: "0.75rem",
}));

function Notifications() {
  const client = useContext(ClientContext);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewAll, setViewAll] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const onGetNotifications = (response) => {
      setNotifications(response.docs);
      setTotalPages(response.totalPages);
      client.updateNotificationsRead({
        notifications: response.docs,
      });
    };
    client.on("get-notifications", onGetNotifications);

    if (viewAll) {
      client.getNotifications({
        limit,
        page,
      });
    } else {
      client.getNotifications({
        unread: true,
        limit,
        page,
      });
    }

    return () => {
      client.un("get-notifications", onGetNotifications);
    };
  }, []);

  useEffect(() => {
    if (viewAll) {
      client.getNotifications({
        limit,
        page,
      });
    } else {
      client.getNotifications({
        unread: true,
        limit,
        page,
      });
    }
  }, [viewAll]);

  function handlePageChange(event, value) {
    setPage(value);
    client.getNotifications({
      unread: !viewAll,
      limit,
      page: value,
    });
  }

  return (
    <Box sx={{ margin: "10px auto 10px auto", width: "40%" }}>
      <Item>
        <Box display="flex" alignItems="center">
          <Box display="flex" gap={1} flex="1">
            <Button
              size="small"
              variant={viewAll ? "contained" : "outlined"}
              onClick={() => setViewAll(true)}
            >
              All
            </Button>
            <Button
              size="small"
              variant={viewAll ? "outlined" : "contained"}
              onClick={() => setViewAll(false)}
            >
              Unread
            </Button>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            flex="1"
            alignItems="center"
          >
            <NotificationsIcon fontSize="medium" />
            &nbsp;
            <Typography fontWeight={500} variant="h6">
              Notifications
            </Typography>
          </Box>
        </Box>
      </Item>
      {notifications.length ? (
        notifications.map((notification) => (
          <Item
            key={notification._id}
            sx={{
              marginTop: "10px",
              "&:hover": {
                cursor: "pointer",
                borderColor: "primary.main",
              },
            }}
          >
            <Notification notification={notification} />
          </Item>
        ))
      ) : (
        <Item sx={{ marginTop: "10px" }}>No new notifications</Item>
      )}
      {notifications.length ? (
        <Box
          alignItems="center"
          mt="10px"
          justifyContent="center"
          display="flex"
        >
          <Pagination
            page={page}
            count={totalPages}
            shape="rounded"
            onChange={handlePageChange}
          />
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default Notifications;
