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
// Require the module
var databaseHelper = require('../');
// Create the database object loading data.json if it exists
var myDB = new databaseHelper.JSONDatabase({path : './data.json', transactional : false});
// Drop all existing entries
myDB.remove();

// Dummy data
var dataToInsert = [{id: 1, name:"webinos project", website:"http://www.webinos.org"}];
// Insert data to db
myDB.insert(dataToInsert);
var moreData = [{id: 2, name:"Avi Deitcher", website: "https://github.com/deitch"},{id: 3, name: "jsorm website", website: "http://jsorm.com"}]
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

// Drop the entry with id == 3
query = { field: "id", compare: "equals", value: 3 };
myDB.remove({where: query});

// Check that it droped
result = myDB.query({where: query});
if (result.length == 0)
	console.log("Goodbye entry with id = 3");

