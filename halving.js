const halving = document.getElementById("halving-block");
const now = document.getElementById("current-block-height");
const time = document.getElementById("remaining-time");
const toGo = document.getElementById("remaining-blocks");
const realTime = document.querySelector(".time");

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
        now.textContent = currentBlockHeight;
        time.textContent = remainingTime; 
        toGo.textContent = remainingBlocks;

        calculateCountdown(remainingTime);

    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

//!!!!!!!still working this out to get it correct!!!!!!!!!
function calculateCountdown(totalMinutes) {
    const oneYearInMinutes = 365 * 24 * 60;
    const oneDayInMinutes = 24 * 60;
    const oneHourInMinutes = 60;
  
    let years = Math.floor(totalMinutes / oneYearInMinutes);
    let days = Math.floor((totalMinutes % oneYearInMinutes) / oneDayInMinutes);
    let hours = Math.floor((totalMinutes % oneDayInMinutes) / oneHourInMinutes);
    let minutes = Math.floor(totalMinutes % oneHourInMinutes);
    let seconds = 0;
  
    function updateCountdown() {
      console.log(`${years} years, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
      
      if (totalMinutes > 0) {
        totalMinutes--;
        years = Math.floor(totalMinutes / oneYearInMinutes);
        days = Math.floor((totalMinutes % oneYearInMinutes) / oneDayInMinutes);
        hours = Math.floor((totalMinutes % oneDayInMinutes) / oneHourInMinutes);
        minutes = Math.floor(totalMinutes % oneHourInMinutes);
        setTimeout(updateCountdown, 1000); // Update every second

        realTime.textContent = `${days} Days` //, ${hours} Hours, ${minutes} Minutes.`

      } else {
        console.log("Countdown complete!");
      }
    }
  
    updateCountdown();
  }
  

window.onload= function() {
    
    main(); //runs once without delay

    setInterval(function() { main() }, 1000 * 60); //refresh info every minute

};

