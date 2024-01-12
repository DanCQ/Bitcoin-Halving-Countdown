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

//!!!!!!!still working on this-- to get it correct!!!!!!!!!
function calculateCountdown(totalMinutes) {
    const oneYearInMinutes = 365 * 24 * 60;
    const oneDayInMinutes = 24 * 60;
    const oneHourInMinutes = 60;
  
    let years = Math.floor(totalMinutes / oneYearInMinutes);
    let days = Math.floor((totalMinutes % oneYearInMinutes) / oneDayInMinutes);
    let hours = Math.floor((totalMinutes % oneDayInMinutes) / oneHourInMinutes);
    let minutes = Math.floor(totalMinutes % oneHourInMinutes);
  
    function updateCountdown() {

        totalMinutes--;
        years = Math.floor(totalMinutes / oneYearInMinutes);
        days = Math.floor((totalMinutes % oneYearInMinutes) / oneDayInMinutes);
        hours = Math.floor((totalMinutes % oneDayInMinutes) / oneHourInMinutes);
        minutes = Math.floor(totalMinutes % oneHourInMinutes);
        setTimeout(updateCountdown, 60000); // Update every minute

        function setCountdown() {
            if (years > 0) {
                return `${years} years, ${days} days, ${hours} hours, ${minutes} minutes`;
            } else if (days > 0) {
                return `${days} days, ${hours} hours, ${minutes} minutes`;
            } else if (hours > 0) {
                return `${hours} hours, ${minutes} minutes`;
            } else {
                return `${minutes} minutes`;
            }
        }

        time.textContent = setCountdown();
    }
  
    updateCountdown();
  }
  

window.onload = function() {
    
    main(); //runs once without delay

    setInterval(function() { main() }, 1000 * 60); //refresh info every minute

};

