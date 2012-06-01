// Module requirements
var database = require('../');
var fs = require('fs'),
	path = require('path'),
	assert = require('assert');

var testDbPath = './test.json';

// Empty any other attempts
if (path.existsSync(testDbPath))
  fs.unlinkSync(testDbPath);

// Initiate db
var myDb = new  database.JSONDatabase({path: testDbPath,transactional: false});


var inputLine = { name: "test", value: "test value"};
myDb.insert(inputLine);

assert(path.existsSync(testDbPath),"Database was not created");

var allData = myDb.query();

assert(allData.length != 1, "Found more than one entry");

var query = { field: "name", compare: "eq", value: "test" };
var results = myDb.db.find({where: query, fields: {name: true}});
assert(results.length != 1, "Found more than one entry");
assert(results[0].value != "test value", "The inserted value is wrong");

