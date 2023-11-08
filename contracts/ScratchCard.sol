// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScratchCard is Ownable {
    struct Card {
        string cardType; // 使用字符串标识符来表示卡片类型
        address tokenAddress;
        uint256 price;
        uint256 maxPrize;
    }
    mapping(address => uint256) public total; //代币总质押数量
    mapping(address => uint256) public totalProfit; //所有权者获得的可以提现的税
    Card[] public availableCards;
    mapping(address => uint256) public cardBalances;
    mapping(address => mapping(string => uint256)) public cardCounts;
    uint256 public winningProbability = 10; // 10% profit share
    uint256 public profitShare = 90; //用户赚取比例

    event CardPurchased(
        address indexed user,
        string cardType,
        uint256 numberOfCards
    );
    event PrizeClaimed(address indexed user, string cardType, uint256 prize);
    event ProfitWithdrawn(uint256 amount);
    event CardTypeAdded(
        string cardType,
        address tokenAddress,
        uint256 price,
        uint256 maxPrize
    );
    event CardTypeRemoved(string cardType);

    constructor() {
        // Initialize available cards with their parameters
        // availableCards.push(Card("CardType1", address(0x123), 5 * 10**6, 500 * 10**18));
        // You can add more ERC-20 tokens as needed
    }

    function addCardType(
        string calldata cardType,
        address tokenAddress,
        uint256 price,
        uint256 maxPrize
    ) external onlyOwner {
        availableCards.push(Card(cardType, tokenAddress, price, maxPrize));
        emit CardTypeAdded(cardType, tokenAddress, price, maxPrize);
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
        // 更新相应代币的余额
        total[selectedCard.tokenAddress] += selectedCard.price * numberOfCards;
        emit CardPurchased(msg.sender, cardType, numberOfCards);
    }

    function scratchCard(string calldata cardType) external {
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

        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        ) % 100;

        uint256 prize = determinePrize(randomNumber, selectedCard);

        if (prize > 0) {
            require(
                prize <= selectedCard.maxPrize,
                "prize exceed the maximum prize limit"
            );
            require(
                prize <= total[selectedCard.tokenAddress],
                "prize exceed the total"
            );
            emit PrizeClaimed(msg.sender, cardType, prize);
            // 将奖励返还给用户
            IERC20 token = IERC20(selectedCard.tokenAddress);
            uint256 userProfit = (prize * profitShare) / 100;
            require(
                token.transfer(msg.sender, userProfit),
                "Transfer of prize failed"
            );
            // 更新total映射的值
            total[selectedCard.tokenAddress] -= prize;
            totalProfit[selectedCard.tokenAddress] += prize - userProfit;
        } else {
            totalProfit[selectedCard.tokenAddress] += selectedCard.price;
        }
    }

    function determinePrize(
        uint256 randomNumber,
        Card storage selectedCard
    ) internal returns (uint256) {
        if (randomNumber < winningProbability) {
            uint256 maxPrize = selectedCard.maxPrize;
            return maxPrize;
        }

        return 0;
    }

    function selectRandomCard() internal view returns (uint256) {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
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
        return 0;
    }

    function withdrawProfit(
        address tokenAddress,
        uint256 amountToWithdraw
    ) external onlyOwner {
        require(
            totalProfit[tokenAddress] >= amountToWithdraw,
            "Insufficient funds to withdraw"
        );

        totalProfit[tokenAddress] -= amountToWithdraw;
        IERC20 profitToken = IERC20(tokenAddress);
        require(
            profitToken.transfer(owner(), amountToWithdraw),
            "Transfer failed"
        );
        emit ProfitWithdrawn(amountToWithdraw);
    }

    function setProbability(uint256 newProbability) external onlyOwner {
        winningProbability = newProbability;
    }

    function setProfitShare(uint256 newProfitShare) external onlyOwner {
        profitShare = newProfitShare;
    }
}
