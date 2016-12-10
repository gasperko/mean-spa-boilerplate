'use strict';

function parseBase64(data) {
	if(!data){
		return '';
	}
	var buffer = new Buffer(data, 'base64');
	return JSON.parse(buffer.toString());
}


exports.parseBase64 = parseBase64;