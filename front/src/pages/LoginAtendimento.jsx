import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { AppContext } from '../contexts/App';
import { Chip } from '@mui/material';

export default function LoginAtendimento() {

  const appCtx = React.useContext(AppContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    appCtx.showAlert('info', 'Teste');

    const data = new FormData(event.currentTarget);

    const dataForm = {
      usuario: data.get('usuario'),
      senha: data.get('senha')
    };

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
        <Chip label="Área restrita" variant="filled"  sx={{ fontWeight: 'bolder', my: 2 }} />
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="usuario"
            label="Usuário"
            name="usuario"
            defaultValue=""
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="senha"
            label="Senha"
            name="senha"
            defaultValue=""
            type="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ my: 3 }}
            color="primary"
          >
            Acessar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}