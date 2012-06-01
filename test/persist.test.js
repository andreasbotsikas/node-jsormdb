// Module requirements
var database = require('../');
var fs = require('fs'),
	path = require('path'),
	assert = require('assert');
	
var testDbPath = './test.json';
var personsDbPath = './personsdb.json';

// Empty any other attempts
if (path.existsSync(testDbPath))
  fs.unlinkSync(testDbPath);

// Initiate empty db
var myDb = new  database.JSONDatabase({path: testDbPath,transactional: false});

console.log("Testing on empty db");
console.log("-------------------");
var inputLine = [{ name: "test", value: "test value"}];
myDb.insert(inputLine);

process.stdout.write("Testing creation of db: ");

assert(path.existsSync(testDbPath),"Database was not created");

var allData = myDb.query();
assert(allData.length == 1, "Found more than one entry");

console.log("OK");

process.stdout.write("Testing simple equals query: ");
var query = { field: "name", compare: "equals", value: "test" };
var results = myDb.db.find({where: query, fields: {name: true, value: true}});
assert(results.length == 1, "Found more than one entry");
assert(results[0].value == "test value", "The inserted value is wrong");
console.log("OK");

console.log("-----------------------------------------");
console.log("Loading personsdb to do some more testing");
console.log("-----------------------------------------");
myDb = new  database.JSONDatabase({path: personsDbPath,transactional: false});

process.stdout.write("Testing query age >= 20: ");
query = {field: "age", compare: "ge", value: 20};
results = myDb.query({where: query, fields: {name: true}});
assert(results[1].name == "Test3", "Failed to query age >= 20");
assert(results.length == 2, "Failed to query age >= 20");
console.log("OK");

process.stdout.write("Testing query name == 'Test3' OR age <= 20: ");
query = {join: "or", terms: [{field: "name", compare: "equals", value: 'Test3'},{field: "age", compare: "le", value: 20}]};
results = myDb.query({where: query});
assert(results[0].name == "Test", "Failed to query name == 'Test3' OR age <= 20");
assert(results[2].name == "Test3", "Failed to query name == 'Test3' OR age <= 20");
assert(results.length == 3, "Failed to query name == 'Test3' OR age <= 20");
console.log("OK");
console.log("----------------------------------------------");
console.log("All tests finished successfuly");
