import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

function TrackListItem({ track, onClick, mouseOver, style }) {
  const defaultStyle = {
    backgroundColor: "background.default",
    "&:hover": {
      backgroundColor: "primary.main",
      color: "neutral.main",
      ".MuiListItemText-secondary": {
        color: "neutral.main",
      },
    },
    zIndex: 99,
  };

  return (
    <ListItem
      key={track?.id}
      sx={style || defaultStyle}
      onClick={() => onClick && onClick(track)}
      onMouseOver={() => mouseOver && mouseOver(true)}
      onMouseOut={() => mouseOver && mouseOver(false)}
    >
      <ListItemAvatar>
        <Avatar variant="square" src={track?.album.images[0].url} />
      </ListItemAvatar>
      <ListItemText primary={track?.name} secondary={track?.artists[0].name} />
    </ListItem>
  );
}

export default TrackListItem;
