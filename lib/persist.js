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
	
	// Read data file and insert contents in database engine
	try{
        this.db.insert(JSON.parse(require('fs').readFileSync(this.config.path, 'utf-8')));
	} catch(err) {}
}

/**
 * Insert an arbitrary number of records into the database.
 *
 * @param {Object[]} data. The records to be inserted, an array of JavaScript objects
 */
JSONDatabase.prototype.insert = function(data) {
    "use strict";
	this.db.insert(data);

	// in case no transaction support is required, commit changes immediately
	if(!this.config.transactional) {
		this.commit();
	}
};

/**
 * Remove records from the database.
 * 
 * @param {Object} query. Parameters for the removal.
 * @param {Object} [query.where] Search term, either primitive or composite, to determine which records to remove.
 */
JSONDatabase.prototype.remove = function(query) {
    "use strict";
	this.db.remove(query);
	
	// in case no transaction support is required, commit changes immediately
	if(!this.config.transactional) {
		this.commit();
	}
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
	var results = this.db.find(query);

	return results;
};

/**
 * Rollback a transaction. If given a count, it will reject the last count activities. 
 */
JSONDatabase.prototype.rollback = function(count) {
    "use strict";
	// rollback changes to database since last commit, load, or db creation
	this.db.reject();
};

/**
 * Commit the current transaction.
 */
JSONDatabase.prototype.commit = function() {
    "use strict";
	// commit changes to database since last commit, load, or db creation
	this.db.commit();
	
	// stringify content of database and write to filesystem
	var content = JSON.stringify(this.db.find(), null, 4);
	require('fs').writeFileSync(this.config.path, content);
};

// Export the simple JSONDatabase
exports.JSONDatabase = JSONDatabase;
// Export the original jsormdb
exports.JSORM = require('./jsormdb.js').JSORM;
