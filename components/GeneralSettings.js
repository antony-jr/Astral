import React from 'react';
import axios from 'axios';

import { useSnackbar } from 'notistack';


import {
	TextField,
	ExpansionPanelDetails,
	ExpansionPanelActions,
	Button,
	Typography,
	Box
} from '@material-ui/core';

export default function GeneralSettings(props){
	const [failed, setFailed] = React.useState(false);
	const [settings, setSettings] = React.useState({ 
		academicFromYear: '',
		academicToYear: ''
	});
	const { enqueueSnackbar } = useSnackbar();
	
	React.useEffect(() => {
		handleReset();
	}, []);

	const handleFromYearChange = e => {
		// Only allow numbers
		if(!isNaN(e.target.value)){
			setSettings({...settings, academicFromYear: e.target.value}); 
		}
	}
	const handleToYearChange = e => {
		// Only allow numbers
		if(!isNaN(e.target.value)){
			setSettings({...settings, academicToYear: e.target.value}); 
		}
	}

	const handleSave = () => {
		const params = new URLSearchParams();
		params.append('fromAcademicYear', settings.academicFromYear);
		params.append('toAcademicYear', settings.academicToYear);
		axios
		.post('/api/setAcademicYear', params)
		.then(({data}) => {
			if(data.error){
				setFailed(true);	
				enqueueSnackbar("Save failed, please try again.", {variant: "error"});
			}else{
				setFailed(false);
				enqueueSnackbar("Saved General Settings" , {variant: "success"});
			}
		});

	}

	const handleReset = () => {
		axios
		.get('/api/getAcademicYear')
		.then(({data}) => {
			if(data.error){
				setFailed(true);
				enqueueSnackbar("Cannot retrive data from backend." , {variant: "error"});
				console.log(data);
			}else{
				setSettings({...settings, academicFromYear: data.fromAcademicYear.toString(), academicToYear: "" + data.toAcademicYear.toString()}); 
	
			}
		});
	}

	return (
	<React.Fragment>
	<ExpansionPanelDetails container>	
	<Box style={{width: '100%'}}flexDirection="column" >	
	<TextField
            error={failed}
            margin="dense"
            id="academicFromYear"
            label="From Academic Year"
            type="text"
            fullWidth
            value={settings.academicFromYear}
            onChange={handleFromYearChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                handleSave();
                ev.preventDefault();
              }
            }}
         />
	 <TextField
            error={failed}
            margin="dense"
            id="academicToYear"
            label="To Academic Year"
            type="text"
            fullWidth
            value={settings.academicToYear}
            onChange={handleToYearChange}
            onKeyPress={ev => {
              if (ev.key == "Enter") {
                handleSave();
                ev.preventDefault();
              }
            }}
    />	
    </Box>
	</ExpansionPanelDetails>
	<ExpansionPanelActions>
          <Button size="small" onClick={handleReset}>Reset</Button>
          <Button size="small" color="primary" onClick={handleSave}>
            Save
          </Button>
        </ExpansionPanelActions>	
	</React.Fragment>);
}

