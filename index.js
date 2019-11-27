var pa11y = require('pa11y');
var URLS = require('./URL');
var actions = require('./actions');
var mkdirp = require('mkdirp');

var fs = require('fs');

var options = require('./Options.js');
var urlNames = Object.keys(URLS);
var promises = [];

urlNames.forEach(function(id){
    console.log("First:"+id)
    promises = [];
    options.standards.forEach(function(op){
        var opt = {
            standard : op,
            includeNotices : true,
            includeWarnings : true
        };
        var promise = pa11y(URLS[id], {
            actions: actions[id]
        });
        promises.push(promise);
    });

    console.log("Pa11y started reporting for: ", URLS[id]);

    Promise.all(promises).then(function (values) {

        console.log("Pa11y ran success!!");
        var folderName = getFolderName(values);
        var dir = "output/"+folderName;

        mkdirp(dir, function (err) {
            if (err) console.error(err);

            values.forEach(function (output, index) {
                fs.writeFile("output/"+folderName+'/'+options.standards[index]+".json", JSON.stringify(output), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("Pa11y reports for ",folderName, " against ", options.standards[index], " are saved in output folder!!");
                });
            });

            logCommonErros(values, dir);
        });
    }).catch(function(err){
        console.log("Error while getting report for: ", err);
    });
});


function getFolderName(values) {
    var firstResult = values[0];
    var pageUrl = firstResult.pageUrl;
    var urlNames = Object.keys(URLS);
    for(var i=0; i<urlNames.length;i++) {
        if(URLS[urlNames[i]] === pageUrl)
            return urlNames[i];
    }
}


function logCommonErros(values, folderName) {
    var errors = [];
    values.forEach(function(val){
        val.issues.forEach(function(err){
            if(err.type === 'error') {
                errors.push(err);
            }
        });
    });
    fs.writeFile(folderName+"/common.json", JSON.stringify(values), function(err) {
        if(err) {
            return console.error(err);
        }
        console.log("Common errors are logged!");
        
    });
}