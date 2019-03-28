$(document).ready(function () {

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
    //var trainData = new Firebase ("https://train-scheduler-28596.firebaseio.com");
    var database = firebase.database();
    
    // Button to add trains
    $("#add-train").on("click", function (event) {
        event.preventDefault();

        // Grab user input 
        var trainName = $("#name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var trainTimeInput = $("#train-time-input").val().trim();
        var frequencyInput = $("#frequency-input").val().trim();

        // Create local "temporary" object for holding train data 
        var newTrain = {
            name: trainName,
            destination: destination,
            trainTime: trainTimeInput,
            frequency: frequencyInput
        };

        // Upload train data to the database
        database.ref().push(newTrain);

        // Log everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.trainTime);
        console.log(newTrain.frequency);


        // Clear all of the input-fields 
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#train-time-input").val("");
        $("#frequency-input").val("");
    
      // Prevent page from refreshing
      return false;
    
    });

    // Create Firebase event for adding train to the database and a row in the HTML when user adds an entry
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a variable
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var trainTimeInput = childSnapshot.val().trainTime;
        var frequencyInput = childSnapshot.val().frequency;

        console.log(trainName);
        console.log(destination);
        console.log(trainTimeInput);
        console.log(frequencyInput);


        //var diffTime = moment().diff(moment.unix(trainTimeInput), "minutes");
        var timeRemainder = moment().diff(moment.unix(trainTimeInput), "minutes") % frequency;
        var minutes = frequency - timeRemainder;

        var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");

        // Test for correct times & info
        console.log(minutes);
        console.log(nextTrainArrival);
        console.log(moment().format("hh:mm A"));
        console.log(nextTrainArrival);
        console.log(moment().format("X"));

        // Append train info to table on page
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(trainTime),
            $("<td>").text(frequency),
        );

        // Append new row to the table
        $("#train-table > tbody").append(newRow);

    });

});
