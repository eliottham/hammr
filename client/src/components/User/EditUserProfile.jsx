import { useState, useContext, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import ClientContext from "../../contexts/client_context";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

const paperWidth = document.documentElement.clientWidth / 2.5;
const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  padding: "15px",
  textAlign: "left",
  borderRadius: "0.75rem",
  width: paperWidth + "px",
  margin: "10px auto 10px auto",
}));

const inputStyle = {
  width: "400px",
  maxWidth: paperWidth / 2 + "px",
};

const listItemStyle = {
  display: "flex",
  justifyContent: "center",
  "&:hover": {
    cursor: "pointer",
  },
};

function EditUserProfile() {
  const client = useContext(ClientContext);

  const [user, setUser] = useState();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState();
  const [bio, setBio] = useState("");
  const [bioCharCount, setBioCharCount] = useState(0);
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onGetUser = (responseUser) => {
      if (responseUser._id === client.user._id) {
        setUser(responseUser);
        setName(responseUser.name);
        setUsername(responseUser.username);
        setAvatarUrl(responseUser.avatarUrl);
        setBio(responseUser.bio);
        setBioCharCount(responseUser.bio?.length);
      }
    };
    client.on("get-user", onGetUser);

    const onAvatarChange = ({ newAvatarUrl }) => {
      setAvatarUrl(newAvatarUrl);
    };
    client.on("avatar-change", onAvatarChange);

    if (client.user._id) {
      client.getUser(client.user._id);
    } else {
      client.fire("require-authentication");
    }

    return () => {
      client.un("get-user", onGetUser);
      client.un("avatar-change", onAvatarChange);
    };
  }, [client]);

  function uploadAvatar() {
    inputRef.current?.click();
    setOpenAvatarDialog(false);
  }

  function deleteAvatar() {
    client.deleteAvatar();
    setOpenAvatarDialog(false);
  }

  function handleFileChange(e) {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 300;
          let width = image.width;
          let height = image.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              blob && client.uploadAvatar(blob);
            },
            "image/jpeg",
            0.6
          );
        };
        image.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  return user ? (
    <>
      <Dialog
        open={openAvatarDialog}
        onClose={() => setOpenAvatarDialog(false)}
        sx={{ borderRadius: "0.75rem" }}
      >
        <DialogTitle>Change Profile Picture</DialogTitle>
        <List sx={{ mt: "-25px", textAlign: "center" }}>
          <ListItem divider />
          <ListItem onClick={uploadAvatar} divider sx={listItemStyle}>
            <Typography color="primary.main" fontWeight="bold">
              Upload Photo
            </Typography>
          </ListItem>
          <ListItem onClick={deleteAvatar} divider sx={listItemStyle}>
            <Typography color="error" fontWeight="bold">
              Remove Current Photo
            </Typography>
          </ListItem>
          <ListItem
            onClick={() => setOpenAvatarDialog(false)}
            sx={listItemStyle}
          >
            <Typography>Cancel</Typography>
          </ListItem>
        </List>
      </Dialog>
      <StyledPaper>
        <Grid
          container
          spacing={2}
          columnSpacing={8}
          columns={3}
          alignItems="center"
          justifyContent="center"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Grid item xs={1} align="right">
            <Avatar
              onClick={() => setOpenAvatarDialog(true)}
              src={avatarUrl}
              sx={{
                width: "60px",
                height: "60px",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography gutterBottom variant="body2" fontWeight="bold">
              {user.username}
            </Typography>
            <Typography
              onClick={() => setOpenAvatarDialog(true)}
              variant="body2"
              gutterBottom
              mt={-1}
              color={"primary.main"}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              Change profile photo
            </Typography>
          </Grid>
          <Grid item xs={1} align="right">
            <Typography fontWeight="bold">Name</Typography>
          </Grid>
          <Grid item xs={2}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={1} align="right">
            <Typography fontWeight="bold">Username</Typography>
          </Grid>
          <Grid item xs={2}>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={1} align="right">
            <Typography fontWeight="bold">Bio</Typography>
          </Grid>
          <Grid item xs={2}>
            <TextField
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setBioCharCount(e.target.value.length);
              }}
              size="small"
              rows={2}
              multiline
              sx={inputStyle}
            />
            <Typography
              variant="caption"
              color={bioCharCount <= 150 ? "text.secondary" : "error"}
              display="block"
            >
              {bioCharCount} / 150
            </Typography>
          </Grid>
          <Grid item xs={1} align="left">
            <Button
              variant="contained"
              disabled={bioCharCount > 150}
              onClick={() =>
                client.submitUserProfileEdits({ name, username, bio })
              }
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>
    </>
  ) : (
    <></>
  );
}

export default EditUserProfile;
