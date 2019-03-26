pragma solidity ^0.5.0;

contract Tenancy {

    enum State { Inactive, Active, Expired }

    event ContractStarted(uint256 timestamp);
    event RentPaid(uint256 monthIndex, uint256 timestamp);
    event RentWithdrawn(uint256 monthIndex, uint256 timestamp);
    event ContractTerminated(uint256 paidMonths, uint256 balance, uint256 timestamp);
    event LandlordBalanceWithdrawn(uint256 timtestamp);
    event TenantBalanceWithdrawn(uint256 timtestamp);

    struct Contract {
      address payable landlord;
      address payable tenant;
      uint256 serviceRetainer;
      uint256 rent;
      uint256 months;
    }

    Contract public agreement;
    mapping (uint256 => bool) private monthlyRentPaid;
    mapping (uint256 => bool) private monthlyRentTaken;
    State private state;
    uint256 startTime;
    uint256 landlordBalance;
    uint256 tenantBalance;

    modifier onlyTenant() {
        require(msg.sender == agreement.tenant, "Only the tenant can call this contract function.");
        _;
    }

    modifier onlyLandlord() {
        require(msg.sender == agreement.landlord, "Only the landlord can call this contract function.");
        _;
    }

    modifier onlyLandlordOrTenant() {
        address sender = msg.sender;
        require(sender == agreement.landlord || sender == agreement.tenant, "Only the landlord or tenant can call this contract function.");
        _;
    }

    constructor (address payable _landlord, address payable _tenant, uint256 _serviceRetainer, uint256 _rent, uint256 _months) public {
        agreement = Contract({landlord: _landlord,
                              tenant: _tenant,
                              serviceRetainer: _serviceRetainer,
                              rent: _rent,
                              months: _months});
        state = State.Inactive;
    }

    function approve() public payable onlyTenant {
        require (state == State.Inactive, "The contract has already been approved.");
        require (msg.value == agreement.serviceRetainer, "You must pay the full service retainer amount.");
        state = State.Active;
        uint256 _now = now;
        startTime = _now;
        emit ContractStarted(_now);
    }

    function depositRent(uint256 monthIndex) public payable onlyTenant {
        require (state == State.Active, "This contract is inactive.");
        require (msg.value == agreement.rent, "You must pay the full rent.");
        require (!monthlyRentPaid[monthIndex], "Already paid for this month.");
        require (monthIndex < agreement.months, "No need to pay rent for this month since it is beyond the agreement.");
        monthlyRentPaid[monthIndex] = true;
        emit RentPaid(monthIndex, now);
    }

    function withdrawRent(uint256 monthIndex) public onlyLandlord {
        require (state != State.Inactive, "This contract is inactive.");
        require (monthlyRentPaid[monthIndex], "Tenant has not paid for this month.");
        require (!monthlyRentTaken[monthIndex], "Already took rent for this month.");
        monthlyRentTaken[monthIndex] = true;
        emit RentWithdrawn(monthIndex, now);
        agreement.landlord.transfer(agreement.rent);
    }

    function terminate() public onlyLandlordOrTenant {
        require (state == State.Active, "This contract is inactive.");
        uint256 months = agreement.months;
        uint256 paidMonths = ((now - startTime) / (30 days)) + 1;
        paidMonths = (paidMonths > months)? months : paidMonths;

        uint256 rent = agreement.rent;
        uint256 paid = 0;
        for (uint256 i = 0; i < paidMonths; i++) {
            if (monthlyRentPaid[i]) {
                paid += rent;
            }
        }
        uint256 balance = paidMonths * rent - paid;
        uint256 serviceRetainer = agreement.serviceRetainer;
        if (serviceRetainer >= balance) {
            landlordBalance = balance;
            tenantBalance = serviceRetainer - balance;
        } else {
            landlordBalance = serviceRetainer;
            tenantBalance = 0;
        }
        state = State.Expired;
        emit ContractTerminated(paidMonths, balance, now);
    }

    function withdrawBalance() public payable onlyLandlordOrTenant {
        require (state == State.Expired, "This contract has not terminated yet.");
        address payable landlord = agreement.landlord;
        if (msg.sender == landlord) {
            uint256 balance = landlordBalance;
            require (balance > 0, "No balance to give.");
            emit LandlordBalanceWithdrawn(now);
            landlord.transfer(balance);
        } else {
            uint256 balance = tenantBalance;
            require (balance > 0, "No balance to give.");
            emit TenantBalanceWithdrawn(now);
            agreement.tenant.transfer(balance);
        }
    }
}