var timeNow = new Date().toLocaleTimeString();
var currentHour = new Date().getHours();
console.log(currentHour)


var options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
};

var clockRunning = setInterval(function() {
    timeNow = new Date().toLocaleTimeString("en-US", options);
    currentHour = new Date().getHours();
    document.getElementById("time").innerHTML = String(timeNow);
    backgroundStatus();
}, 
1000);

function backgroundStatus() {
    if (0 <= currentHour && currentHour <= 5) {
        document.body.className = document.body.className.replace("day", "night")
    } else if (6 <= currentHour && currentHour <= 20) {
        document.body.className = document.body.className.replace("night", "day")
        document.getElementById("timer").className = document.getElementById("timer").className.replace("night-moon", "day-sun")
    } else if (21 <= currentHour && currentHour <= 24) {
        document.body.className = document.body.className.replace("day", "night")
    };
}
// look where the sun is for you and have that determinte background color

// make sure to take GENERAL location (nothing specific) for this