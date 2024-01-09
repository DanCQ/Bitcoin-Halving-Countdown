const halving = document.getElementById("halving-block");
const now = document.getElementById("current-block-height");
const time = document.getElementById("remaining-time");
const toGo = document.getElementById("remaining-blocks");


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

    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

window.onload= function() {
    
    main(); //runs once without delay

    setInterval(function() { main() }, 1000 * 60); //refresh info every minute

};

