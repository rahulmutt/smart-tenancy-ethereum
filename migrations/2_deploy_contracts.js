const TenancyHub = artifacts.require('TenancyHub');

module.exports = function(deployer) {
  deployer.deploy(TenancyHub);
};
