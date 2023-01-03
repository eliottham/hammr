import { useState, useContext } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ClientContext from "../../contexts/client_context";

function Register() {
  const client = useContext(ClientContext);
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPwError, setConfirmPasswordError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  useState(() => {
    const onRegisterError = ({ errorFields }) => {
      console.log(errorFields);
      // TODO add error messages for fields
    };
    client.on("register-error", onRegisterError);

    return () => {
      client.un("register-error", onRegisterError);
    };
  }, []);

  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{
          padding: "20px",
          height: "55vh",
          width: "25vw",
          margin: "100px auto",
        }}
      >
        <Grid align="center">
          <Avatar />
          <h2>Sign Up</h2>
        </Grid>
        <TextField
          label="Email"
          placeholder="Enter email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ paddingBottom: "8px" }}
        />
        <TextField
          label="Username"
          placeholder="Enter username"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ paddingBottom: "8px" }}
        />
        <TextField
          label="Password"
          placeholder="Enter password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setConfirmPasswordError(
              !!(confirmPassword && e.target.value !== confirmPassword)
            );
            setDisableButton(e.target.value !== confirmPassword);
          }}
          style={{ paddingBottom: "8px" }}
        />
        <TextField
          label="Confirm password"
          placeholder="Confirm password"
          type="password"
          error={confirmPwError}
          fullWidth
          required
          value={confirmPassword}
          helperText={confirmPwError && "Passwords must be the same"}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmPasswordError(
              !!(e.target.value && password !== e.target.value)
            );
            setDisableButton(password !== e.target.value);
          }}
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={disableButton}
          sx={{ margin: "8px 0" }}
          fullWidth
          onClick={() => {
            client.register({
              email,
              username,
              password,
            });
          }}
        >
          Sign Up
        </Button>
        <div style={{ paddingTop: 30, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            Already have an account?&nbsp;
            <Typography
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => client.fire("login-link-click")}
            >
              Login
            </Typography>
          </div>
        </div>
      </Paper>
    </Grid>
  );
}

export default Register;
