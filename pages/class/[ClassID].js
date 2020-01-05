import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import App from '../../components/App.js';

import {
	Typography
} from '@material-ui/core';

export default function() {
	const router = useRouter();
	const [session, setSession] = React.useState({
					userLogged: false,
					username: ''});
	React.useEffect(() => {
		axios.get("/api/getSession").then(({ data }) => {
			setSession(data);
		});
	}, []);

	let render = (
		<Typography variant="h1">{router.query.ClassID}</Typography>
	);
	
	return <App userLogged={session.userLogged} username={session.username} payload={render} />
}
