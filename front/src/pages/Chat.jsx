import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Container, Divider } from '@mui/material';

import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/App';
import { SocketContext } from '../contexts/Socket';
import AccordionArea from './parts/AccordionArea';
import ListArea from './parts/ListArea';
import { grey } from '@mui/material/colors';
import ChatArea from './parts/ChatArea';

export default function Chat() {

    console.log('Renderizando componente...');
    const [perfil, setPerfil] = React.useState({
        name: null,
        atendente: null,
        userId: null,
        chatId: null
    });
    const [listAtendimentos, setListaAtendimentos] = React.useState(new Map());
    const [listUsuarios, setUsuarios] = React.useState({
        clientes: [],
        atendentes: []
    });

    const [currentChat, setCurrentChat] = React.useState({
        userName: null,
        identifiedBy: null,
        chatId: null,
        messages: [],
        startAt: null
    });

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

    /** Atendente aceitando o chat */
    const handleJoinChat = (e) => {
        const chatId = e.currentTarget.getAttribute('data-id');
        console.log('JoinChat: ', chatId);
        socket.emit('chat:join', chatId);
        socket.emit('chat:enter', chatId);
    };

    /** Mudar chat atual */
    const handleChangeChat = (e) => {
        const chatId = e.currentTarget.getAttribute('data-id')
        console.log('ChangeRoom: ', chatId);

        var newMessages = localStorage.getItem('CHAT_NEW_MESSAGES') !== null ? JSON.parse(localStorage.getItem('CHAT_NEW_MESSAGES')) : {};

        if (newMessages.hasOwnProperty(chatId)) {
            delete newMessages[chatId];
            localStorage.setItem('CHAT_NEW_MESSAGES', JSON.stringify(newMessages));
        }

        socket.emit('chat:enter', chatId);
    };

    /** Copiar e colar mensagens prontas */
    const handlePasteMessage = (e) => {
        console.log('PasteMessage: ', e.currentTarget);
    };

    /** Transferir chat para outro atendende */
    const handleTransferChat = (e) => {
        console.log('TransferChat: ', e.currentTarget.getAttribute('data-id'));
    }

    /** Enviar mensagem */
    const handleSendMessage = (e) => {
        e.preventDefault();
        const input = document.querySelector('textarea');
        const message = input.value;

        if (!message) {
            input.focus();
            return;
        }

        console.log('SendMessage: ', message);

        const messageData = {
            message: message,
            chatId: currentChat.chatId
        };

        socket.emit('chat:message:send', messageData);
        input.value = '';
        input.focus();
    }

    /** Executar assim que carregar a tela de chat (enquanto 'perfil.atendente' for null) */
    if (perfil.atendente === null) {
        console.log('Consultando perfil...');
        socket.emit('perfil:busca');
        socket.on('perfil:retorno', (atendente) => {
            setPerfil(atendente);
        });
    }

    if (perfil.atendente !== null) {
        console.log('Liberando escutas do socket...');

        socket.on('lista:usuarios', (msg) => {
            console.log('Recebendo lista de usuários e atendentes...');
            setUsuarios(msg);
        });

        socket.on('chat:list', (list) => {
            console.log('Recebendo lista de atendimentos atuais...');
            setListaAtendimentos(new Map(Object.entries(list)));
        });

        socket.on('chat:in', (data) => {
            setCurrentChat({
                userName: data.user.name,
                identifiedBy: data.user.identifiedBy,
                chatId: data._id,
                messages: data.messages,
                startAt: data.startAt
            });
        });

        socket.off('chat:message:receive').on('chat:message:receive', (message) => {
            if (message._id == currentChat.chatId) {
                setCurrentChat({
                    userName: message.user.name,
                    identifiedBy: message.user.identifiedBy,
                    chatId: message._id,
                    messages: message.messages,
                    startAt: message.startAt
                });
            } else {
                if (localStorage.getItem('CHAT_NEW_MESSAGES') !== null) {
                    var newMessages = JSON.parse(localStorage.getItem('CHAT_NEW_MESSAGES'))
                } else {
                    var newMessages = {};
                }

                newMessages[message._id] = newMessages.hasOwnProperty(message._id) ? newMessages[message._id] + 1 : 1;
                localStorage.setItem('CHAT_NEW_MESSAGES', JSON.stringify(newMessages));
                setListaAtendimentos(new Map([...listAtendimentos]));
            }
        });
    }

    return (
        <Container sx={{ mt: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {perfil.atendente === null ?
                        <Grid item xs={3}></Grid>
                        :
                        <>
                            <Grid display={perfil.atendente === true ? 'block' : 'none'} item xs={3}>
                                <AccordionArea
                                    title="Atendentes on-line"
                                    icon={<SupportAgentIcon sx={{ mr: 1 }} />}
                                    insideMessage="Para transferir, clique no atendente"
                                    style={{
                                        bgcolor: grey[900],
                                        color: "#ffffff"
                                    }}
                                    listRows={listUsuarios.atendentes}
                                    handlerEvent={handleTransferChat}
                                />
                                <Divider sx={{ my: 3 }} />
                                <ListArea
                                    titleIcon={<ChatBubbleIcon sx={{ mr: 1 }} />}
                                    titleText="Em atendimento"
                                    listIcon={<PersonIcon />}
                                    listText="João"
                                    listRows={listUsuarios.clientes}
                                    handlerEvent={handleChangeChat}
                                    keyPrefix="on_"
                                    listRooms={listAtendimentos}
                                    atendenteId={perfil.userId}
                                />
                                <Divider sx={{ my: 2 }} />
                                <ListArea
                                    titleIcon={<HourglassBottomIcon sx={{ mr: 1 }} />}
                                    titleText="Fila de espera"
                                    listIcon={<PersonIcon />}
                                    listText="Renata"
                                    listRows={listUsuarios.clientes}
                                    handlerEvent={handleJoinChat}
                                    keyPrefix="wait_"
                                    listRooms={listAtendimentos}
                                    atendenteId={perfil.userId}
                                />
                            </Grid>
                        </>
                    }
                    <Grid item xs={perfil.atendente === true ? 9 : 12}>
                        <ChatArea currentChat={currentChat} perfil={perfil} handlerSendMessage={handleSendMessage} />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}