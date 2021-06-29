const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
function goBack(){
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'index.html'));
        
      });
}
// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
  
});
app.use(bodyParser.urlencoded({ extended: true }));
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
async function postResult(name, location, journey, activity, hours, minutes, seconds, total_seconds){
    var sql = "INSERT INTO runners (runner_name, runner_location,runner_distance,activity_type,hours,minutes,seconds,total_seconds) VALUES ('"+name+"', '"+location+"','"+journey+"', '"+activity+"','"+hours+"','"+minutes+"','"+seconds+"','"+total_seconds+"')";
    connection.query(sql, function (err, result) {
     console.log("write Results: ")
        console.log(result);
      if(err){ 
        if(err.errno==1062){
            throw err;
        }
            else{
                throw err;
            res.end();
          }
    }
      console.log("1 record inserted");
    });
  }

  let resultArray
function dbConnection(){
  app.post('/results',function(req,res){
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
    
    res.send(`<h1>2021 Max-a-thon Results</h1><h2>`+journey+" Mile "+activity+`</h2><h3>`+"&#127939"+`</h3><table><tr><th>Name</th><th>Location</th><th>Distance</th><th>Activity</th><th>Time</th></tr>`+resultArray.map(entry =>
      `<tr><td>${entry.runner_name} </td><td>${entry.runner_location}</td><td>${entry.runner_distance} Miles</td><td>${entry.activity_type}</td><td>${entry.hours}:${entry.minutes}:${entry.seconds}</td></tr>`

    ).join('')+`<button id="submit" action="*" method="get" type="submit" required="True" value="submit" onclick="goBack()" name="submit">Return</button></table>`
    )
      })
    },100)
  });
  };
  dbConnection();
  app.listen(port, function() {
    console.log("App now listening at localhost:" + port);
  });