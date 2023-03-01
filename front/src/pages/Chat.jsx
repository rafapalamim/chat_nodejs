import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, Chip, Container, Divider, Paper, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import NotesIcon from '@mui/icons-material/Notes';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/App';
import { SocketContext } from '../contexts/Socket';
import AccordionArea from './parts/AccordionArea';
import ListArea from './parts/ListArea';

export default function Chat() {

    const [atendente, setAtendente] = React.useState(null);
    const [listAtendentes, setListaAtendentes] = React.useState([]);

    const appCtx = React.useContext(AppContext);
    const { socket, token } = React.useContext(SocketContext);
    const navigate = useNavigate();
    /** Dispara ao carregar a página */
    React.useEffect(() => {
        if (!token) {
            appCtx.showAlert('error', 'Autentique-se novamente!');
            navigate('/');
        }
    }, []);


    const handleJoinChat = (e) => {
        console.log('JoinChat: ', e.currentTarget);
    };

    const handlePasteMessage = (e) => {
        console.log('PasteMessage: ', e.currentTarget);
    };
    
    const handleChangeChat = (e) => {
        console.log('ChangeRoom: ', e.currentTarget);
    };

    const handleTransferChat = (e) => {
        console.log('TransferChat: ', e.currentTarget.getAttribute('data-id'));
    }

    /** Enviar mensagem */
    const handleSendMessage = (e) => {
        e.preventDefault();
        const formSubmited = e.currentTarget;
        const input = formSubmited.querySelector('textarea');
        const message = input.value;
        socket.emit('message', message);
        console.log('SendMessage: ', message);
        input.value = '';
    }

    // console.log(atendente);
    if (atendente === null) {
        // console.log('buscando perfil...');
        socket.emit('buscar perfil');
        socket.on('retorno perfil', ({ atendente }) => {
            setAtendente(atendente);
        });
        socket.on('atendente entrou', (msg) => {
            console.log(msg);
            setListaAtendentes(msg);
        });
    }

    socket.on('message', (msg) => {
        console.log(msg)
    });

    return (
        <Container sx={{ mt: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {atendente === null ?
                        <Grid item xs={3}></Grid>
                        :
                        !atendente ?
                            <Grid item xs={3}>
                                <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, modi asperiores dignissimos voluptatem fugit optio! Dolorum maiores praesentium ullam libero modi rem asperiores sed optio ad laudantium tempore, doloribus ex.</Typography>
                            </Grid>
                            :
                            <Grid item xs={3}>
                                <AccordionArea
                                    title="Atendentes on-line"
                                    icon={<SupportAgentIcon sx={{ mr: 1 }} />}
                                    insideMessage="Para transferir, clique no atendente"
                                    style={{
                                        bgcolor: "primary.main",
                                        color: "#ffffff"
                                    }}
                                    listRows={listAtendentes}
                                    handlerEvent={handleTransferChat}
                                />
                                <AccordionArea
                                    title="Mensagens prontas"
                                    icon={<NotesIcon sx={{ mr: 1 }} />}
                                    insideMessage="Clique em uma mensagem para colar o texto na caixa de mensagem"
                                    style={{
                                        bgcolor: "secondary.main",
                                        color: "#ffffff"
                                    }}
                                    listRows=""
                                    handlerEvent={handlePasteMessage}
                                    
                                />
                                <ListArea
                                    titleIcon={<ChatBubbleIcon sx={{ mr: 1 }} />}
                                    titleText="Em atendimento"
                                    listIcon={<PersonIcon />}
                                    listText="João"
                                    listRows=""
                                    handlerEvent={handleChangeChat}
                                />
                                <Divider sx={{ my: 2 }} />
                                <ListArea
                                    titleIcon={<HourglassBottomIcon sx={{ mr: 1 }} />}
                                    titleText="Fila de espera"
                                    listIcon={<PersonIcon />}
                                    listText="Renata"
                                    listRows=""
                                    handlerEvent={handleJoinChat}
                                />
                            </Grid>
                    }
                    <Grid item xs={9}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="button" component="p">Você está conversando com <b></b> (Identificação: )</Typography>
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