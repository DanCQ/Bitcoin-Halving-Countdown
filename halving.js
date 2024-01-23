const halving = document.getElementById("halving-block");
const height = document.getElementById("current-block-height");
const remaining = document.getElementById("remaining-blocks");
const timeEstimate = document.getElementById("time-estimate");

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
    }
  
    updateCountdown();
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

    let e;

    if (void 0 === window.jQuery || "1.4.2" !== window.jQuery.fn.jquery) {
        
        let t = document.createElement("script");
        
        t.setAttribute("type", "text/javascript"),
        t.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"),
        t.readyState ? t.onreadystatechange = function() {

            "complete" != this.readyState && "loaded" != this.readyState || n() 

        } : t.onload = n, (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(t)

    } else e = window.jQuery, i(); 
    

    function n() {
        e = window.jQuery.noConflict(!0), i()
    }


    function i() {
        e(document).ready( function(e) {

            let color;
            let ccolor = "black";
            let pcolor = 'goldenrod';
            let scolor = "steelblue"; 
            let symbol = '';
            let width;
            
            e(".coinlore-priceticker-widget").each(function() { 

                e.get("https://widget.coinlore.com/widgets/top-list/?top=" + 
                e(this).attr("data-top") + "&cur=" + 
                e(this).attr("data-mcurrency"), 

                function(t) { 
                
                    let cc = '<div class = "marqueecoinlore" >';
                    
                    t.forEach(function(entry) { 
                        symbol = '';
                        
                        if(entry.percent_change_24h < 0) {
                            color = '#830000!important'; 
                        } else {
                            color = '#007700!important';
                            symbol = '+';
                        }
                        
                        cc += '<a style = "padding-left:10px; padding-right:10px;" href="https://www.coinlore.com/coin/'+ entry.nameid +'" title="'+ entry.name +' '+ entry.symbol +' Coin Price" target="_blank">\n' +

                        '<img style = "vertical-align:sub; border-style:none; padding:2px; -webkit-box-align:center; -ms-flex-align:center; align-items:center; width:20px; height:20px;" src="https://c1.coinlore.com/img/25x25/'+ entry.nameid +'.png" width="20" height="20" alt="'+ entry.name +' '+ entry.symbol +' Coin">\n' +

                        '<span style = "color: '+ ccolor +'">'+ entry.name +'</span>' + 
                        '<span style = "color: '+ scolor +'"> ('+ entry.symbol +')</span>\n' +

                        '<span style = "color: '+ pcolor +';">'+ entry.price_usd +
                        '<span style = "font-size:10px" >'+ entry.mc +'</span></span>' + 
                        '<span style = "color: '+ color +'"> ('+ symbol +''+ entry.percent_change_24h +'%) </span>\n' + '</a>';
                    });
                    
                    cc += '</div>';
                    cc += '</div>';
                    e(".coinlore-priceticker-widget").css("width",width);
                    e(".coinlore-priceticker-widget").html(cc);
                })
            })
        })
    }
}
  

window.onload = function() {
    
    setDisplay(); //runs once without delay

    coinloreTicker(); //price ticker

    setInterval( () => { setDisplay(); }, 1000 * 60); //refresh info every minute

};

