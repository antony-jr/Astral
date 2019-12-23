var mysql = require("mysql");
const siteConfig = require("../siteConfig.json");

var pool = mysql.createPool(siteConfig["db-config"]);

var getConnection = function(callback) {
  pool.getConnection(function(err, con) {
    callback(err, con);
    if (!err && con) {
      if (typeof con.release != "undefined") {
        con.release();
      }
    }
  });
};

module.exports = getConnection;
