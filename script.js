const ContributorsCA = "0x0BD5D62e668b6cCC2bc1F50B4DCa3C7c1B9d27CC";
const ContributorsABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "contributorId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }], "name": "ContributorCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "contributorId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "FundsContributed", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "contributorId", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "contributeFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "contributorId", "type": "uint256" }, { "internalType": "string", "name": "name", "type": "string" }], "name": "createContributor", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "contributorId", "type": "uint256" }], "name": "getContributor", "outputs": [{ "components": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "contributionCount", "type": "uint256" }, { "internalType": "uint256", "name": "lastContributionTime", "type": "uint256" }, { "internalType": "bool", "name": "isRegistered", "type": "bool" }], "internalType": "struct Contributors.Contributor", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }]

const connectBtn = document.getElementById("connect-btn");
const disconnectBtn = document.getElementById("disconnect-btn");
const walletBalanceSpan = document.getElementById("wallet-balance-span");
const AddContributorBtn = document.getElementById("add-btn")






let provider;
let signer;
let ContributorsContract;

async function connectWallet() {
    if (!window.ethereum) {
        alert("Metamask is not installed on this browser");
        return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);


    signer = await provider.getSigner();

    connectBtn.style.display = "none";
    disconnectBtn.style.display = "block";

    ContributorsContract = new ethers.Contract(ContributorsCA, ContributorsABI, signer);
    if (!ContributorsContract) {
        alert("Contributors contract was not found");
        return;
    }

    await getUpdatedBalances();
}

function disconnectWallet() {
    window.location.reload();
}


async function getUpdatedBalances() {
    if (!provider || !signer) {
        return;
    }

    const walletAddress = await signer.getAddress();
    const weiBalance = await provider.getBalance(walletAddress);
    const ethBalance = ethers.utils.formatEther(weiBalance);
    walletBalanceSpan.textContent = ethBalance.toString() + " ETH";


}

async function addNewContributor() {
    try {
        const contributorsId = document.getElementById("id1").value;
        const contributorsName = document.getElementById("id2").value;
        const tx = await ContributorsContract.createContributor(contributorsId, contributorsName);

        const txResult = await tx.wait();
        console.log(txResult)
        document.getElementById("txHash").textContent = txResult.transactionHash;

        alert("contribution added successful");
        document.getElementById("id1").value = "";
        document.getElementById("id2").value = "";

    }
    catch (error) {

        console.error(error)
    }
}

// async function contributeFunds(contributorId, amount) {
//     // const contract = await getContract();
//     // const tx = await contract.contributeFunds(contributorId, amount);
//     // await tx.wait();
//     // console.log(`Contributed ${amount} to contributor ID ${contributorId}`);
// }







connectBtn.addEventListener("click", connectWallet);
disconnectBtn.addEventListener("click", disconnectWallet);
// AddContributorBtn.addEventListener("click", addNewContributor);



