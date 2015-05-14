var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE quote (author varchar(20) primary key , text text not null)');
query.on('end', function(result) { client.end(); });
