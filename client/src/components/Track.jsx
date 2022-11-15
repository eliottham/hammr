import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";

function Track({ track, onClick, mouseOver, style }) {
  const theme = useTheme();

  const defaultStyle = {
    backgroundColor: "#181818",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
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

export default Track;
