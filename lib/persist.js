/*******************************************************************************
*  Code contributed to the webinos project
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* Copyright 2012 Andreas Botsikas, webinos project <http://www.webinos.org>
*
*******************************************************************************/
/** 
 * @constructor
 * Create new JSONDatabase
 *
 * @param {Object} [config] Optional configuration parameter.
 * @param {Object} [config.path] path to the database file. Default './database.json'.
 * @param {Object} [config.transactional] Set database in transactional mode. 
 *                                        Requires commit of insert- and remove operation. 
 *                                        Off by default.
 * @param {Object} [config.debug] Set database in debug mode. Off by default.
 */
function JSONDatabase(config) {
    "use strict";
	var db_engine, param;
    
	// Merge default configuration settings with provided config
	this.config = {path: './database.json', transactional: false, debug: false};
    
	for(param in  config) {
		if(config.hasOwnProperty(param)) {
			this.config[param] = config[param];
		}
	}

	// Initialize JSORM database engine
	db_engine = require('./jsormdb.js');
	this.db = db_engine.JSORM.db.db({parser: db_engine.JSORM.db.parser.json(), writeMode: db_engine.JSORM.db.db.modes.replace});
	
	// Keep the fs module handy
	this.fs = require('fs');
	
	// Read data file and insert contents in database engine
	try{
		if (require('path').existsSync(this.config.path))
			this.db.insert(JSON.parse(this.fs.readFileSync(this.config.path, 'utf-8')));
		else if (this.config.debug)
			console.log("Databse file does NOT exist");
	} catch(err) {
		console.log("An error occured loading db file:");
		console.log(err);
	}
	
	if (this.config.debug)
		console.log("JSONDatabase initialized");
	
}

/**
 * Insert an arbitrary number of records into the database.
 *
 * @param {Object} force. Force save without checking if in transactional mode
 */
JSONDatabase.prototype._writeToDisk = function(force){
	// in case no transaction support is required, write changes immediately
	if(force||!this.config.transactional) {
		if (this.config.debug)
			console.log("Persisting changes to database file.");
		// stringify content of database and write to filesystem
		var content = JSON.stringify(this.db.find(), null, 4);
		this.fs.writeFileSync(this.config.path, content);
	}
};

/**
 * Insert an arbitrary number of records into the database.
 *
 * @param {Object[]} data. The records to be inserted, an array of JavaScript objects
 */
JSONDatabase.prototype.insert = function(data) {
    "use strict";
	if (this.config.debug){
		console.log("Inserting the following data:");
		console.log(data);
	}
	this.db.insert(data);
	this._writeToDisk(false);
};

/**
 * Remove records from the database.
 * 
 * @param {Object} query. Parameters for the removal.
 * @param {Object} [query.where] Search term, either primitive or composite, to determine which records to remove.
 */
JSONDatabase.prototype.remove = function(query) {
    "use strict";
	if (this.config.debug){
		console.log("Removing based on the following query:");
		console.log(query);
	}	
	this.db.remove(query);
	this._writeToDisk(false);
};

/**
 * Search by query. Returns an array of records. 
 * No matches will return an empty array; invalid query will return null.
 *
 * @param {Object} query. Search parameters
 * @param {Object} query.where. Proper query term, either composite or primitive
 * @param {Object} [query.fields] Fields to return. This is an object literal. 
 *                                All fields that are set to non-null and 
 *                                have a match will return those fields. 
 *                                Returns all fields if null.
 * @returns {Object[]} Array of the matched records
 */ 
JSONDatabase.prototype.query = function(query) {
    "use strict";
	if (this.config.debug){
		console.log("Executing the following query:");
		console.log(query);
	}
	var results = this.db.find(query);
	if (this.config.debug){
		console.log("Found the following results:");
		console.log(results);
	}
	return results;
};

/**
 * Rollback a transaction. If given a count, it will reject the last count activities. If given no count,
 * a count of 0, or a count greater than the total number of activities in this transaction, it will
 * reject the entire transaction.
 * 
 * @param {Integer} count Number of steps within the transaction to reject. If empty, 0, or greater than the 
 *   total number of steps, the entire transaction will be rejected. 
 */
JSONDatabase.prototype.rollback = function(count) {
    "use strict";
	if (this.config.debug){
		console.log("Rolling back database. Count is:");
		console.log(count);
	}
	// rollback changes to database since last commit, load, or db creation
	this.db.reject(count);
};

/**
 * Commit the current transaction.
 */
JSONDatabase.prototype.commit = function() {
    "use strict";
	if (this.config.debug)
		console.log("Commiting changes to the database.");
	// commit changes to database since last commit, load, or db creation
	this.db.commit();
	this._writeToDisk(true);
};

// Export the simple JSONDatabase
exports.JSONDatabase = JSONDatabase;
// Export the original jsormdb
exports.JSORM = require('./jsormdb.js').JSORM;
// Add version info
exports.version = require('../package').version
