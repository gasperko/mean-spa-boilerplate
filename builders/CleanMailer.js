const nodemailer = require('nodemailer');

function CleanMailer() {

	var transporter;

	try{

	    transporter = nodemailer.createTransport({
		    host: 'smtp.zoho.com',
		    port: 465,
		    secure: true, // use SSL
		    auth: {
		        user: '<EMAIL>',
		        pass: '<PASS>'
		    }
		});

	}catch(e) {	}


	if(transporter){
		
		this.sendMail = function(options, callback) {

			var baseMail = '<EMAIL>';

			var mailOptions = {
			    from: '"JSEL Robot" <' + baseMail + '>', // sender address
			    to: options.to || '', // list of receivers
			    subject: options.subject || '', // Subject line
			    html: options.body || '' // html body
			};

			return transporter.sendMail(mailOptions, callback);

		};
		
	}else{

		this.sendMail = function() {};

	}

}

module.exports = CleanMailer;