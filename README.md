# node-jsormdb

This is a wrapper node module for the jsorm database (http://jsorm.com/).
It adds the required package.json file in order to include it in node.

## Cloning the repo

Note that jsormdb is linked to this repo so after cloning do a 

'''
git submodule update
'''

to update jsormd.

## Usage

The module exposes a JSONDatabase object that takes an optional configuration object as a parameter. The configuration object has the following optional fiels:
	path: path to the database file. Default './database.json'.
	transactional: Set database in transactional mode. Requires commit of insert and remove operation. Defaults to false.
	debug: Set database in debug mode. Defaults to false.
	
The JSONDatabase object exposes the internal jsormdb through its db property.

## Example

'''
var databasehelper = require('JSORMDB');
var myDB = new databasehelper.JSONDatabase({path : pathToFile, transactional : false});
myDB.insert(dataToInsert);
'''