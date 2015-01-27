var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.10.50',
  user     : 'search',
  password : '-123search'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();