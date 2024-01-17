const halving = document.getElementById("halving-block");
const height = document.getElementById("current-block-height");
const toGo = document.getElementById("remaining-blocks");
const time = document.getElementById("time");

async function getCurrentBlockHeight() {
    try {
        let response = await fetch('https://api.blockchair.com/bitcoin/stats');
        let data = await response.json();
        return data.data.blocks;
    } catch (error) {
        console.error('Error fetching current block height:', error.message);
        throw error;
    }
}

function calculateRemainingBlocks(currentBlock, halvingInterval = 210000) {
    return halvingInterval - (currentBlock % halvingInterval);
}
  
function estimateTimeRemaining(remainingBlocks, averageBlockTime = 10) {
    return remainingBlocks * averageBlockTime;
}

  
async function main() {
    try {
        let currentBlockHeight = await getCurrentBlockHeight();
        let remainingBlocks = calculateRemainingBlocks(currentBlockHeight);

        let halvingBlock = currentBlockHeight + remainingBlocks;
        let remainingTime = estimateTimeRemaining(remainingBlocks);

        halving.textContent = halvingBlock;
        height.textContent = currentBlockHeight;
        toGo.textContent = remainingBlocks;

        calculateCountdown(remainingTime);

    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}


function calculateCountdown(totalMinutes) {

    const oneYearInMinutes = 365 * 24 * 60;
    const oneDayInMinutes = 24 * 60;
    const oneHourInMinutes = 60;
  
    let years = Math.floor(totalMinutes / oneYearInMinutes);
    let days = Math.floor((totalMinutes % oneYearInMinutes) / oneDayInMinutes);
    let hours = Math.floor((totalMinutes % oneDayInMinutes) / oneHourInMinutes);
    let minutes = Math.floor(totalMinutes % oneHourInMinutes);


    function setCountdown() {

        let count = `${minutes} minutes`;

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
  

    function updateCountdown() {

        setTimeout(() => {
            totalMinutes--;
            years = Math.floor(totalMinutes / oneYearInMinutes);
            days = Math.floor((totalMinutes % oneYearInMinutes) / oneDayInMinutes);
            hours = Math.floor((totalMinutes % oneDayInMinutes) / oneHourInMinutes);
            minutes = Math.floor(totalMinutes % oneHourInMinutes);
            
            updateCountdown();

            time.textContent = setCountdown();
        }, 60000); //updates every minute
    }
  
    updateCountdown();
    time.textContent = setCountdown();
}


//code for the Coinlore Ticker Widget
//I added white space, and I'm attempting to understand it & customize it
function coinloreTicker() {

    var e;

    if (void 0 === window.jQuery || "1.4.2" !== window.jQuery.fn.jquery) {
        
        var t = document.createElement("script");
        
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

            var width;
            var color;
            var symbol = '';
            var mc_text = '';
            var bcolor = ''; 
            var ccolor = '';
            var pcolor = '';
            var mcap = '';
            var adtd = '';
            
            e(".coinlore-priceticker-widget").each(function() { 

                bcolor = e(this).attr("data-bcolor");
                pcolor = e(this).attr("data-pcolor");
                ccolor = e(this).attr("data-ccolor");
                scolor = e(this).attr("data-scolor");

                e.get("https://widget.coinlore.com/widgets/top-list/?top=" + 
                e(this).attr("data-top") + "&cur=" + 
                e(this).attr("data-mcurrency"), 
                function(t) { 
                    cc = '<style>' +
                    '.marqueecoinlore { width:100%; margin:0 auto; overflow:hidden; white-space:nowrap;box-sizing:border-box; animation:marquee 45s linear infinite }' +
                    '.marqueecoinlore:hover { animation-play-state:paused }' + 
                    '@keyframes marquee{ 0%{ text-indent:27.5em } 100%{ text-indent:-105em } }' +
                    '</style>';
                    
                    cc += '<div style = "color: #333; background: '+ bcolor +'; font-family: Helvetica, Arial,sans-serif; min-width: 300px; width: 100%; line-height: 35px; font-size: 16px;">';
                    
                    cc += '<div class = "marqueecoinlore" >';
                    
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

    setInterval(function() { main() }, 1000 * 60); //refresh info every minute

};

