import { Accordion, AccordionDetails, AccordionSummary, Badge, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListIcon from '@mui/icons-material/List';
import { blue, blueGrey } from "@mui/material/colors";


export default function AccordionMensagensProntas(props) {

    const handleClickMessage = (e) => {
        e.preventDefault();
        const message = e.currentTarget.querySelector('span').innerHTML;
        const input = document.querySelector('textarea');
        input.value = message;
        input.focus();

    }

    return (
        <Accordion expanded={true}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: props.style.bgcolor }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={props.style}
            >
                <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bolder' }}>
                    {props.icon}{props.title} <Badge badgeContent={props.listRows.length} color="primary" sx={{ ml: 3 }} />
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant='caption' component="p" sx={{ textAlign: 'center', my: 1 }}>{props.insideMessage}</Typography>
                <List>
                    {!props.listRows || props.listRows.hasOwnProperty('mensagens') < 1 && <Typography variant='caption' component="p" sx={{ textAlign: 'center', my: 1 }}>Nenhuma mensagem cadastrada</Typography>}

                    {props.listRows && props.listRows.mensagens.map((row, keyRow) => {
                        return (
                            <Accordion key={'bloco_' + keyRow + '_accordion'}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#000" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{
                                        bgcolor: blueGrey[100]
                                    }}
                                >
                                    <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bolder' }}>
                                        <ListIcon sx={{ mr: 2 }} /> {row.bloco}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {row.lista.map((item, key) => {
                                            return (
                                                <ListItem disablePadding key={'bloco_' + keyRow + '_' + key} onClick={handleClickMessage} title={item}>
                                                    <ListItemButton>
                                                        <ListItemText primary={item} sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        )

                    })}
                </List>
            </AccordionDetails>
        </Accordion>
    )
}