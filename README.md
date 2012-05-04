# node-jsormdb

This is a wrapper node module for the jsorm database (http://jsorm.com/).
It adds the required package.json file in order to include it in node.

## Usage

var databasehelper = require('JSORMDB');
var myDB = new databasehelper.JSONDatabase({path : pathToFile, transactional : false});
myDB.insert(dataToInsert);