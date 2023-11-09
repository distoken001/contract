// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScratchCard is Ownable {
    struct Card {
        string cardType; // Use string identifiers to represent card types
        string cardName;
        address tokenAddress;
        uint256 price;
        uint256 maxPrize;
        uint256 winningProbability;
    }
    mapping(address => uint256) public total; //Total amount of tokens (differentiated by token types)
    mapping(address => uint256) public totalProfit; //Tax that the owner can withdraw
    Card[] public availableCards;
    mapping(address => uint256) public cardBalances;
    mapping(address => mapping(string => uint256)) public cardCounts;
    uint256 public profitShare = 1000;

    event CardPurchased(
        address indexed user,
        string cardType,
        uint256 numberOfCards
    );
    event PrizeClaimed(address indexed user, string cardType, uint256 prize);
    event ProfitWithdrawn(uint256 amount);
    event CardTypeAdded(
        string cardType,
        string cardName,
        address tokenAddress,
        uint256 price,
        uint256 maxPrize,
        uint256 winningProbability
    );
    event CardTypeRemoved(string cardType);
    event CardGifted(
        address indexed sender,
        address indexed recipient,
        string cardType,
        uint256 numberOfCards
    );

    constructor() {
        // availableCards.push(Card("CardType1", address(0x123), 5 * 10**6, 500 * 10**18));
    }

    function addCardType(
        string calldata cardType,
        string calldata cardName,
        address tokenAddress,
        uint256 price,
        uint256 maxPrize,
        uint256 winningProbability
    ) external onlyOwner {
        availableCards.push(
            Card(
                cardType,
                cardName,
                tokenAddress,
                price,
                maxPrize,
                winningProbability
            )
        );
        emit CardTypeAdded(
            cardType,
            cardName,
            tokenAddress,
            price,
            maxPrize,
            winningProbability
        );
    }

    function removeCardType(string calldata cardType) external onlyOwner {
        for (uint256 i = 0; i < availableCards.length; i++) {
            if (
                keccak256(abi.encodePacked(availableCards[i].cardType)) ==
                keccak256(abi.encodePacked(cardType))
            ) {
                emit CardTypeRemoved(cardType);
                availableCards[i] = availableCards[availableCards.length - 1];
                availableCards.pop();
                return;
            }
        }
    }

    function purchaseCards(
        string calldata cardType,
        uint256 numberOfCards
    ) external {
        require(numberOfCards > 0, "Number of cards must be greater than zero");
        uint256 cardIndex = findCardIndex(cardType);

        require(cardIndex < availableCards.length, "Invalid card type");
        Card storage selectedCard = availableCards[cardIndex];
        IERC20 token = IERC20(selectedCard.tokenAddress);

        require(
            token.transferFrom(
                msg.sender,
                address(this),
                selectedCard.price * numberOfCards
            ),
            "Transfer failed"
        );

        cardBalances[msg.sender] += numberOfCards;
        cardCounts[msg.sender][cardType] += numberOfCards;
        total[selectedCard.tokenAddress] += selectedCard.price * numberOfCards;
        emit CardPurchased(msg.sender, cardType, numberOfCards);
    }

    function scratchCard(string calldata cardType) external returns (uint256) {
        require(cardBalances[msg.sender] > 0, "You have no cards to scratch");
        require(
            cardCounts[msg.sender][cardType] > 0,
            "You have no cards of this type"
        );
        uint256 cardIndex = findCardIndex(cardType);

        require(cardIndex < availableCards.length, "Invalid card type");
        Card storage selectedCard = availableCards[cardIndex];
        cardBalances[msg.sender]--;
        cardCounts[msg.sender][cardType]--;
        totalProfit[selectedCard.tokenAddress] += ((profitShare *
            selectedCard.price) / 10000);
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    "demarket"
                )
            )
        ) % 10000;
        uint256 prize = determinePrize(randomNumber, selectedCard);

        if (prize > 0) {
            require(
                prize <= total[selectedCard.tokenAddress],
                "prize exceed the total"
            );
            IERC20 token = IERC20(selectedCard.tokenAddress);
            emit PrizeClaimed(msg.sender, cardType, prize);

            require(
                token.transfer(msg.sender, prize),
                "Transfer of prize failed"
            );
            total[selectedCard.tokenAddress] -= prize;

            return prize;
        } else {
            emit PrizeClaimed(msg.sender, cardType, 0);
            return 0;
        }
    }

    function determinePrize(
        uint256 randomNumber,
        Card storage selectedCard
    ) internal view returns (uint256) {
        uint256 maxPrize = selectedCard.maxPrize;
        if (randomNumber == 0) {
            return maxPrize;
        } else if (
            randomNumber <= ((selectedCard.winningProbability * 6) / 10)
        ) {
            return selectedCard.price;
        } else if (
            randomNumber <= ((selectedCard.winningProbability * 9) / 10)
        ) {
            return selectedCard.price * 2;
        } else if (randomNumber <= selectedCard.winningProbability) {
            return selectedCard.price * 3;
        } else {
            return 0;
        }
    }

    function selectRandomCard() internal view returns (uint256) {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)
            )
        ) % availableCards.length;
        return seed;
    }

    function findCardIndex(
        string calldata cardType
    ) internal view returns (uint256) {
        for (uint256 i = 0; i < availableCards.length; i++) {
            if (
                keccak256(abi.encodePacked(availableCards[i].cardType)) ==
                keccak256(abi.encodePacked(cardType)) &&
                availableCards[i].tokenAddress == address(this)
            ) {
                return i;
            }
        }
        revert("Card type not found");
    }

    function withdrawProfit(
        address tokenAddress,
        uint256 amountToWithdraw
    ) external onlyOwner {
        //给用户看的，这里表示管理员无权利提取用户资金
        require(
            totalProfit[tokenAddress] >= amountToWithdraw,
            "Insufficient funds to withdraw"
        );
        require(
            total[tokenAddress] >= amountToWithdraw,
            "Insufficient funds to withdraw"
        );

        totalProfit[tokenAddress] -= amountToWithdraw;
        total[tokenAddress] -= amountToWithdraw;
        IERC20 profitToken = IERC20(tokenAddress);
        require(
            profitToken.transfer(owner(), amountToWithdraw),
            "Transfer failed"
        );
        emit ProfitWithdrawn(amountToWithdraw);
    }

    function setProfitShare(uint256 newProfitShare) external onlyOwner {
        profitShare = newProfitShare;
    }

    function giftCards(
        address recipient,
        string calldata cardType,
        uint256 numberOfCards
    ) external onlyOwner {
        require(numberOfCards > 0, "Number of cards must be greater than zero");
        uint256 cardIndex = findCardIndex(cardType);

        require(cardIndex < availableCards.length, "Invalid card type");
        Card storage selectedCard = availableCards[cardIndex];

        require(
            cardBalances[msg.sender] >= numberOfCards,
            "Insufficient cards to gift"
        );

        cardBalances[msg.sender] -= numberOfCards;
        cardCounts[msg.sender][cardType] -= numberOfCards;

        cardBalances[recipient] += numberOfCards;
        cardCounts[recipient][cardType] += numberOfCards;

        total[selectedCard.tokenAddress] += selectedCard.price * numberOfCards;

        emit CardGifted(msg.sender, recipient, cardType, numberOfCards);
    }
}
