import { useState, useContext, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import ClientContext from "../../contexts/client_context";
import CreateComment from "../Comment/CreateComment";
import Track from "../Track/Track";
import Comment from "../Comment/Comment";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import LikeButton from "../LikeButton";
import Typography from "@mui/material/Typography";
import Util from "../../util.js";
import UsernameLink from "./UsernameLink";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FollowButton from "../FollowButton";
import TextField from "@mui/material/TextField";

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

function EditUserProfile() {
  const client = useContext(ClientContext);

  const [user, setUser] = useState();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [bioCharCount, setBioCharCount] = useState(0);

  useEffect(() => {
    const onGetUser = (responseUser) => {
      if (responseUser._id === client.user._id) {
        setUser(responseUser);
        setName(responseUser.name);
        setUsername(responseUser.username);
        setBio(responseUser.bio);
        setBioCharCount(responseUser.bio?.length);
      }
    };
    client.on("get-user", onGetUser);
    if (client.user._id) {
      client.getUser(client.user._id);
    } else {
      // setUser();
      client.fire("require-authentication");
    }

    return () => {
      client.un("get-user", onGetUser);
    };
  }, []);

  return user ? (
    <StyledPaper>
      <Grid
        container
        spacing={2}
        columnSpacing={8}
        columns={3}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={1} align="right">
          <Avatar
            src={user.avatar}
            sx={{
              width: "50px",
              height: "50px",
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
  ) : (
    <></>
  );
}

export default EditUserProfile;
