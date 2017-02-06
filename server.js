var express = require('express');
var path = require('path');
var app = express();
var mongoMod = require('./mongoMod.js');

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/new/:link*', function(req,res){
    var link = req.url.substr(5);
    //check for valid link
    var check = isUrl(link);
    if(!check){
        res.end('Not A Valid URL: ' + link);
    }
    //find in db .. if found return with shorturl.. 
    else {
       mongoMod(link, 'find', cb);
        console.log('link is:' + link);
    }
    function cb(result){
        if(result){
            delete result['_id'];
            result.slink = 'heroku/' + result.slink;
            res.send(JSON.stringify(result));
        }
        //else create new db entry for link
        else {
            mongoMod(link, 'create', function(result){
                delete result['_id'];
                result.slink = 'heroku/' + result.slink;
                res.send(JSON.stringify(result));
            });
        }
    }
});

app.get('/:short', function(req,res){
    var short = req.params.short;
    //find in db.. if found .. redirect to original
    mongoMod(short, 'redirect', cb2);
    function cb2(result){
        if(result){
            res.redirect(result.olink);
        }
        else {res.send('shorty not found');}
    }
    //else error
});

function isUrl(str) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
   return regexp.test(str);
}

app.listen(process.env.PORT|| 8080, function(){
    console.log('port is 8080!');
});