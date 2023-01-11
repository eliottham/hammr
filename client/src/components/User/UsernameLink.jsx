import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

function UsernameLink({ author }) {
  const navigate = useNavigate();

  function handleClick(e) {
    e.stopPropagation();
    if (author) {
      navigate(`/user/${author._id}`);
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
      variant="caption"
      onClick={handleClick}
    >
      {author?.username}
    </Typography>
  );
}

export default UsernameLink;
