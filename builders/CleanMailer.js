const nodemailer = require('nodemailer');

function CleanMailer() {

	var transporter;

	try{

		// transporter = nodemailer.createTransport({
	 //        service: 'Gmail',
	 //        auth: {
	 //            user: 'jsel.robot@gmail.com', // Your email id
	 //            pass: 'jsel@info' // Your password
	 //        }
	 //    });

	    transporter = nodemailer.createTransport({
		    host: 'smtp.zoho.com',
		    port: 465,
		    secure: true, // use SSL
		    auth: {
		        user: 'robot@jsel.info',
		        pass: 'jsel@info'
		    }
		});

	}catch(e) {	}


	if(transporter){
		
		this.sendMail = function(options, callback) {

			var baseMail = 'robot@jsel.info';
			// var baseMail = 'jsel.robot@gmail.com';

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