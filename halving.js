const halving = document.getElementById("halving-block");
const height = document.getElementById("current-block-height");
const remaining = document.getElementById("remaining-blocks");
const timeEstimate = document.getElementById("time-estimate");

const apiBlockchair = 'https://api.blockchair.com/bitcoin/stats';
const apiBlockchain = 'https://blockchain.info/q/getblockcount';

//future plan
// let array = [
//     {
//         name: "",
//         url: ""
//     },
// ];

//multiple for redundancy
const apiArray = [apiBlockchair, apiBlockchain]; 

//!important
//async function can handle tasks that take some time to complete
async function getCurrentBlockHeight() {

    for(let api in apiArray) {

        try{
            let response = await fetch(apiArray[api]); //waits grab data before moving on
            let data = await response.json(); //waits to convert data in a workable format

            if(apiArray[api] == apiBlockchair) {

                console.log(apiArray[api], data); //view JS console to see data retrieved
                return data.data.blocks; //the current block number

            } else if (apiArray[api] == apiBlockchain) {

                console.log(apiArray[api], data); //view JS console to see data retrieved
                return data; //the current block number

            } 

        } catch (error) { //if data could not be retrieved, error message will be shown
            console.error('Error fetching current block height:', error.message);
            throw error;
        }
    };
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
async function main() {
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
        console.error('Error occurred in main():', error.message);
    }
}


//Coinlore Priceticker Widget
//added white space, I'm attempting to understand & customize it
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
    
    main(); //runs once without delay

    coinloreTicker(); //price ticker

    setInterval( () => { main(); }, 1000 * 60); //refresh info every minute

};

