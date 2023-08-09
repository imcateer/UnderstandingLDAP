const express = require('express');
const app = express ();
const cors = require('cors');
const ActiveDirectory = require('activedirectory');


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
	const {username, password } = req.body;

ad.authenticate(username, password, function(err, auth) {
	if (auth) {
		res.sendStatus(200);
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
