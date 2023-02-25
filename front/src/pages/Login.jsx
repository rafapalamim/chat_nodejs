import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { AppContext } from '../contexts/App';

export default function Login() {

  const appCtx = React.useContext(AppContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    appCtx.showAlert('info', 'Teste');

    const data = new FormData(event.currentTarget);

    const dataForm = {
      email: data.get('email'),
      nome: data.get('nome'),
      identificacao: data.get('identificacao'),
      receberEmail: data.get('receber_email') == 1 ? true : false
    };

    if(dataForm.receberEmail && !dataForm.email){
      appCtx.showAlert('error', 'É necessário informar seu e-mail');
      document.querySelector('#email').focus();
      return;
    }

    console.log(dataForm);

  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bolder' }}>
          CHAT
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome"
            name="nome"
            defaultValue=""
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="identificacao"
            label="Identificação"
            name="identificacao"
            defaultValue=""
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            type="email"
          />
          <FormControlLabel
            control={<Checkbox value="1" color="primary" />}
            name="receber_email"
            label="Desejo receber um e-mail com os detalhes da conversa"
            sx={{ my: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mb: 3 }}
            color="primary"
          >
            Acessar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}