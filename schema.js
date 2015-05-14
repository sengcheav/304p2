var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query ('drop table quote');
query = client.query('CREATE TABLE quote (id int primary key , author varchar(20) not null , text text not null)');
query.on('end', function(result) { client.end(); });
