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
  const [disableButton, setDisableButton] = useState(false);
  const [emailError, setEmailError] = useState({});
  const [usernameError, setUsernameError] = useState({});
  const [passwordError, setPasswordError] = useState({});
  const [confirmPwError, setConfirmPasswordError] = useState(false);

  useState(() => {
    const onRegisterError = ({ errors = {} }) => {
      setEmailError({});
      setUsernameError({});
      setPasswordError({});
      setDisableButton(true);
      for (const error in errors) {
        if (error === "email") {
          setEmailError(errors[error]);
        } else if (error === "username") {
          setUsernameError(errors[error]);
        } else if (error === "password") {
          setPasswordError(errors[error]);
        }
      }
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
          height: "65vh",
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
          error={emailError.value === email}
          helperText={emailError.value === email && emailError.message}
          onChange={(e) => {
            setEmail(e.target.value);
            setDisableButton(e.target.value === emailError.value);
          }}
          style={{ paddingBottom: "8px" }}
        />
        <TextField
          label="Username"
          placeholder="Enter username"
          fullWidth
          required
          value={username}
          error={usernameError.value === username}
          helperText={usernameError.value === username && usernameError.message}
          onChange={(e) => {
            setUsername(e.target.value);
            setDisableButton(e.target.value === usernameError.value);
          }}
          style={{ paddingBottom: "8px" }}
        />
        <TextField
          label="Password"
          placeholder="Enter password"
          type="password"
          fullWidth
          required
          value={password}
          error={passwordError.value === password}
          helperText={passwordError.value === password && passwordError.message}
          onChange={(e) => {
            setPassword(e.target.value);
            setConfirmPasswordError(
              !!(confirmPassword && e.target.value !== confirmPassword)
            );
            if (e.target.value.length >= 8) {
              setPasswordError({});
            }
            setDisableButton(
              e.target.value !== confirmPassword ||
                e.target.value === passwordError.value
            );
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
        <div style={{ paddingTop: 40, textAlign: "center" }}>
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
