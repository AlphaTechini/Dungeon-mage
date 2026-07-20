// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

/// @notice Minimal native-ETH settlement boundary for a single game session.
contract SessionZeroGame {
    error InvalidMatch();
    error MatchAlreadyExists();
    error MatchExpired();
    error NotMatchPlayer();
    error SpendCapExceeded();
    error IncorrectPotionPayment();
    error TreasuryTransferFailed();
    error InvalidConfiguration();

    struct MatchSession {
        address player;
        uint96 spendCap;
        uint96 spent;
        uint48 expiresAt;
        bool completed;
    }

    uint48 public constant MAX_MATCH_DURATION = 24 hours;
    address public immutable treasury;
    uint96 public immutable potionPrice;

    mapping(bytes32 matchId => MatchSession) private matches;

    event MatchStarted(
        bytes32 indexed matchId, address indexed player, uint96 spendCap, uint48 expiresAt
    );
    event PotionUsed(bytes32 indexed matchId, address indexed player, uint96 price, uint96 totalSpent);
    event MatchCompleted(bytes32 indexed matchId, address indexed player, bytes32 indexed actionDigest);

    constructor(address treasury_, uint96 potionPrice_) {
        if (treasury_ == address(0) || potionPrice_ == 0) revert InvalidConfiguration();

        treasury = treasury_;
        potionPrice = potionPrice_;
    }

    function startMatch(bytes32 matchId, uint96 spendCap, uint48 expiresAt) external {
        if (matchId == bytes32(0) || matches[matchId].player != address(0)) revert MatchAlreadyExists();
        if (spendCap < potionPrice || expiresAt <= block.timestamp || expiresAt > block.timestamp + MAX_MATCH_DURATION) {
            revert InvalidMatch();
        }

        matches[matchId] = MatchSession({
            player: msg.sender,
            spendCap: spendCap,
            spent: 0,
            expiresAt: expiresAt,
            completed: false
        });

        emit MatchStarted(matchId, msg.sender, spendCap, expiresAt);
    }

    function buyAndUsePotion(bytes32 matchId) external payable {
        MatchSession storage session = matches[matchId];
        _requireActivePlayer(session);
        if (msg.value != potionPrice) revert IncorrectPotionPayment();
        if (session.spent + potionPrice > session.spendCap) revert SpendCapExceeded();

        session.spent += potionPrice;
        emit PotionUsed(matchId, msg.sender, potionPrice, session.spent);

        (bool sent,) = treasury.call{value: msg.value}("");
        if (!sent) revert TreasuryTransferFailed();
    }

    function completeMatch(bytes32 matchId, bytes32 actionDigest) external {
        MatchSession storage session = matches[matchId];
        _requireActivePlayer(session);
        session.completed = true;

        emit MatchCompleted(matchId, msg.sender, actionDigest);
    }

    function getMatch(bytes32 matchId) external view returns (MatchSession memory) {
        return matches[matchId];
    }

    function _requireActivePlayer(MatchSession storage session) private view {
        if (session.player == address(0)) revert InvalidMatch();
        if (session.player != msg.sender) revert NotMatchPlayer();
        if (session.completed || block.timestamp > session.expiresAt) revert MatchExpired();
    }
}
