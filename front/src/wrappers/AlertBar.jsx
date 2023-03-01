import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { AppContext } from '../contexts/App';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertBar(props) {

  const appCtx = React.useContext(AppContext);  

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    appCtx.hideAlert();
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={props.options.open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
        <Alert onClose={handleClose} severity={props.options.severity} sx={{ width: '100%' }}>
          {props.options.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}