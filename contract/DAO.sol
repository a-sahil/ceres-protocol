// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HederaDAO {
    struct Proposal {
        uint256 id;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        bool exists;
        bool counted;
        mapping(address => bool) voted;
    }
     uint256 public lockedPool;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    // Event logs
    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter, bool support);
    event VoteCounted(uint256 proposalId, bool passed, address winner, uint256 amountTransferred);

    // -------------------------
    // 1. pool() -> deposit HBAR
    // -------------------------
        function pool(uint256 amount) external payable {
        require(amount > 0, "Amount must be > 0");

        // Add to logical locked pool
        lockedPool += amount;

        // Any msg.value sent is just added to treasury, no restriction
        // treasury = address(this).balance
    }

    // ------------------------------
    // 2. createProposal(string)
    // ------------------------------
    function createProposal(string calldata description) external returns (uint256) {
        proposalCount++;

        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.description = description;
        p.exists = true;

        emit ProposalCreated(proposalCount, description);
        return proposalCount;
    }

    // ----------------------------------------------------
    // 3. vote(proposalId, boolean)
    // DAO member casts a YES (true) or NO (false) vote
    // ----------------------------------------------------
    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(p.exists, "Proposal does not exist");
        require(!p.voted[msg.sender], "Already voted");

        p.voted[msg.sender] = true;

        if (support) {
            p.yesVotes++;
        } else {
            p.noVotes++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    // -------------------------------------------------------------
    // 4. countVote(proposalId, winner)
    // -> checks majority
    // -> transfers HBAR from pool to winner
    // -------------------------------------------------------------
    function countVote(uint256 proposalId, address payable winner) external {
        Proposal storage p = proposals[proposalId];
        require(p.exists, "Proposal does not exist");
        require(!p.counted, "Votes already counted");
        require(winner != address(0), "Invalid winner");

        p.counted = true;

        bool passed = p.yesVotes > p.noVotes;

        uint256 amount = 0;

        if (passed) {
            amount = address(this).balance;

            (bool sent, ) = winner.call{value: amount}("");
            require(sent, "HBAR transfer failed");
        }

        emit VoteCounted(proposalId, passed, winner, amount);
    }

    // -------------------------
    // Helper: Contract pool balance
    // -------------------------
    function getPoolBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
