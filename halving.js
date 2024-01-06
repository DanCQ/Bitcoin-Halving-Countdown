async function getCurrentBlockHeight() {
    try {
        const response = await fetch('https://api.blockchair.com/bitcoin/stats');
        const data = await response.json();
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
        const currentBlockHeight = await getCurrentBlockHeight();
        const remainingBlocks = calculateRemainingBlocks(currentBlockHeight);
        const remainingTime = estimateTimeRemaining(remainingBlocks);

        console.log(`Current Block Height: ${currentBlockHeight}`);
        console.log(`Remaining Blocks until Halving: ${remainingBlocks}`);
        console.log(`Estimated Time Remaining until Halving: ${remainingTime} minutes`);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}


// Run the main function
main();