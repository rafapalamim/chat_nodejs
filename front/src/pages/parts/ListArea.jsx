import { Badge, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";

export default function ListArea(props) {

    const show = (prefix, chatId, rooms, atendenteId) => {

        if (!prefix) {
            return true;
        }

        if (prefix == 'wait_' && rooms.has(chatId)) {
            return false;
        }

        if (prefix == 'on_' && !rooms.has(chatId)) {
            return false;
        }

        if (prefix == 'on_' && rooms.get(chatId) != atendenteId) {
            return false;
        }

        return true;
    }

    const list = props.listRows ? props.listRows.filter((row) => {
        return show(props.keyPrefix, row.socketJwt.chatId, props.listRooms, props.atendenteId);
    }) : [];

    const newMessages = localStorage.getItem('CHAT_NEW_MESSAGES') !== null ? JSON.parse(localStorage.getItem('CHAT_NEW_MESSAGES')) : {};

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>

            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader" sx={{ display: 'flex', alignItems: 'center' }}>
                    {props.titleIcon}{props.titleText} <Badge badgeContent={list.length} color="primary" sx={{ ml: 3 }} />
                </ListSubheader>
            }>
                {list.map((row) => {
                    if (show(props.keyPrefix, row.socketJwt.chatId, props.listRooms, props.atendenteId)) {
                        return (
                            <ListItem
                                disablePadding
                                key={props.keyPrefix + row.socketJwt.chatId}
                                data-id={row.socketJwt.chatId}
                                onClick={props.handlerEvent}
                                secondaryAction={<Badge
                                    badgeContent={
                                        newMessages.hasOwnProperty(row.socketJwt.chatId) ? newMessages[row.socketJwt.chatId] : 0
                                    }
                                    color="primary"
                                    sx={{ ml: 3 }}
                                />}
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        {props.listIcon}
                                    </ListItemIcon>
                                    <ListItemText primary={row.socketJwt.name} />
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                })}
            </List>
        </Box>
    )
}