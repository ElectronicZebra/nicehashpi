require = require("esm")(module/*, options*/);
const https = require('https');
const CFonts = require('cfonts');
const chalk = require('chalk');
const log = console.log;

//text style
var style1 = {
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
};

//nicehash config
const conf = {
    apiHost: 'https://api2.nicehash.com', //use https://api2.nicehash.com for production
    apiKey: 'X', //get it here: https://test.nicehash.com/my/settings/keys or https://new.nicehash.com/my/settings/keys
    apiSecret: 'X',
    orgId: 'X',
}

//nicehash Wallet address
var BTCAddress = 'X';

// BTC rate url 
const btc2usd_url = "https://bitpay.com/api/rates";


//global variables
const { default: Api } = require("./api");
let api = new Api(conf);
var totalBTCBalance = 0.0;
var rate = 1;
var wokerDetails = [];
var profitability = 0.00;
var global_error = "";

//display
setInterval(() => {
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
    });
}, 3000);

//BTC to usd rate
setInterval(() => {
    getBTC2USDRate();
}, 1000 * 60 * 30);

//get NH balance
setInterval(() => {
    getNiceHashBalance();
}, 1000 * 60 * 4);

//get worker Details
setInterval(() => {
    getWorkerDetails();
}, 1000 * 10 * 1);

var getBTC2USDRate = function () {
    https.get(btc2usd_url, (res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            try {
                let json = JSON.parse(body);
                //console.dir(json);
                for (var key in json) {
                    if (json[key].code == 'USD') {
                        //console.log(json[key]);
                        rate = json[key].rate;
                        break;
                    }
                }
            } catch (error) {
                global_error += error.message;
            };
        });

    }).on("error", (error) => {
        global_error += error.message;
    });
}

var getNiceHashBalance = function () {
    api.getTime().then(function () {
        api.get('/main/api/v2/accounting/account2/BTC').then(function (res) {
            //console.dir(res);
            totalBTCBalance = res.totalBalance;
        });
    });
}

var getWorkerDetails = function () {
    api.getTime().then(function () {
        api.get('/main/api/v2/mining/external/' + BTCAddress + '/rigs/activeWorkers').then(function (res) {

            wokerDetails = [];
            profitability = 0;
            for (var key in res.workers) {
                var details = {}
                details["rigName"] = res.workers[key].rigName;
                details["speedAccepted"] = res.workers[key].speedAccepted;
                details["unpaidAmount"] = res.workers[key].unpaidAmount;
                details["profitability"] = res.workers[key].profitability;
                profitability += res.workers[key].profitability;
                wokerDetails.push(details);
            }
        });
    });
}

//first call
getBTC2USDRate();
getNiceHashBalance();
getWorkerDetails();