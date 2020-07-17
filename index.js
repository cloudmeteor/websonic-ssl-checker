const request = require('request');
const r = request.defaults({'proxy':'http://certs.wsonic.net'});

function bad_method(){
	return {
		'isBase64Encoded': false,
		'statusCode': 405,
		'statusDescription': '405 Method Not Allowed',
		'headers': {
			'Content-Type': 'text/plain; charset=UTF-8',
			'Allowed': 'GET'
		},
		'body': 'Error: Only the GET method is allowed.'
	};
}

function proxyResponse(statusCode, statusReason, headers, body){
	return {
		'isBase64Encoded': false,
		'statusCode': statusCode,
		'statusDescription': statusCode +' '+ statusReason,
		'headers': headers,
		'body': body
	};
}

exports.handler = (event, context, callback) => {
    if (event.httpMethod !== 'GET'){
        callback(null, bad_method());
    }
    r.get('http://'+event['headers']['host']+event.path, function(err,httpResponse,body){
        if (err) {
            console.log(err.message);
        } 
        let response = proxyResponse(httpResponse.statusCode, httpResponse.statusMessage, httpResponse.headers, httpResponse.body );
        callback(null, response);
    });
};
