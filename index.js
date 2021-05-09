require = require("esm")(module/*, options*/);
const https = require('https');
const CFonts = require('cfonts');
const chalk = require('chalk');
const log = console.log;
const { apiConf, btcAddress ***REMOVED*** = require('./config')

//text style
const style1 = {
    font: 'block',              // define the font face
    align: 'center',              // define text alignment
    colors: ['greenBright'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1,           // define letter spacing
    lineHeight: 1,              // define the line height
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '0',             // define how many character can be on one line
    gradient: false,            // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false,  // define if this is a transition between colors directly
    env: 'node'                 // define the environment CFonts is being executed in
***REMOVED***;

// BTC rate url 
const btc2usd_url = "https://bitpay.com/api/rates";

//global variables
const { default: Api ***REMOVED*** = require("./api");
let api = new Api(apiConf);
let totalBTCBalance = 0.0;
let rate = 1;
let wokerDetails = [];
let profitability = 0.00;
let global_error = undefined;
let BTC2USD_error = undefined;

// Interval timer
const timer = {
    displayRefresh: 3000, // 3 sec
    btc2USDRate: 1000 * 60 * 30, // 30 min
    niceHashBalance: 1000 * 60 * 5, // 5 min
    workerDetails: 1000 * 10 * 1 // 10 sec
***REMOVED***

//display
const display = setInterval(() => {
    console.clear();
    dp = Math.round(rate * profitability * 100) / 100;
    CFonts.say('$' + dp, style1);
    log(chalk.whiteBright.bgRed('Wallet'));
    log(chalk.green.bold('BTC : ') + chalk.green.bold(totalBTCBalance) + chalk.gray.bold(' | ') + chalk.green.bold('USD : ') + chalk.green.bold('$ ' + Math.round(rate * totalBTCBalance * 100) / 100));
    console.log(' ');
    log(chalk.whiteBright.bgRed('Workers'));
    wokerDetails.forEach(w => {
        log(
            chalk.yellow.bold(w.unpaidAmount) + chalk.gray.bold(' | ')
            + chalk.green.bold('$ ' + (Math.round(rate * w.profitability * 100) / 100).toFixed(2)) + chalk.gray.bold(' | ')
            + chalk.blue.bold(w.rigName) + chalk.gray.bold(' @ ') + chalk.redBright.bold((Math.round(w.speedAccepted * 100) / 100).toFixed(2))
        )
    ***REMOVED***);
    if (global_error !== undefined)
        log(chalk.whiteBright.bgRed('Error:') + global_error);
    if (BTC2USD_error !== undefined)
        log(chalk.whiteBright.bgRed('Error: Cannot get BTC2USD Rate:') + BTC2USD_error);
***REMOVED***, timer.displayRefresh);

const getBTC2USDRate = function () {
    https.get(btc2usd_url, (res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        ***REMOVED***);
        res.on("end", () => {
            try {
                let json = JSON.parse(body);
                BTC2USD_error = 'BTC to USD rate not found!';
                for (var key in json) {
                    if (json[key].code == 'USD') {
                        //console.log(json[key]);
                        rate = json[key].rate;
                        BTC2USD_error = undefined;
                        break;
                    ***REMOVED***
                ***REMOVED***
            ***REMOVED*** catch (error) {
                BTC2USD_error = error.message;
            ***REMOVED***;
        ***REMOVED***);

    ***REMOVED***).on("error", (error) => {
        BTC2USD_error = error.message;
    ***REMOVED***);
***REMOVED***

const getNiceHashBalance = function () {
    api.getTime().then(function () {
        api.get('/main/api/v2/accounting/account2/BTC').then(function (res) {
            totalBTCBalance = res.totalBalance;
            global_error = undefined;
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***

const getWorkerDetails = function () {
    api.getTime().then(function () {
        api.get('/main/api/v2/mining/external/' + btcAddress + '/rigs/activeWorkers').then(function (res) {
            wokerDetails = [];
            profitability = 0;
            for (var key in res.workers) {
                var details = {***REMOVED***
                details["rigName"] = res.workers[key].rigName;
                details["speedAccepted"] = res.workers[key].speedAccepted;
                details["unpaidAmount"] = res.workers[key].unpaidAmount;
                details["profitability"] = res.workers[key].profitability;
                profitability += res.workers[key].profitability;
                wokerDetails.push(details);
                global_error = undefined;
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***);
***REMOVED***

//first call
getBTC2USDRate();
getNiceHashBalance();
getWorkerDetails();

//BTC to usd rate
const btc2USDRateInterval = setInterval(() => {
    getBTC2USDRate();
***REMOVED***, timer.btc2USDRate);

//get NH balance
const niceHashBalanceInterval = setInterval(() => {
    getNiceHashBalance();
***REMOVED***, timer.niceHashBalance);

//get worker Details
const workerDetailsInterval = setInterval(() => {
    getWorkerDetails();
***REMOVED***, timer.workerDetails);

//prevent crashing
process.on('uncaughtException', function (err) {
    global_error = err.message;
***REMOVED***);