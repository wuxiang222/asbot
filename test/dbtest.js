var db = require('../db');

db.execute("create table users2(id int, name varchar(20) )",function(result){

  console.log(result);

});

