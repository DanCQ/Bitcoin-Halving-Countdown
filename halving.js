const footer = document.querySelector('footer');
const fixedItem = document.querySelector('.background-img');
const halving = document.getElementById("halving-block");
const halvingDate = document.getElementById("halving-date");
const height = document.getElementById("current-block-height");
const remaining = document.getElementById("remaining-blocks");
const timeEstimate = document.getElementById("time-estimate");


//multiple block height APIs for redundancy
const apiArray = [
    {
        name: "Blockchair",
        url: 'https://api.blockchair.com/bitcoin/stats'
    },
    {
        name: "Blockchain",
        url: 'https://blockchain.info/q/getblockcount'
    },
    {
        name: "Blockstream",
        url: "https://blockstream.info/api/blocks/tip/height"
    }
];


//async function can handle tasks that take some time to complete
async function getCurrentBlockHeight() {

    function isNumber(value) { //is value a number; true, or false
        return typeof(value) === 'number' && isFinite(value); //not NaN, or infinite
    }

    for(let api of apiArray) {
        try {
            let response = await fetch(api.url); //waits grab data before moving on
            let data = await response.json(); //waits to convert data in a workable format

            console.log(api.name , data); //view JS console to see data retrieved

            if(api.url == 'https://api.blockchair.com/bitcoin/stats') {

                if(isNumber(data.data.blocks)) {
                    return data.data.blocks; //the current block number
                }

            } else if (api.url == 'https://blockchain.info/q/getblockcount' || api.url == 'https://blockstream.info/api/blocks/tip/height') {

                if(isNumber(data)) {
                    return data; //the current block number
                }
            } 

        } catch (error) { //if data could not be retrieved
            console.error(`Error fetching current block height from: ${api.name}, ${error.message}`);
            //continues to the next API in case of an error
            //"throw error" not used, it would exit the loop
        }
    }

    console.error(`Error fetching current block height from all APIs!`); // If no APIs succeed
    throw error; //returns an empty display
}


//totalMinutes value provided later
function calculateCountdown(totalMinutes) {

    const oneYearInMinutes = 365 * 24 * 60;
    const oneDayInMinutes = 24 * 60;
    const oneHourInMinutes = 60;
  
    let years = Math.floor(totalMinutes / oneYearInMinutes); 
    let days = Math.floor((totalMinutes % oneYearInMinutes) / oneDayInMinutes);
    let hours = Math.floor((totalMinutes % oneDayInMinutes) / oneHourInMinutes);
    let minutes = Math.floor(totalMinutes % oneHourInMinutes);

    halvingCalendarDate(); //future calendar day of the halving
    updateCountdown(); //grammar for estimated time of halving

    //future calendar day of the halving
    function halvingCalendarDate() {

        const monthArray = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const weekdayArray = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        let currentDate = new Date(); // Get the current date and time

        let totalDays = calculateTotalDays(years);

        let futureDate = new Date(
            currentDate.getTime() + //current time in milliseconds
            (totalDays * 24 * 60 * 60 * 1000) + //total days in milliseconds
            (days * 24 * 60 * 60 * 1000) + //days in milliseconds
            (hours * 60 * 60 * 1000) + //hours in milliseconds
            (minutes * 60 * 1000) //minutes in milliseconds
        );

        let day = futureDate.getDate(); //future day
        let month = monthArray[futureDate.getMonth()]; //future month
        let weekday = weekdayArray[futureDate.getDay()]; //future weekday
        let year = futureDate.getFullYear(); //future year

        halvingDate.textContent = `${weekday}, ${month} ${day}, ${year}`;
    } 


    //year becomes 366 days, if currently in a leap year
    function calculateTotalDays(numOfYears) {
        let totalDays = numOfYears * 365;

        //true if leap year, false if not
        function isLeapYear(year) {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        } 
        
        for (let year = new Date().getFullYear(); year <= new Date().getFullYear() + numOfYears; year++) {
            if (isLeapYear(year)) {
                totalDays++;
            }
        }
        return totalDays;
    }


    //grammar for estimated time of halving
    function updateCountdown() {

        function setCountdown() {
            
            //resets on interval
            let count = "";
            let m, h = false; //used to add commas

            //corrects grammar
            function plural(num, noun) {

                if(num > 1) {
                    if(years > 0) { //corrects grammar for days > 999
                        return `${formatNumberWithCommas(num)} ${noun}s`;
                    } else {
                        return `${num} ${noun}s`;
                    }
                    
                } else {
                    return `${num} ${noun}`;
                }
            }
    
            //values added only if above zero
            if(minutes > 0) {
                count = plural(minutes, 'minute');
                m = true;
            } 
            if (hours > 0) {
                if(m) {
                    count = `${plural(hours, 'hour')}, ${count}`;
                } else {
                    count = plural(hours, 'hour');
                }
                h = true;
            } 
            if (days > 0) {
                if (years > 0) { //because days matter more than years ;)
                    if(m || h) {
                        count = `${plural(days + calculateTotalDays(years), 'day')}, ${count}`;
                    } else {
                        count = plural(days + calculateTotalDays(years), 'day');
                    }
                } else {
                    if(m || h) {
                        count = `${plural(days, 'day')}, ${count}`;
                    } else {
                        count = plural(days, 'day');
                    }
                }
            } 
            return count;
        }
        
        timeEstimate.textContent = setCountdown();
    } 
}


function calculateRemainingBlocks(currentBlock, halvingInterval = 210000) {
    return halvingInterval - (currentBlock % halvingInterval);
}


//estimation 'cause blocks are formed about every 10 minutes
function estimateTimeRemaining(remainingBlocks, averageBlockTime = 10) {
    return remainingBlocks * averageBlockTime;
}


function formatNumberWithCommas(number) {
    // Convert the number to a string
    const numString = number.toString();

    // Split the string into integer and decimal parts
    const [integerPart, decimalPart] = numString.split('.');

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+$)/g, ',');
    /*  
    \B: This is a zero-width assertion, asserting that the position is not a word boundary.
    (?=(\d{3})+$) A positive lookahead assertion, ensures the position is followed by a multiple of three digits (denoted by \d{3}) until the end of the string ($). 
    This effectively looks ahead in the string to find positions before groups of three digits without consuming them.
    /g: This flag indicates that the regular expression should be applied globally, it will replace all occurrences of the pattern in the string, not just the first one.
    */

    // If decimalPart exists(true), combine the formatted integer part with the decimal part; else, only assign integer.
    const formattedNumber = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;

    return formattedNumber;
}


//should never fail, if getCurrentBlockHeight succeeded
async function setDisplay() {
    try {
        let currentBlockHeight = await getCurrentBlockHeight(); //nested async
        let remainingBlocks = calculateRemainingBlocks(currentBlockHeight);

        let halvingBlock = currentBlockHeight + remainingBlocks;
        let remainingTime = estimateTimeRemaining(remainingBlocks);

        halving.textContent = formatNumberWithCommas(halvingBlock);
        height.textContent = formatNumberWithCommas(currentBlockHeight);
        remaining.textContent = formatNumberWithCommas(remainingBlocks);

        //here since remainingTime is local scope value + main() will be an interval
        calculateCountdown(remainingTime);
        
        getTransactions(); // smallest and biggest transactions

    } catch (error) {
        console.error(`Error occurred in setDisplay(), ${error.message}`);
    }
}


//Coinlore Priceticker Widget --adds HTML from inside JavaScript--
function coinloreTicker() {

    let jqElement;

    //if jQuery library not defined or if jQuery version is not "1.4.2"
    if (void 0 === window.jQuery || "1.4.2" !== window.jQuery.fn.jquery) {
        
        let jLibr = document.createElement("script"); //create it
        
        jLibr.setAttribute("type", "text/javascript"),
        jLibr.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"),
        //Checks readyState property
        jLibr.readyState ? jLibr.onreadystatechange = function() { 

            //set onreadystatechange event to call okeyDokey() when script loads
            "complete" != this.readyState && "loaded" != this.readyState || okeyDokey() 

         //readyState don't exist, set up onload event call okeyDokey() when script loads, append script to document
        } : jLibr.onload = okeyDokey, (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(jLibr)

     //jQuery already defined and version "1.4.2", calls tickerStyle()
    } else jqElement = window.jQuery, tickerStyle();
    
    
    function okeyDokey() { //allows multiple versions of jQuery without interference

        jqElement = window.jQuery.noConflict(!0), tickerStyle();
        //noConflict releases control of the $ to other libraries??
        //(!0) true, also returns control of the jQuery var to previous owner??
    }


    //price ticker customization using jQuery.
    function tickerStyle() {
        jqElement(document).ready( (element) => {

            let color; //gain or loss percentage
            let ccolor = "black"; //coin name
            let pcolor = 'goldenrod'; //coin price
            let scolor = "steelblue"; //coin abbreviation
            let symbol;
            

            element(".coinlore-priceticker-widget").each(function() { 

                element.get("https://widget.coinlore.com/widgets/top-list/?top=" + 
                element(this).attr("data-top") + "&cur=" + 
                element(this).attr("data-mcurrency"), 

                function(ticker) { 
                
                    let cc = `<div class="marqueecoinlore">`; //opening div, class found in css
                    
                    ticker.forEach(function(entry) { 
                        symbol = '';
                        
                        if(entry.percent_change_24h < 0) {
                            color = '#830000!important'; //red loss
                        } else {
                            color = '#007700!important'; //green gain
                            symbol = '+';
                        }
                        
                        //coin hypertext link
                        cc += `<a href="https://www.coinlore.com/coin/${entry.nameid}" target="_blank">` +

                        `<img src="https://c1.coinlore.com/img/25x25/${entry.nameid}.png">` +  //coin icon image

                        `<span style = "color: ${ccolor}"> ${entry.name} </span>` +  //coin name
                        `<span style = "color: ${scolor}"> (${entry.symbol}) </span>` +  //coin abbreviation

                        `<span style = "color: ${pcolor}"> ${entry.price_usd}` +  //coin price
                        `<span style = "font-size:10px">${entry.mc} </span></span>` +  //usd

                        `<span style = "color: ${color}">  (${symbol}${entry.percent_change_24h}%) </span> </a>`;
                        //percentage gain or loss
                    });
                    
                    cc += '</div>'; //closing div

                    //set HTML content of selected element to value stored in cc variable
                    element(".coinlore-priceticker-widget").html(cc);
                })
            })
        })
    }
}


//gets current BTC exchange rate in USD with the coindesk API
async function getExchangeRate() {
    try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        const data = await response.json(); //.json() improves data reability
        const exchangeRateUSD = data.bpi.USD.rate_float;

        return exchangeRateUSD;
       
    } catch (error) {  //if it failed to get it
        console.error(`Could not retrieve echange rate, ${error.message}`);
        return null;
    }
}


// Determine the value scale (million, billion, trillion, etc.)
function formatAmount(amount) {
    
    const formattedAmount = amount.toLocaleString();
    
    if (amount >= 1e33) {
        return `${formattedAmount} Decillion`;
    } else if (amount >= 1e30) {
        return `${formattedAmount} Nonillion`;
    } else if (amount >= 1e27) {
        return `${formattedAmount} Octillion`;
    } else if (amount >= 1e24) {
        return `${formattedAmount} Septillion`;
    } else if (amount >= 1e21) {
        return `${formattedAmount} Sextillion`;
    } else if (amount >= 1e18) {
        return `${formattedAmount} Quintillion`;
    } else if (amount >= 1e15) {
        return `${formattedAmount} Quadrillion`;
    } else if (amount >= 1e12) {
        return `${formattedAmount} Trillion`;
    } else if (amount >= 1e9) {
        return `${formattedAmount} Billion`;
    } else if (amount >= 1e6) {
        return `${formattedAmount} Million`;
    } else if (amount >= 1e3) {
        return `${formattedAmount} Thousand`;
    } else if (amount >= 100) {
        return `${formattedAmount} Hundred`;
    } else {
        return `${formattedAmount}`;
    }
}
     

async function getTransactions() {
    const exchangeRate = await getExchangeRate();

    if (exchangeRate !== null) {
        try {
            const response = await fetch('https://blockchain.info/unconfirmed-transactions?format=json');
            const data = await response.json(); // fetched unconfirmed Bitcoin transactions.
            const transactions = data.txs; //contains an array of transactions.

            let maxTransaction = transactions[0];
            let minTransaction = transactions[0];

            for (let i = 1; i < transactions.length; i++) {
                const transaction = transactions[i];

                //If higher value than the current, it becomes the new maxTransaction.
                if (transaction.out[0].value > maxTransaction.out[0].value) {
                    maxTransaction = transaction;
                }

                //if a lower value than the current, it becomes the new minTransaction.
                if (transaction.out[0].value >= 1 && transaction.out[0].value < minTransaction.out[0].value) {
                    minTransaction = transaction;
                }
            }
            
            // Bitcoin data is shown in satoshis: 100,000,000 Satoshis == 1 Bitcoin 
            // Convert satoshis to bitcoins by dividing by 100,000,000
            const maxAmountBTC = maxTransaction.out[0].value / 100000000;
            const minAmountBTC = minTransaction.out[0].value / 100000000;

            // multiplies value of each transaction with the previously retrieved exchange rate.
            // toFixed(2) method ensures that the amounts are rounded to two decimal places.
            const maxAmountUSD = (maxAmountBTC * exchangeRate).toFixed(2);
            const minAmountUSD = (minAmountBTC * exchangeRate).toFixed(2);

            document.getElementById('maxTransaction').textContent = `${formatNumberWithCommas(formatAmount(maxAmountBTC.toFixed(8)))} BTC | ${formatNumberWithCommas(formatAmount(maxAmountUSD))} USD`;
            document.getElementById('minTransaction').textContent = `${formatNumberWithCommas(formatAmount(minAmountBTC.toFixed(8)))} BTC | ${formatNumberWithCommas(formatAmount(minAmountUSD))} USD`;
        
        } catch (error) {
            console.error(`Could not retrieve transactions, ${error.message}`);
        }
    }
}


window.addEventListener("click", function() {
    const coinClink = new Audio("assets/coin-clink.m4a");
    coinClink.play();
});


//allows footer to be clicked by moving image out of the way
window.addEventListener('scroll', function() {

    let footerPosition = footer.getBoundingClientRect().top;

    // Calculate when the footer is about to appear
    if (footerPosition < window.innerHeight) {
      fixedItem.style.bottom = (window.innerHeight - footerPosition + 5) + 'px'; // 5px is padding
    } else {
      fixedItem.style.bottom = '0px'; // Reset to original position
    }
});
  

window.addEventListener("load", function() {
    
    setDisplay(); //runs once without delay

    coinloreTicker(); //price ticker

    getTransactions(); // smallest and biggest transactions

    setInterval( () => { setDisplay(); }, 1000 * 60); //refresh info every minute

});
