import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function UserAutocomplete(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await axios.get('/api/getUsers');
      if(response.data.error){
	   setOptions([]);
	   return;
      }
      const users= response.data.users;

      if (active) {
        setOptions(users);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      style={{ width: '100%' }}
      open={open}
      onChange={props.onChange}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.LegalName === value.LegalName || option.UserID === value.UserID}
      getOptionLabel={option => option.UserID + "(" + option.LegalName + ")"}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
	  error={props.error}	  
          label="User Incharge"
          fullWidth
	  variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
