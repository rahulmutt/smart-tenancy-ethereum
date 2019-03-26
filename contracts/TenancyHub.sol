pragma solidity ^0.5.0;

import './Tenancy.sol';

contract TenancyHub {

    enum Role { Tenant, Landlord }

    event TenancyRoleAdded(address indexed roleplayer, Role role, Tenancy tenancy);

    function createContract(address payable _tenant, uint256 _serviceRetainer, uint256 _rent, uint256 _months) public {
        address payable _landlord = msg.sender;
        Tenancy t = new Tenancy(_landlord, _tenant, _serviceRetainer, _rent, _months);
        emit TenancyRoleAdded(_landlord, Role.Landlord, t);
        emit TenancyRoleAdded(_tenant, Role.Tenant, t);
    }
}