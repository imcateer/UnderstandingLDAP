var ActiveDirectory = require('activedirectory');

var config = {
	url: 'ldap://corp.maclab.net',
	baseDN: 'dc=corp,dc=maclab,dc=net'
};
var ad = new ActiveDirectory(config);
var username = 'Mike.Jones@corp.maclab.net';
var password = 'Temp2023';

ad.authenticate(username, password, function(err, auth) {
	if (err) {
		console.log('ERROR: '+JSON.stringify(err));
		return;
	}
	if (auth) {
		console.log('Authenticated!');
	}
	else{
		console.log('Authentication failed!');
	}

});
