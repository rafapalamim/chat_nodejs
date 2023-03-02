import { Badge, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";

export default function ListArea(props) {
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>

            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader" sx={{ display: 'flex', alignItems: 'center' }}>
                    {props.titleIcon}{props.titleText} <Badge badgeContent={props.listRows.length} color="primary" sx={{ ml: 3 }} />
                </ListSubheader>
            }>
                {!props.listRows || props.listRows.length < 1 && <Typography variant='caption' component="p" sx={{ textAlign: 'center', my: 1 }}>Nenhum cliente conectado</Typography>}

                {props.listRows && props.listRows.map((row) => {
                    return (
                        <ListItem disablePadding key={props.keyPrefix + row.socketJwt.id} data-id={row.socketJwt.chatId} onClick={props.handlerEvent}>
                            <ListItemButton>
                                <ListItemIcon>
                                    {props.listIcon}
                                </ListItemIcon>
                                <ListItemText primary={row.socketJwt.name} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
}