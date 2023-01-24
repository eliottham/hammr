import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

function UserAvatarLink({ user }) {
  const navigate = useNavigate();

  function handleClick(e) {
    e.stopPropagation();
    if (user?._id) {
      navigate(`/user/${user._id}`);
    }
  }
  return (
    <Avatar
      sx={{
        width: 24,
        height: 24,
        "&:hover": {
          cursor: "pointer",
          textDecoration: "underline",
        },
      }}
      onClick={handleClick}
      variant="circle"
      src={user?.avatarUrl}
    />
  );
}

export default UserAvatarLink;
