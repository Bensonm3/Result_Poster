var express = require("express");
var app     = express();
var path    = require("path");
var mysql = require('mysql');
var bodyParser = require('body-parser');
let HTML;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Bensmat08",
  database: "runners_db"
});
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
 async function postResult(name, location, journey, activity, hours, minutes, seconds, total_seconds){
  var sql = "INSERT INTO runners (runner_name, runner_location,runner_distance,activity_type,hours,minutes,seconds,total_seconds) VALUES ('"+name+"', '"+location+"','"+journey+"', '"+activity+"','"+hours+"','"+minutes+"','"+seconds+"','"+total_seconds+"')";
  con.query(sql, function (err, result) {
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
//  async function displayResults(name, location, journey, activity, hours, minutes, seconds, total_seconds){
//     var resultQuery = "SELECT * FROM runners WHERE activity_type='"+activity+"' AND runner_distance='"+journey+"' ORDER BY total_seconds"
//       con.query(resultQuery,(err, result) => {
//       if (err) throw err;
//       try{
//       resultArray = JSON.parse(JSON.stringify(result));
//       console.log(" Display Results: ");
//       console.log(resultArray)
      
//       }
//       catch (error){
        
//         throw error;
//       }
//     }) 
// }
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
    console.log(total_seconds)
  var moment = require('moment');
  var dateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    // res.write('You sent the name "' + req.body.name+'".\n');
    // res.write('You sent the location "' + req.body.location+'".\n');
    // res.write('You sent the journey length "' + req.body.journey+'".\n');
    // res.write('You sent the activity "' + req.body.activity+'".\n');
    // res.write('You sent the hours "' + req.body.hours+'".\n');
    // res.write('You sent the minutes "' + req.body.minutes+'".\n');
    // res.write('You sent the seconds "' + req.body.seconds+'".\n');
    // res.write('You sent total seconds "' +total_seconds+'".\n');

    con.connect(function(err) {
       postResult(name, location, journey, activity, hours, minutes, seconds, total_seconds)
    if (err) throw err;
    });
    var resultQuery = "SELECT * FROM runners WHERE activity_type='"+activity+"' AND runner_distance='"+journey+"' ORDER BY total_seconds"
      setTimeout(function(){con.query(resultQuery,(err, result) => {
      if (err) throw err;
      try{
      resultArray = JSON.parse(JSON.stringify(result));
      console.log(" Display Results: ");
      console.log(resultArray)
      
      }
      catch (error){
        
        throw error;
      }
    console.log("Result Array??")
    console.log(resultArray)
    // let newEntry = [name, location, journey, activity, hours, minutes, seconds, total_seconds]
    // for(i=0; i < resultArray.length; i++){
    //   if(total_seconds < resultArray[i].total_seconds){
    //     resultArray.splice(i, 0, newEntry)
    //   }
    // }
    res.send(resultArray.map(entry =>
      `<p>${entry.runner_name}</p><p>${entry.runner_location}</p>`

    ).join('')
    )
      })
    },10)
  });
  };
  dbConnection();
app.listen(3000);
console.log("Running at Port 3000");
