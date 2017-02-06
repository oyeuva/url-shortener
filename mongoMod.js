//var fs = require('fs');
var mongo = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI;


{
    module.exports = function (value, toDo, callback){
        var result = {olink: 123, slink: 456};
        mongo.connect(url, function(err,db){
            if (err) throw err;
            var collection = db.collection('shortUrl');
            
            if(toDo == 'find'){
                collection.findOne({
                    olink: {$eq: value}
                    }, function(err, doc){
                            if (err) throw err;
                            result = doc;
                                console.log('foundOrig: ' + JSON.stringify(result));
                            db.close();
                            callback(result);
                });
            }
            else if(toDo == 'create'){
                var ins = {olink: value,
                        slink: Math.floor(Math.random()*1000)}; 
                
                collection.insert(ins, function(err, data){
                    if (err) throw err;
                    result = ins;
                        console.log('newInsert: ' + JSON.stringify(result));
                    db.close();
                    callback(result);
                });
            }
            else if(toDo == 'redirect'){
                collection.findOne({
                    slink: {$eq: +value}
                    }, function(err, doc){
                            if (err) throw err;
                            result = doc;
                                console.log('foundShort: ' + JSON.stringify(result));
                            db.close();
                            callback(result);
                        
                    });
            }
        });
        //callback(result);
    };
}