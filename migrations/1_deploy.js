var CrowdFunding = artifacts.require("CrowdFunding");

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(CrowdFunding);
};
