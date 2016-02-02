var express = require('express');
var router  = express.Router();

var mongoose    = require('mongoose');
var StationData   = require('../models/stationdata.js');


router.get('/data/:startDate/:endDate',function(req,res,next){
/*     mongoose.set('debug', true); */
	var start = new Date(req.params.startDate);
	var end = new Date(req.params.endDate);
	var matchVariable ={};
	matchVariable['executionTime'] = {$gte :start, $lte :end};
	var query = [
        {$match : matchVariable}]
	StationData.aggregate(query,function(err,data){ 
		if(err) res.json(err);
		else{
				res.header("Access-Control-Allow-Origin", "*");   
				res.json(data);
		}
	});   
});
	
router.get('/aggregate',function(req,res,next){

		query = [
        {$unwind :  "$stationBeanList"},
        {$match  : { 
              "stationBeanList.availableBikes" : { $lt :  1},
							"stationBeanList.statusValue" : { $eq : "In Service"}
        }},
        {$project:{
						_id	 			 	 : "$stationBeanList.stationName",
						latitude 		 : "$stationBeanList.latitude",
						longitude 	 : "$stationBeanList.longitude"
            },    
        },
				{ $group : { _id : "$_id", 
										latitude : { $last: "$latitude"},
										longitude : { $last: "$longitude"},
										count: { $sum: 1 } } 
				},
    ];
		
		StationData.aggregate(query, function (err, result) {
        if (err) return next(err);
				res.header("Access-Control-Allow-Origin", "*");   
        res.send(JSON.stringify(result));
    });
	});

router.get('/month/:month',function(req,res,next){
		var thisMonth = new Date(req.params.month);
		var lastMonth = new Date(req.params.month);
		lastMonth.setMonth(lastMonth.getMonth()-1);
		query = [
        {$unwind :  "$stationBeanList"},
        {$match  : { 
              "stationBeanList.availableBikes" : { $lt :  1},
							"stationBeanList.statusValue" : { $eq : "In Service"},
							"executionTime": {$gte : lastMonth , $lte:thisMonth},
        }},
        {$project:{
						_id	 			 	 : "$stationBeanList.stationName",
						latitude 		 : "$stationBeanList.latitude",
						longitude 	 : "$stationBeanList.longitude"
            },    
        },
				{ $group : { _id : "$_id", 
										latitude : { $last: "$latitude"},
										longitude : { $last: "$longitude"},
										count: { $sum: 1 } } 
				},
    ];
		
		StationData.aggregate(query, function (err, result) {
        if (err) return next(err);
				res.header("Access-Control-Allow-Origin", "*");   
        res.send(JSON.stringify(result));
    });
	});

// Update collection data
router.post('/update', function(req,res,next){

    var query = {executionTime: req.body.executionTime};
    var update = {$push:{stationBeanList:req.body.stationBeanList[0]}};

    StationData.update(query,update,{upsert:false},function(err, response,status){
         if(err){
           res.json({'submission_results':response});
         }
        else if (response.n===0){
          StationData.create(req.body,function(err, response,status){
            if (err){
              res.json({'submission_results':response});
            }
            else{
              res.json({'submission_results':response});
            }
          });
          
        }
        else{
         	res.json({'submission_results':response});
         }
     });
});

module.exports = router;
