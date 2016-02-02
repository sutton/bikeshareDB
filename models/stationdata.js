var mongoose = require('mongoose');


var data = new mongoose.Schema({
    availableDocks: Number,
    totalDocks: Number,
    city: String,
    altitude: String,
    stAddress2: String,
    longitude: Number,
    lastCommunicationTime: Date,
    postalCode: String,
    statusValue: String,
    testStation: Boolean,
    stAddress1: String,
    stationName: String,
    landMark: String,
    latitude: Number,
    statusKey: Number,
    availableBikes: Number,
    id: Number,
    location: String
});   
    
var StationData = new mongoose.Schema({

		executionTime:Date,

    stationBeanList:[data]    
});

StationData.index({executionTime:-1});

module.exports = mongoose.model('StationData', StationData);
