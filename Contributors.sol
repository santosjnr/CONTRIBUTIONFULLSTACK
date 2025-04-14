// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Contributors {
    struct Contributor {
        string name;
        uint256 amount;
        uint256 contributionCount;
        uint256 lastContributionTime;
        bool isRegistered;
    }

    mapping(uint256 => Contributor) contributors;

    address private admin;

    event ContributorCreated(uint256 contributorId, string name);
    event FundsContributed(uint256 contributorId, uint256 amount);

    modifier isAdmin() {
        require(msg.sender == admin, "You are a thief");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createContributor(
        uint256 contributorId,
        string memory name
    ) public isAdmin {
        require(
            contributors[contributorId].isRegistered == false,
            "You have been registered already"
        );

        Contributor memory contributor = Contributor(name, 0, 0, 0, true);
        contributors[contributorId] = contributor;
        emit ContributorCreated(contributorId, name);
    }

    function contributeFunds(
        uint256 contributorId,
        uint256 amount
    ) public isAdmin {
        require(
            contributors[contributorId].isRegistered == true,
            "You have not been registered"
        );

        contributors[contributorId].amount += amount;
        contributors[contributorId].contributionCount += 1;
        contributors[contributorId].lastContributionTime = block.timestamp;
        emit FundsContributed(contributorId, amount);
    }

    function getContributor(
        uint256 contributorId
    ) public view returns (Contributor memory) {
        return contributors[contributorId];
    }
}
