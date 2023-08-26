import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

function UsernameLink({ user, variant = "body1" }) {
  const navigate = useNavigate();

  function handleClick(e) {
    e.stopPropagation();
    if (user?._id) {
      navigate(`/user/${user._id}`);
    }
  }
  return (
    <Typography
      sx={{
        "&:hover": {
          cursor: "pointer",
          textDecoration: "underline",
        },
      }}
      variant={variant}
      onClick={handleClick}
    >
      {user?.username}
    </Typography>
  );
}

export default UsernameLink;
