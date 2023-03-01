import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, Container, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotesIcon from '@mui/icons-material/Notes';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/App';
import { io } from "socket.io-client";

export default function Chat() {

    const atendente = true;
    const appCtx = React.useContext(AppContext);
    const token = appCtx.getToken();
    const navigate = useNavigate();
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
        query: token
    });

    /** Dispara ao carregar a página */
    React.useEffect(() => {
        if (!token) {
            appCtx.showAlert('error', 'Autentique-se novamente!');
            navigate('/');
        }
    }, []);

    const handleChangeRoom = (e) => {
        console.log('ChangeRoom: ', e.currentTarget);
    };

    const handleTransferChat = (e) => {
        console.log('TransferChat: ', e.currentTarget);
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        const formSubmited = e.currentTarget;
        const input = formSubmited.querySelector('textarea');
        const message = input.value;
        socket.emit('message', message);
        // console.log('SendMessage: ', message);
        input.value = '';
    }

    socket.on('message', (msg) => {
        console.log(msg);
    });


    return (
        <Container sx={{ mt: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {!atendente ?
                        <Grid item xs={3}>
                            <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, modi asperiores dignissimos voluptatem fugit optio! Dolorum maiores praesentium ullam libero modi rem asperiores sed optio ad laudantium tempore, doloribus ex.</Typography>
                        </Grid>
                        :
                        <Grid item xs={3}>
                            <Accordion sx={{ mb: 2 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{
                                        bgcolor: "primary.main",
                                        color: "#ffffff"
                                    }}
                                >
                                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                        <SupportAgentIcon sx={{ mr: 1 }} />Atendentes on-line
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant='caption' component="p" sx={{ textAlign: 'center', my: 1 }}>Para transferir, clique no atendente</Typography>
                                    <List>
                                        <ListItem disablePadding onClick={handleTransferChat}>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <SupportAgentIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Rafael" />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion sx={{ mb: 2 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#ffffff" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={{
                                        bgcolor: "secondary.main",
                                        color: "#ffffff"
                                    }}
                                >
                                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                        <NotesIcon sx={{ mr: 1 }} />Mensagens prontas
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                </AccordionDetails>
                            </Accordion>
                            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <List subheader={
                                    <ListSubheader component="div" id="nested-list-subheader" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ChatBubbleIcon sx={{ mr: 1 }} /> Em atendimento
                                    </ListSubheader>
                                }>
                                    <ListItem disablePadding onClick={handleChangeRoom}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="João" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                <List subheader={
                                    <ListSubheader component="div" id="nested-list-subheader" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <HourglassBottomIcon sx={{ mr: 1 }} /> Fila de espera
                                    </ListSubheader>
                                }>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Renata" />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>
                        </Grid>
                    }
                    <Grid item xs={9}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="button" component="p">Você está conversando com <b>{token.name}</b> (Identificação: {token.identifiedBy})</Typography>
                        </Box>

                        <Paper sx={{ py: 2, mb: 2, height: '60vh', overflow: "hidden", overflowY: "scroll" }}>
                            <Box sx={{ px: 2, py: 1 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 8 }}>
                                    <Box bgcolor="primary.main" color="#ffffff" sx={{ borderRadius: 2, p: 1 }}>
                                        <Chip sx={{ color: "#fff", my: 1 }} icon={<SupportAgentIcon color="#fff" />} label="Rafael" />
                                        <Typography>Seja bem-vindo(a) ao chat. No que posso ajudar?</Typography>
                                    </Box>
                                    <Typography component="p" variant="caption" sx={{ textAlign: 'right', mr: 8, mt: 1 }}>17:05</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ px: 2, py: 1 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 8 }}>
                                    <Box bgcolor="secondary.main" color="#ffffff" sx={{ borderRadius: 2, p: 1 }}>
                                        <Chip sx={{ color: "#fff", my: 1 }} icon={<PersonIcon color="#fff" />} label="Você" />
                                        <Typography>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat asperiores architecto maiores saepe consequatur rem fuga, consequuntur facilis nam dicta pariatur quas molestiae culpa nostrum ipsa totam placeat mollitia iusto.</Typography>
                                    </Box>
                                    <Typography component="p" variant="caption" sx={{ textAlign: 'left', mt: 1 }}>17:06</Typography>
                                </Box>
                            </Box>
                        </Paper>
                        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                id="standard-textarea"
                                placeholder="Digite aqui sua mensagem..."
                                multiline
                                maxRows={2}
                                fullWidth
                            />
                            <Button type="submit" variant="contained" color='success' title='Enviar mensagem'><SendIcon /></Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}