import { useContext } from "react";
import ClientContext from "../../contexts/client_context";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

function AddToQueueButton({ track, tracks }) {
  const client = useContext(ClientContext);
  function handleAddToQueueClick(e) {
    e.stopPropagation();
    client.fire("add-to-queue", track || tracks);
  }

  return (
    <Tooltip title={track ? "Add to queue" : "Add all to queue"}>
      <IconButton onClick={handleAddToQueueClick}>
        <PlaylistAddIcon fontSize="large" />
      </IconButton>
    </Tooltip>
  );
}

export default AddToQueueButton;
