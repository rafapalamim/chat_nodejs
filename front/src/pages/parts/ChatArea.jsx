import { Box, Chip, Paper, TextField, Typography, Button, CircularProgress } from "@mui/material";
import { blueGrey, green, grey } from '@mui/material/colors';
import NotesIcon from '@mui/icons-material/Notes';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';

import { useEffect } from "react";
import AccordionMensagensProntas from "./AccordionMensagensProntas";
import json from "./../../../public/mensagens_prontas.json";

const defineIcon = (message, props) => {
    var icon = <PersonIcon color="#fff" />;
    if (props.perfil.atendente === true) {
        if (message.sendedBy == props.perfil.userId) {
            icon = <SupportAgentIcon color="#fff" />;
        } else {
            icon = <PersonIcon color="#fff" />;
        }
    } else {
        if (message.sendedBy == props.perfil.userId) {
            icon = <PersonIcon color="#fff" />;
        } else {
            icon = <SupportAgentIcon color="#fff" />;
        }
    }
    return icon;
}

export default function ChatArea(props) {

    useEffect(() => {
        const divMessages = document.querySelector('#area_messages');
        divMessages.scrollTop = divMessages.scrollHeight;
        document.querySelector('textarea').focus();
    }, [props])

    const receivedMessage = (message) => {

        const date = new Date(message.sendedAt);
        const icon = defineIcon(message, props);

        return (
            <Box key={message._id} sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 8 }}>
                    <Box bgcolor={grey[300]} color="#1a1c1a;" sx={{ borderRadius: 2, p: 1 }}>
                        <Chip sx={{ color: "#1a1c1a", my: 1 }} icon={icon} label={message.senderName} />
                        <Typography sx={{whiteSpace: 'pre-wrap'}}>{message.message}</Typography>
                    </Box>
                    <Typography component="p" variant="caption" sx={{ textAlign: 'left', mr: 8, mt: 1 }}>
                        {parseInt(date.getHours()) < 10 ? '0' + date.getHours() : date.getHours()}:
                        {parseInt(date.getMinutes()) < 10 ? '0' + date.getMinutes() : date.getMinutes()}</Typography>
                </Box>
            </Box>
        );
    }

    const sendedMessage = (message) => {

        const date = new Date(message.sendedAt);
        const icon = defineIcon(message, props);

        return (
            <Box key={message._id} sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 8 }}>
                    <Box bgcolor={green[200]} color="rgba(0, 0, 0, 0.87)" sx={{ borderRadius: 2, p: 1 }}>
                        <Chip sx={{ color: "rgba(0, 0, 0, 0.87)", my: 1 }} icon={icon} label={message.senderName} />
                        <Typography sx={{whiteSpace: 'pre-wrap'}}>{message.message}</Typography>
                    </Box>
                    <Typography component="p" variant="caption" sx={{ textAlign: 'right', ml: 8, mt: 1 }}>
                        {parseInt(date.getHours()) < 10 ? '0' + date.getHours() : date.getHours()}:
                        {parseInt(date.getMinutes()) < 10 ? '0' + date.getMinutes() : date.getMinutes()}</Typography>
                </Box>
            </Box>
        );
    };

    return (
        <>
            {props.perfil.atendente && props.currentChat.chatId &&
                <Box sx={{ mb: 2 }}>
                    <Chip label={<Typography variant="button" component="p">Você está conversando com <b>{props.currentChat.userName}</b> {props.currentChat.identifiedBy ? ' (Identificado por ' + props.currentChat.identifiedBy + ')' : ''}</Typography>} variant="outlined" sx={{py: 2}} />                    
                </Box>
            }

            <Paper id="area_messages" sx={{ py: 2, mb: 2, height: '55vh', overflow: "hidden", overflowY: "scroll", scrollBehavior: 'smooth' }}>
                {props.currentChat.messages.length < 1 &&
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        {
                            props.perfil.atendente === true ?
                                <>
                                    <PersonIcon sx={{ mb: 2, fontSize: 48, color: grey[500] }} />
                                    <Typography component="p" color={grey[500]} variant="button" sx={{ textTransform: "uppercase", fontWeight: "bolder" }}>Selecione um usuário para começar o atendimento</Typography>
                                </>
                                :
                                <>
                                    <CircularProgress sx={{ mb: 4, color: grey[500] }} />
                                    <Typography component="p" color={grey[500]} variant="button" sx={{ textTransform: "uppercase", fontWeight: "bolder" }}>Aguarde ser atendido</Typography>
                                </>
                        }
                    </Box>
                }

                {
                    props.currentChat.messages.map((message) => {
                        if (message.sendedBy == props.perfil.userId) {
                            return sendedMessage(message);
                        } else {
                            return receivedMessage(message);
                        }
                    })
                }
            </Paper>
            <Box component="form" sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    id="standard-textarea"
                    placeholder="Digite aqui sua mensagem..."
                    multiline
                    maxRows={4}
                    fullWidth
                    disabled={props.currentChat.chatId ? false : true}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color='success'
                    title='Enviar mensagem'
                    disabled={props.currentChat.chatId ? false : true}
                    onClick={props.handlerSendMessage}
                >
                    <SendIcon />
                </Button>
            </Box>
            {props.perfil.atendente && props.currentChat.chatId &&
                <Box sx={{my: 4}}>
                <AccordionMensagensProntas
                    title="Mensagens prontas"
                    icon={<NotesIcon sx={{ mr: 1 }} />}
                    insideMessage="Clique em uma mensagem para colar no campo de texto"
                    style={{
                        bgcolor: blueGrey[900],
                        color: "#ffffff"
                    }}
                    listRows={json}
                />
                </Box>
            }
        </>
    )
}