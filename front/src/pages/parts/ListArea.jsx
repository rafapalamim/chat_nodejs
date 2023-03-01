import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";

export default function ListArea(props) {
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader" sx={{ display: 'flex', alignItems: 'center' }}>
                    {props.titleIcon}{props.titleText}
                </ListSubheader>
            }>
                <ListItem disablePadding onClick={props.handlerEvent}>
                    <ListItemButton>
                        <ListItemIcon>
                            {props.listIcon}
                        </ListItemIcon>
                        <ListItemText primary={props.listText} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )
}