import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

function UserAvatarLink({ user, width = 30, height = 30 }) {
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
        width,
        height,
        "&:hover": {
          cursor: "pointer",
        },
      }}
      onClick={handleClick}
      variant="circle"
      src={user?.avatarUrl}
    />
  );
}

export default UserAvatarLink;
