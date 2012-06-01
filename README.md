# jsormdb node module (node-jsormdb)

This is a wrapper node module for the [jsorm database](http://jsorm.com/) done by [Avi Deitcher](https://github.com/deitch).
It also exposes a simple JSONDatabase to automate the persisting of the database to the disk.

## Building from source

Clone the repository in a jsormdb folder inside a node_module directory.
``` bash
git clone git://github.com/andreasbotsikas/node-jsormdb.git jsormdb
git submodule update 
```
_Note:_ jsormdb (in the src folder) is linked to this repo and requires "submodule update" to update from the [original repository](https://github.com/deitch/jsormdb).

### Getting jsormdb

[Avi Deitcher's](https://github.com/deitch) [jsorm database](http://jsorm.com/) can be either [downloaded from the official website](http://jsorm.com/wiki/Download) or be compiled from source.

If you want to skip building, go to http://jsorm.com/wiki/Download and download jsormdb archive. Place the jsormdb.js in the lib folder and you are ready to go. 

If you want to build the jsormdb.js just run [ant](http://ant.apache.org/) in the root of this repository. 
``` bash
jsormdb> ant 
```

## Usage

The module exposes two objects:
 * JSORM: The jsorm object as described in its own [wiki page](http://jsorm.com/wiki/Jsormdb)
 * JSONDatabase: A simple database wrapper to persist the changes automatically on the hard disk

Since the JSORM object has not been modified at all, the best resource on using it is the [official website](http://jsorm.com/) and the [dedicated wiki page](http://jsorm.com/wiki/Jsormdb). 

JSONDatabase object has a simple constructor that takes an optional configuration object as a parameter. 
The configuration object has the following optional fields:

 * path: path to the database file. Default './database.json'.
 * transactional: Set database in transactional mode. Requires commit of insert and remove operations in order to persist in database. Defaults to false.
 * debug: Set database in debug mode. Defaults to false.

The JSONDatabase object exposes the following simple functions:
 * insert( object[] ): Inserts an array of objects in the db. Persists it if not in transactional mode. Internally it uses jsormdb's insert.
 * remove( query ): Removes the items matching the provided ['where' query](http://jsorm.com/wiki/Jsormdb). Internally it uses jsormdb's remove.
 * query ( query ): Search by [query](http://jsorm.com/wiki/Jsormdb). Returns an array of records. Internally it uses jsormdb's find.
 * rollback: Rollback all changes since last commit. Internally it uses jsormdb's reject.
 * commit: Commit existing transaction and persist changes to the disk file. Internally it uses jsormdb's commit. 

For query syntax check [jsormdb's wiki page](http://jsorm.com/wiki/Jsormdb).

The JSONDatabase object exposes the internal jsormdb through its db property.

## Examples

The following examples are located in the examples folder and you can test them by running:
``` bash
jsormdb/examples> node JSONDatabase.js
jsormdb/examples> node JSORM.js
```

### JSONDatabase

``` javascript
// Require the module
var databaseHelper = require('jsormdb');
// Create the database object loading data.json if it exists
var myDB = new databaseHelper.JSONDatabase({path : './data.json', transactional : false});
// Drop all existing entries
myDB.remove();
// Dummy data
var dataToInsert = [{id: 1, name:"webinos project", website:"http://www.webinos.org"}];
// Insert data to db
myDB.insert(dataToInsert);
var moreData = [
	{id: 2, name:"Avi Deitcher", website: "https://github.com/deitch"},
	{id: 3, name: "jsorm website", website: "http://jsorm.com"}
];
// Insert data to db
myDB.insert(moreData);
// Get all data
var result = myDB.query(); // Equivelant to myDB.db.find();
// Display them
console.log("The db has the following entries:");
console.log(result);

// Query for the first entry
var query = { field: "id", compare: "equals", value: 1 };
// The following is quivelant to myDB.db.find({where: query});
result = myDB.query({where: query});
console.log("The " + result[0].name + "'s website is : " + result[0].website);

// Query for the Avi's github url and pick only that field
query = { field: "name", compare: "contains", value: "Avi" };
var fields = { website: true };
// The following is quivelant to myDB.db.find({where: query, fields: fields});
result = myDB.query({where: query, fields: fields});
process.stdout.write("Avi Deitcher's github url is ");
console.log(result[0].website);

// Remove entry with id==3
myDB.remove({where: { field: "id", compare: "equals", value: 3 }});
```

Please refer to the excellent [jsormdb wiki](http://jsorm.com/wiki/Jsormdb) for querying details and for advanced use of the jsormdb database.

### JSORM

The same example applies but instead of using:
``` javascript
var myDB = new databaseHelper.JSONDatabase({path : './data.json', transactional : false});
```
use:
``` javascript
var myDB = new databaseHelper.JSORM.db.db({parser: databaseHelper.JSORM.db.parser.json(), writeMode: databaseHelper.JSORM.db.db.modes.replace});
```
and instead of the query method call find.

## Disclaimer

This code was initially written for the purposes of the [webinos project](http://www.webinos.org). 
It is distributed freely under the [Apache 2.0 license](www.apache.org/licenses/LICENSE-2.0).

All the hard work of creating the jsormdb is done solely by [Avi Deitcher](https://github.com/deitch).

A special thank you is in order to the following webinos members: 
 * [Heiko Desruelle](https://github.com/heiiko) for bringing the jsormdb module idea and writting the initial implementation.
 * [Christos Ntanos](https://github.com/cntanos) for adding this module to the webinos platform and testing it thoroughly.
