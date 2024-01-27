const halving = document.getElementById("halving-block");
const height = document.getElementById("current-block-height");
const remaining = document.getElementById("remaining-blocks");
const timeEstimate = document.getElementById("time-estimate");
const halvingDate = document.getElementById("halving-date");

//multiple APIs for redundancy
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

//!important
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

            } else if (api.url == 'https://blockchain.info/q/getblockcount' || 'https://blockstream.info/api/blocks/tip/height') {

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

    //future calendar day of the halving
    //planning to calculate for leap years soon
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
            "Thrusday",
            "Friday",
            "Saturday",
        ];

        let currentDate = new Date(); // Get the current date and time

        let futureDate = new Date(
            currentDate.getTime() + //current time in milliseconds
            (years * 365 * 24 * 60 * 60 * 1000) + //years in milliseconds
            (days * 24 * 60 * 60 * 1000) + //days in milliseconds
            (hours * 60 * 60 * 1000) + //hours in milliseconds
            (minutes * 60 * 1000) //minutes in milliseconds
        );

        let day = futureDate.getDate(); //future day
        let month = monthArray[futureDate.getMonth()]; //future month
        let weekday = weekdayArray[futureDate.getDay()]; //future weekday
        let year = futureDate.getFullYear(); //future year

        halvingDate.textContent = `${weekday}, ${month} ${day}, ${year}`;

    } halvingCalendarDate();


    function updateCountdown() {

        function setCountdown() {

            let count = `${minutes} minutes`;
    
            //values added only if above zero
            if (hours > 0) {
                count = `${hours} hours, ${count}`;
            }
            if (days > 0) {
                count = `${days} days, ${count}`;
            }
            if (years > 0) {
                count = `${years} years, ${count}`;
            }
            return count;
        }
        
        timeEstimate.textContent = setCountdown();
    
    } updateCountdown();

}


function calculateRemainingBlocks(currentBlock, halvingInterval = 210000) {
    return halvingInterval - (currentBlock % halvingInterval);
}


//estimation 'cause blocks are formed about every 10 minutes
function estimateTimeRemaining(remainingBlocks, averageBlockTime = 10) {
    return remainingBlocks * averageBlockTime;
}


//should never fail, if getCurrentBlockHeight succeeded
async function setDisplay() {
    try {
        let currentBlockHeight = await getCurrentBlockHeight(); //nested async
        let remainingBlocks = calculateRemainingBlocks(currentBlockHeight);

        let halvingBlock = currentBlockHeight + remainingBlocks;
        let remainingTime = estimateTimeRemaining(remainingBlocks);

        halving.textContent = halvingBlock;
        height.textContent = currentBlockHeight;
        remaining.textContent = remainingBlocks;

        //here since remainingTime is local scope value + main() will be an interval
        calculateCountdown(remainingTime);

    } catch (error) {
        console.error(`Error occurred in setDisplay(), ${error.message}`);
    }
}


//Coinlore Priceticker Widget --HTML inside JavaScript--
//I'm still attempting to understand & customize it
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


window.onclick = () => {
    const coinClink = new Audio("assets/coin-clink.m4a");
    coinClink.play();
}
  

window.onload = function() {
    
    setDisplay(); //runs once without delay

    coinloreTicker(); //price ticker

    setInterval( () => { setDisplay(); }, 1000 * 60); //refresh info every minute

};

