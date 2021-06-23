var express = require("express");
var app     = express();
var path    = require("path");
var mysql = require('mysql');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if(process.env.JAWSDB_URL){
  connection = mysql.createConnection(process.env.JAWSDB_URL); 
  } else {
      connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "@Bensmat08",
      database: "runners_db"
});}
// connection.connect();
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
 async function postResult(name, location, journey, activity, hours, minutes, seconds, total_seconds){
  var sql = "INSERT INTO runners (runner_name, runner_location,runner_distance,activity_type,hours,minutes,seconds,total_seconds) VALUES ('"+name+"', '"+location+"','"+journey+"', '"+activity+"','"+hours+"','"+minutes+"','"+seconds+"','"+total_seconds+"')";
  connection.query(sql, function (err, result) {
  //     displayResults(name, location, journey, activity, hours, minutes, seconds, total_seconds,function(result){
  //     console.log("Posted Result")
  //     console.log(result)
  //  });
   console.log("write Results: ")
      console.log(result);
    if(err){  //we make sure theres an error (error obj)

          if(err.errno==1062){


          throw err;

      }
          else{
              throw err;
          res.end();
        }
  }
  
  // for(i=0; i < resultList.length; i++){
  //   res.write("| Name: "+resultList.runner_name+"| Location: "+resultList.runner_location+"| Distance: "+resultList.runner_distance+"| Activity: "+resultList.activity_type+"| Time: "+resultList.hours+":"+resultList.minutes+":"+resultList.seconds+" |")
  // }
    console.log("1 record inserted");
    //  res.end();
  });
}
let resultArray
function dbConnection(){
  app.post('/',function(req,res){
    HTML = req.body.formHTML;
    var name=req.body.name;
    var location=req.body.location;
    var journey=req.body.journey;
    var activity=req.body.activity;
    var hours = req.body.hours;
    var minutes = req.body.minutes;
    var seconds = req.body.seconds;
    var total_seconds = +req.body.seconds+(+req.body.hours*3600)+(+req.body.minutes*60);
    console.log("time:"+hours+":"+minutes+":"+seconds)
  var moment = require('moment');
    connection.connect(function(err) {
       postResult(name, location, journey, activity, hours, minutes, seconds, total_seconds)
    if (err) throw err;
    });
    var resultQuery = "SELECT * FROM runners WHERE activity_type='"+activity+"' AND runner_distance='"+journey+"' ORDER BY total_seconds"
      setTimeout(function(){connection.query(resultQuery,(err, result) => {
      if (err) throw err;
      try{
        resultArray = JSON.parse(JSON.stringify(result));
        }
        catch (error){
          throw error;
        }
    
      for(i=0; i < resultArray.length; i++){
        if(parseInt(resultArray[i].hours,10)<10){
          resultArray[i].hours ='0'+resultArray[i].hours;
          }
        if(parseInt(resultArray[i].minutes,10)<10){
        resultArray[i].minutes ='0'+resultArray[i].minutes;
          }
        if(parseInt(resultArray[i].seconds,10)<10){
        resultArray[i].seconds ='0'+resultArray[i].seconds;
          }
        }

    
    res.send(`<h1>2021 Max-a-thon Results</h1><table><tr><th>Name</th><th>location</th><th>Distance</th><th>Activity</th><th>Time</th></tr>`+resultArray.map(entry =>
      `<tr><td>${entry.runner_name} </td><td>${entry.runner_location}</td><td>${entry.runner_distance} Miles</td><td>${entry.activity_type}</td><td>${entry.hours}:${entry.minutes}:${entry.seconds}</td></tr>`

    ).join('')+`</table>`
    )
      })
    },10)
  });
  };
  dbConnection();
  app.listen(PORT, function() {
    console.log("App now listening at localhost:" + PORT);
  });
