var express = require('express');
var http = require('http');
var app = express();
var request = require('request');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const URL_BACKEND = 'http://138.68.36.225:80';
const URL_FRONTEND_FAKE = 'http://138.197.233.166';
const URL_FRONTEND_FAKE_HOST = 'api.timelogbook.com';


app.options('/*', function (req, res) {
    var options = {
        'method': 'OPTIONS',
        'url': URL_BACKEND + req.originalUrl,
        'headers': JSON.parse(postProcessHeaders(req))
    };
    executeMethod(options,res);
});

app.post('/*', function (req, res, next) {
    var options = {
        'method': 'POST',
        'url': URL_BACKEND + req.originalUrl,
        'headers': JSON.parse(postProcessHeaders(req))
    };
    if (options.headers['content-type'] == 'application/json') {
        options.body = JSON.stringify(req.body)
    }
    else {
        options.form = req.body
    }
    executeMethod(options,res);
});

app.put('/*', function (req, res, next) {
    var options = {
        'method': 'PUT',
        'url': URL_BACKEND + req.originalUrl,
        'headers': JSON.parse(postProcessHeaders(req))
    };
    if (options.headers['content-type'] == 'application/json') {
        options.body = JSON.stringify(req.body)
    }
    else {
        options.form = req.body
    }
    executeMethod(options,res);
});

app.delete('/*', function (req, res, next) {
    var options = {
        'method': 'DELETE',
        'url': URL_BACKEND + req.originalUrl,
        'headers': JSON.parse(postProcessHeaders(req))
    };
    if (options.headers['content-type'] == 'application/json') {
        options.body = JSON.stringify(req.body)
    }
    else {
        options.form = req.body
    }
    executeMethod(options,res);
});

app.get('/*', function (req, res, next) {
    var options = {
        'method': 'GET',
        'url': URL_BACKEND + req.originalUrl,
        'headers': JSON.parse(postProcessHeaders(req))
    };
    executeMethod(options,res);
});

function executeMethod(options,res){
    request(options, function (error, response) {
        if (!error) {
            setResponseHeader(res);
            res.status(response.statusCode);
            res.send(response.body);
        } else {
            res.send('Error');
        }
    });
}

function setResponseHeader(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('access-control-allow-headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Qtoken');
    res.setHeader('access-control-allow-methods', 'OPTIONS,POST,GET,PUT,DELETE,PATCH,HEAD');
    res.setHeader('Cache-Control', 'max-age=5');
}

/**
 * Remplaza las url locales por las fakes.
 */
function postProcessHeaders(req) {
    let headersStr = JSON.stringify(req.headers)
    for (let index = 0; index < 20; index++) {
        headersStr = headersStr.replace("http://localhost:4200", URL_FRONTEND_FAKE);
    }
    headersStr = headersStr.replace('localhost:3000', URL_FRONTEND_FAKE_HOST);
    return headersStr;
}

app.listen(8080);
