import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPwError, setConfirmPasswordError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  async function registerUser(event) {
    event.preventDefault();
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    if (data.stratus === "ok") {
      navigate.push("/login");
    }
  }

  const paperStyle = {
    padding: 20,
    height: "55vh",
    width: "25%",
    margin: "100px auto",
  };
  const buttonStyle = { margin: "8px 0" };
  const linksStyle = { paddingTop: 30, textAlign: "center" };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
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
          label="Password"
          placeholder="Enter password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setConfirmPasswordError(
              confirmPassword && e.target.value !== confirmPassword
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
              e.target.value && password !== e.target.value
            );
            setDisableButton(password !== e.target.value);
          }}
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={disableButton}
          style={buttonStyle}
          fullWidth
          onClick={registerUser}
        >
          Sign Up
        </Button>
        <div style={linksStyle}>
          <Typography>
            {" "}
            Already have an account?&emsp;
            <Link href="/login">Login Here</Link>
          </Typography>
        </div>
      </Paper>
    </Grid>
  );
}

export default Register;
