var mysql      = require('mysql');
const siteConfig = require('../../siteConfig.json')

export default (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	res.statusCode = 200

	var connection = mysql.createConnection(siteConfig['db-secrets']);
	connection.connect(function(err) {
		if (err) {
			console.log('connection failed!')
			res.end(JSON.stringify({status : "error" , id : undefined}));
			return;
		}
		console.log('connected as id ' + connection.threadId);
		res.end(JSON.stringify({status : "connected", id: connection.threadId}))

	});

	connection.end()
}
