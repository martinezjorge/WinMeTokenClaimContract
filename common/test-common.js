const { ethers } = require("hardhat");
const {
    impersonateAccount,
    setBalance,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function deployTokenFixture() {
    const [owner, treasury, addr2, addr3, addr4, addr5, addr6, addr7] =
    await ethers.getSigners();

    const token = await ethers.deployContract("WinMeToken", []);
    await token.waitForDeployment();

    const ethUsdAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    await impersonateAccount(ethUsdAddress);

    const store = await ethers.deployContract("WinMeStore", [
        treasury.address,
        token.target,
        ethUsdAddress
    ]);
    await store.waitForDeployment();

    const link = await ethers.getContractAt("ILINK", "0x514910771AF9Ca656af840dff83E8264EcF986CA");
    const luckyLinkHolder = "0x8B3Ce9e912d26f8a3dae6d8607384c73B4C267e9";
    await impersonateAccount(luckyLinkHolder);
    await setBalance(luckyLinkHolder, ethers.parseEther("10"));
    const linkHolder = await ethers.getImpersonatedSigner(luckyLinkHolder);
    await link.connect(linkHolder).transfer(store.target, ethers.parseEther("500"));

    return {
        token,
        store,
        link,
        owner,
        others: {
            treasury,
            addr2,
            addr3,
            addr4,
            addr5,
            addr6,
            addr7,
        },
    };
}

module.exports = {
  deployTokenFixture,
};