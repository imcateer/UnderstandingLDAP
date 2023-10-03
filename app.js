const express = require('express');
//const https = require('https');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql');
const ActiveDirectory = require('activedirectory');
const mongoose = require("mongoose");

const app = express();

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



var connection = mysql.createConnection({
	host: '10.1.0.109',
	user: 'iga',
	password: 'Maclabs1234',
	database: 'Users'
}); 

connection.connect(function(err){
	if(!err){
		console.log("DB is connected");
	}
	else{
		console.log(err);
	}
});

//var sslRootCAs = require('ssl-root-cas');
//sslRootCAs.inject(); 

// var privateKey = fs.readFileSync( '/etc/ssl/finalKey.key' )
// var certificate = fs.readFileSync( '/etc/ssl/finalKey.cer' )

// http.createServer({
//	key: privateKey,
//	cert: certificate
// } , app).listen(3000);

var config = {
	url: 'ldap://10.1.0.115' ,
	baseDN: 'dc=corp,dc=maclab,dc=net'
}; 

var ad = new ActiveDirectory(config);
 
app.use(cors({
    origin: '*'}));
    app.use(express.json());
  

   app.listen(3000, () => {
	console.log("Server listening on PORT:");
  });

 

app.get("/status", (request, response) => {
	const status = {
		"Status": "Running"
	}; 
	response.send(status);
});

app.post("/authenticate", (req, res) => {
  const {username, password} = req.body;
ad.authenticate(username, password, async function(err, auth) {
	if (auth) {
		console.log(username);
	        connection.query("SELECT * FROM users WHERE email = '"+username+"'",
            function(error, result, fields){
		 if (result.length > 0){
			 res.send("Existing Account Login");
			 console.log("existing")
                 }
	         else{
			connection.query("INSERT INTO users (email) VALUES ('"+username+"')",
		         function(error, results, fields){
			  if(error){
			            console.log(error);
		           }
			   else{
		        	res.send("Email did not exist, adding to DB");
			        console.log("new");
                           }
		          }
			);}
          });
	}
	else{
                res.sendStatus(401);
		if (err) {
		console.log('ERROR: '+JSON.stringify(err));
		return;
	        }
	}
  });
});
