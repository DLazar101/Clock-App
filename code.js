//
// Code: Sunrise-Sunset-JS by udivankin https://github.com/udivankin/sunrise-sunset//
//

const DEFAULT_ZENITH = 90.8333;
/**
 * Degrees per hour
 */
const DEGREES_PER_HOUR = 360 / 24;
/**
 * Msec in hour
 */
const MSEC_IN_HOUR = 60 * 60 * 1000;
/**
 * Get day of year
 */
function getDayOfYear(date) {
    return Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 8.64e7);
}
/**
 * Get sin of value in deg
 */
function sinDeg(deg) {
    return Math.sin(deg * 2.0 * Math.PI / 360.0);
}
/**
 * Get acos of value in deg
 */
function acosDeg(x) {
    return Math.acos(x) * 360.0 / (2 * Math.PI);
}
/**
 * Get asin of value in deg
 */
function asinDeg(x) {
    return Math.asin(x) * 360.0 / (2 * Math.PI);
}
/**
 * Get tan of value in deg
 */
function tanDeg(deg) {
    return Math.tan(deg * 2.0 * Math.PI / 360.0);
}
/**
 * Get cos of value in deg
 */
function cosDeg(deg) {
    return Math.cos(deg * 2.0 * Math.PI / 360.0);
}
/**
 * Get ramainder
 */
function mod(a, b) {
    const result = a % b;
    return result < 0
        ? result + b
        : result;
}
/**
 * Calculate Date for either sunrise or sunset
 */
function calculate(latitude, longitude, isSunrise, zenith, date) {
    const dayOfYear = getDayOfYear(date) + 1;
    const hoursFromMeridian = longitude / DEGREES_PER_HOUR;
    const approxTimeOfEventInDays = isSunrise
        ? dayOfYear + ((6 - hoursFromMeridian) / 24) 
        : dayOfYear + ((12 - hoursFromMeridian) / 24);
    const sunMeanAnomaly = (0.9856 * approxTimeOfEventInDays) - 3.289;
    const sunTrueLongitude = mod(sunMeanAnomaly + (1.916 * sinDeg(sunMeanAnomaly)) + (0.020 * sinDeg(2 * sunMeanAnomaly)) + 282.634, 360);
    const ascension = 0.91764 * tanDeg(sunTrueLongitude);
    let rightAscension;
    rightAscension = 360 / (2 * Math.PI) * Math.atan(ascension);
    rightAscension = mod(rightAscension, 360);
    const lQuadrant = Math.floor(sunTrueLongitude / 90) * 90;
    const raQuadrant = Math.floor(rightAscension / 90) * 90;
    rightAscension = rightAscension + (lQuadrant - raQuadrant);
    rightAscension /= DEGREES_PER_HOUR;
    const sinDec = 0.39782 * sinDeg(sunTrueLongitude);
    const cosDec = cosDeg(asinDeg(sinDec));
    const cosLocalHourAngle = ((cosDeg(zenith)) - (sinDec * (sinDeg(latitude)))) / (cosDec * (cosDeg(latitude)));
    const localHourAngle = isSunrise
        ? 360 - acosDeg(cosLocalHourAngle)
        : acosDeg(cosLocalHourAngle);
    const localHour = localHourAngle / DEGREES_PER_HOUR;
    const localMeanTime = localHour + rightAscension - (0.06571 * approxTimeOfEventInDays) - 6.622;
    const time = mod(localMeanTime - (longitude / DEGREES_PER_HOUR), 24);
    
    // Modified Code to get the current day's sunset. Was previously sunridse today and sunset yesterday //
    const utcMidnight = isSunrise
    ? Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    : Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    // Created date will be set to local (system) time zone.
    return new Date(utcMidnight + (time * MSEC_IN_HOUR));
}
/**
 * Calculate Sunrise time for given longitude, latitude, zenith and date
 */
function getSunrise(latitude, longitude, date = new Date()) {
    return calculate(latitude, longitude, true, DEFAULT_ZENITH, date);
}
/**
 * Calculate Sunset time for given longitude, latitude, zenith and date
 */
function getSunset(latitude, longitude, date = new Date()) {
    let answer = calculate(latitude, longitude, false, DEFAULT_ZENITH, date)
    return calculate(latitude, longitude, false, DEFAULT_ZENITH, date);
}
//
// end code by udivankin https://github.com/udivankin/sunrise-sunset //
//


// Sunrise Sunset Time //

let sunriseTimeLocal
let sunsetTimeLocal
let sunriseTime
let sunsetTime

let successCallback = (position) => {
    sunriseTimeLocal = getSunrise(position.coords.latitude, position.coords.longitude).toLocaleTimeString();
    sunsetTimeLocal = getSunset(position.coords.latitude, position.coords.longitude).toLocaleTimeString();
    sunriseTime = getSunrise(position.coords.latitude, position.coords.longitude);
    sunsetTime = getSunset(position.coords.latitude, position.coords.longitude);
    document.getElementById("userLocation").innerHTML = `Sunrise: ${sunriseTimeLocal} <br> Sunset: ${sunsetTimeLocal}`
};
let errorCallback = (error) => {
    document.getElementById("userLocation").innerHTML = error.message;
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

// time information //

let displayTime = new Date;
let currentTime = new Date;

let options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
};

let clockRunning = setInterval(function() {
    displayTime = new Date().toLocaleTimeString("en-US", options);
    currentTime = new Date;
    document.getElementById("time").innerHTML = String(displayTime);
    backgroundStatus();
}, 
1000);

function backgroundStatus() {
    if (currentTime <= sunriseTime) {
        document.body.className = document.body.className.replace("day", "night")
    } else if (sunriseTime <= currentTime && currentTime <= sunsetTime) {
        document.body.className = document.body.className.replace("night", "day")
        document.getElementById("timer").className = document.getElementById("timer").className.replace("night-moon", "day-sun")
    } else if (sunsetTime <= currentTime) {
        document.body.className = document.body.className.replace("day", "night")
    };
};