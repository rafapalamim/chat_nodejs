import { Accordion, AccordionDetails, AccordionSummary, Badge, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function AccordionArea(props) {
    return (
        <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={props.style}
            >
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    {props.icon}{props.title} <Badge badgeContent={props.listRows.length} color="primary" sx={{ ml: 3 }} />
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant='caption' component="p" sx={{ textAlign: 'center', my: 1 }}>{props.insideMessage}</Typography>
                <List>
                    {!props.listRows || props.listRows.length < 1 && <Typography variant='caption' component="p" sx={{ textAlign: 'center', my: 1 }}>NENHUM</Typography>}
                    {props.listRows && props.listRows.map((row) => {
                        return (
                            <ListItem disablePadding key={row.socketJwt.id} data-id={row.socketJwt.id} onClick={props.handlerEvent}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {props.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={row.socketJwt.name} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </AccordionDetails>
        </Accordion>
    )
}