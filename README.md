# jsorm node module (node-jsormdb)

This is a wrapper node module for the jsorm database (http://jsorm.com/).
It also exposes a simple JSONDatabase to automate the persisting of the database to the disk.

## Building from source

Clone the repository in a jsormdb folder inside a node_module directory.
``` bash
git clone git://github.com/andreasbotsikas/node-jsormdb.git jsormdb
git submodule update 
```
_Note:_ jsormdb (in the src folder) is linked to this repo and requires "submodule update" to update from the [original repository](https://github.com/deitch/jsormdb).

Run [ant](http://ant.apache.org/) to build jsormdb from source and apply the node module patch
``` bash
ant 
```

Test by running the 


## Usage

The module exposes a JSONDatabase object that takes an optional configuration object as a parameter. 
The configuration object has the following optional fields:

 * path: path to the database file. Default './database.json'.
 * transactional: Set database in transactional mode. Requires commit of insert and remove operations in order to persist in database. Defaults to false.
 * debug: Set database in debug mode. Defaults to false.

The JSONDatabase object exposes the following simple functions:
 * insert( object[] ): Inserts an array of objects in the db. Persists it if not in transactional mode. Internally it uses jsormdb's insert.
 * remove( query ): Removes the items matching the provided ['where' query](http://jsorm.com/wiki/Jsormdb). Internally it uses jsormdb's remove.
 * query ( query ): Search by [query](http://jsorm.com/wiki/Jsormdb). Returns an array of records. Internally it uses jsormdb's find.
 * rollback: Rollback all changes since last commit. Internally it uses jsormdb's reject.
 * commit: Commit existing transanction and persist changes to the disk file. Internally it uses jsormdb's commit. 

For query syntax check [jsormdb's wiki page](http://jsorm.com/wiki/Jsormdb).

The JSONDatabase object exposes the internal jsormdb through its db property.

## Example

``` javascript
var databasehelper = require('jsormdb');
var myDB = new databasehelper.JSONDatabase({path : './data.json', transactional : false});
myDB.insert(dataToInsert);
```

Please refer to the excelent [jsormdb wiki](http://jsorm.com/wiki/Jsormdb) for querying details and for advanced use of the jsormdb database.

## Disclaimer

This code was initially written for the purposes of the [webinos project](http://www.webinos.org). 
It is distributed freely under the [Apache 2.0 license](www.apache.org/licenses/LICENSE-2.0).