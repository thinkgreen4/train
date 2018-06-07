$(document).ready(function(){
// 1. Initialize Firebase
//fix arrival order and the order it appears in the table so it goes the right spot. Also make sure to do the math so it calculates correct time for minutes away and arrival

var config = {
    apiKey: "AIzaSyCL5jE1FAtoK6fEBFeZa9CXfKq0B-qtHxk",
    authDomain: "train-9dd03.firebaseapp.com",
    databaseURL: "https://train-9dd03.firebaseio.com",
    projectId: "train-9dd03",
    storageBucket: "",
    messagingSenderId: "397640451683"
  };


firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var arrival = $("#arrival-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

        // Creates local "temporary" object for holding employee data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            arrival: arrival,
            frequency: frequency
        };


          // Uploads employee data to the database
            database.ref().push(newTrain);

            console.log(newTrain);
            console.log(newTrain.name);
            console.log(newTrain.destination);
            console.log(newTrain.arrival);
            console.log(newTrain.frequency);

         // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());
     // Store everything into a variable.
     var firetrainName = childSnapshot.val().name;
     var firetrainDestination = childSnapshot.val().destination;
     var firearrival = childSnapshot.val().arrival;
     var firefrequency = childSnapshot.val().frequency;

     //time math
	var freq = parseInt(firefrequency);
	//Current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment().format('HH:mm'));

    var dConverted = moment(childSnapshot.val().arrival, 'HH:mm').subtract(1, 'years');;
    console.log("DATE CONVERTED: " + dConverted);
    
	var trainTime = moment(dConverted).format('HH:mm');
    console.log("TRAIN TIME : " + trainTime);
  
    var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');;
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("DIFFERENCE IN TIME: " + tDifference);
	//Remain
	var tRemainder = tDifference % freq;
    console.log("TIME REMAINING: " + tRemainder);
    //minutes away
	var minsAway = freq - tRemainder;
	console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
	//Next arrival
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));

      // Add each train's data into the table
    $("#trainTable > tbody").append("<tr><td>" + firetrainName + "</td><td>" + firetrainDestination + "</td><td>" +
    freq + "(min)" + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + minsAway + "</td></tr>");
},

    function (errorObject){
        console.log("Read failed: " + errorObject.code)
    });
});
