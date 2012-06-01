/*******************************************************************************
*  Code contributed by the webinos project
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
describe('JSORMDB', function() {
    var database = require('../../lib/persist.js');
    var database_object;
    
    beforeEach(function() {
        database_object = new database.JSONDatabase({path: '../personsdb.json',transactional: false});
    });
    
    it('Query field >= value', function() {
        var query = {field: "age", compare: "ge", value: 20};
        var results = database_object.query({where: query, fields: {name: true}});
        expect(results[1].name).toEqual("Test3");
    });
    
    it('Conjunction-join query field1 == value1 OR field2 <= value2', function() {
        var query = {join: "or", terms: [{field: "name", compare: "equals", value: 'Test'},{field: "age", compare: "le", value: 25}]};
        var results = database_object.query({where: query});
        expect(results[0].name).toEqual("Test");
        expect(results[3].name).toEqual("Test3");
    });
});

