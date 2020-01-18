var mysql = require("mysql");
const siteConfig = require("../siteConfig.json");

// A hackaround to avoid constructing a new pool on every require.
if(typeof global.SQLJSPool == 'undefined'){
	global.SQLJSPool = mysql.createPool(siteConfig["db-config"]);
}

var pool = global.SQLJSPool;

var getConnection = function(callback) {
  pool.getConnection(function(err, con) {
    callback(err, con);
  });
};

module.exports = getConnection;
