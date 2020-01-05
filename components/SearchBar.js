import React from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function SearchBar(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await axios.get("/api/getSearchBarData");
      if(response.data.error){
	      if(active){
		      setOptions([]);
	      }
	      return;
      }
      const opt = response.data.data;

      if (active) {
        setOptions(opt);
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
      style={{ width: "100%" }}
      open={open}
      onChange={props.onChange}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) =>
        option.title === value.title || option.instructor === value.instructor
      }
      getOptionLabel={option => option.title + "(" + option.instructor + ")"}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          color="inherit"
          error={props.error}
          fullWidth
          placeholder="Search"
          variant="standard"
          InputProps={{
            ...params.InputProps,
            style: { paddingLeft: "45px", paddingTop: "4px" },
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}
