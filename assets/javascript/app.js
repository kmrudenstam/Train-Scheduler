// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRBqyme-X89Q6Jn9056EypSE6Ppduh4yo",
    authDomain: "train-scheduler-28596.firebaseapp.com",
    databaseURL: "https://train-scheduler-28596.firebaseio.com",
    projectId: "train-scheduler-28596",
    storageBucket: "train-scheduler-28596.appspot.com",
    messagingSenderId: "999420847926"
};

firebase.initializeApp(config);

// Link to Firebase

var database = firebase.database();

// Button to add trains
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // Grab user input 
    var trainName = $("#name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainStart = moment($("#trainStart-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var trainFreq = $("#frequency-input").val().trim();

    // Create local "temporary" object for holding train data 
    var newTrain = {
        name: trainName,
        destination: trainDest,
        start: trainStart,
        frequency: trainFreq
    };

    // Upload train data to the database
    database.ref().push(newTrain);

    // Log everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);


    // Clear all of the input-fields 
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#trainStart-input").val("");
    $("#frequency-input").val("");

    // Prevent page from refreshing
    //return false;
});

// Create Firebase event for adding train to the database and a row in the HTML when user adds an entry
database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());

    // Store everything into a variable
    var trainName = snapshot.val().name;
    var trainDest = snapshot.val().destination;
    var trainStart = snapshot.val().start;
    var trainFreq = snapshot.val().frequency;


    // Calculate difference between train times
    var difference = moment().diff(moment.unix(trainStart), "minutes");
    // Time remainder/ time until next train arrival
    var timeRemain = moment().diff(moment.unix(trainStart), "minutes") % trainFreq;

    // Caluculate how many minutes away train is
    var minAway = trainFreq - timeRemain;
    // Time for next arrival
    var nextArrival = moment().add(minAway, "m").format("hh:mm A");

    // Create new row and append train info to table on page
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextArrival),
        $("<td>").text(minAway),
    );

    // Append new row to the table
    $("#train-table > tbody").append(newRow);

});
