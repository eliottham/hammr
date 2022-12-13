import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ClientContext from "../contexts/client_context";

function Login() {
  const client = useContext(ClientContext);
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onLogin = ({ error }) => {
      if (error) {
        setError(error);
      }
    };

    client.on("login", onLogin);

    return () => {
      client.un("login", onLogin);
    };
  }, []);

  async function login() {
    client.login({ email, password });
  }

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
          <h2>Login</h2>
        </Grid>
        <TextField
          label="Email"
          placeholder="Enter email"
          fullWidth
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          error={!!error}
          style={{ paddingBottom: "8px" }}
          onKeyPress={(e) => {
            if (e.which === 13) {
              login();
            }
          }}
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
            setError("");
          }}
          error={!!error}
          onKeyPress={(e) => {
            if (e.which === 13) {
              login();
            }
          }}
        />
        {error && (
          <Typography sx={{ color: "#f44336" }} variant="caption">
            {error}
            <br />
          </Typography>
        )}
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          sx={{ margin: "8px 0" }}
          fullWidth
          onClick={login}
        >
          Login
        </Button>
        <div style={{ paddingTop: 30, textAlign: "center" }}>
          <Typography
            sx={{
              color: theme.palette.primary.main,
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {}}
          >
            Forgot password?
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            Don't have an account?&nbsp;
            <Typography
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => client.fire("register-link-click")}
            >
              Sign Up
            </Typography>
          </div>
        </div>
      </Paper>
    </Grid>
  );
}

export default Login;
