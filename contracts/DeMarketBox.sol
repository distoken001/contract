// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeMarketBox is Ownable {
    struct Box {
        string BoxType; // Use string identifiers to represent Box types
        string BoxName;
        address tokenAddress;
        uint256 price;
        uint256 maxPrize;
        uint256 maxPrizeProbability;
        uint256 winningProbability;
    }
    bool public isOk = true;
    mapping(address => uint256) public total; //Total amount of tokens (differentiated by token types)
    Box[] public availableBoxs;
    mapping(address => uint256) public BoxBalances;
    mapping(address => mapping(string => uint256)) public BoxCounts;
    uint256 public profitShare = 1000;
    address public lockAddr;
    event BoxMinted(
        address indexed user,
        string BoxType,
        uint256 numberOfBoxs
    );
    event PrizeClaimed(address indexed user, string BoxType, uint256 prize);

    event BoxTypeAdded(
        string BoxType,
        string BoxName,
        address tokenAddress,
        uint256 price,
        uint256 maxPrize,
        uint256 maxPrizeProbability,
        uint256 winningProbability
    );
    event BoxTypeRemoved(string BoxType);
    event BoxGifted(
        address indexed sender,
        address indexed recipient,
        string BoxType,
        uint256 numberOfBoxs
    );

    constructor(address _lockAddr) {
        lockAddr = _lockAddr;
    }

    function addBoxType(
        string calldata BoxType,
        string calldata BoxName,
        address tokenAddress,
        uint256 price,
        uint256 maxPrize,
        uint256 maxPrizeProbability,
        uint256 winningProbability
    ) external onlyOwner {
        for (uint256 i = 0; i < availableBoxs.length; i++) {
            if (
                keccak256(abi.encodePacked(availableBoxs[i].BoxType)) ==
                keccak256(abi.encodePacked(BoxType))
            ) {
                revert("Box type exist");
            }
        }
        availableBoxs.push(
            Box(
                BoxType,
                BoxName,
                tokenAddress,
                price,
                maxPrize,
                maxPrizeProbability,
                winningProbability
            )
        );
        emit BoxTypeAdded(
            BoxType,
            BoxName,
            tokenAddress,
            price,
            maxPrize,
            maxPrizeProbability,
            winningProbability
        );
    }

    function removeBoxType(string calldata BoxType) external onlyOwner {
        for (uint256 i = 0; i < availableBoxs.length; i++) {
            if (
                keccak256(abi.encodePacked(availableBoxs[i].BoxType)) ==
                keccak256(abi.encodePacked(BoxType))
            ) {
                availableBoxs[i] = availableBoxs[availableBoxs.length - 1];
                availableBoxs.pop();
                emit BoxTypeRemoved(BoxType);
            }
        }
    }

    function mintBoxs(string calldata BoxType, uint256 numberOfBoxs) external {
        require(isOk, "Contract is not open.");
        require(numberOfBoxs > 0, "Number of Boxs must be greater than zero");
        uint256 BoxIndex = findBoxIndex(BoxType);

        require(BoxIndex < availableBoxs.length, "Invalid Box type");
        Box storage selectedBox = availableBoxs[BoxIndex];
        IERC20 token = IERC20(selectedBox.tokenAddress);

        require(
            token.transferFrom(
                msg.sender,
                address(this),
                selectedBox.price * numberOfBoxs
            ),
            "Transfer failed"
        );

        BoxBalances[msg.sender] += numberOfBoxs;
        BoxCounts[msg.sender][BoxType] += numberOfBoxs;
        total[selectedBox.tokenAddress] += selectedBox.price * numberOfBoxs;
        emit BoxMinted(msg.sender, BoxType, numberOfBoxs);
    }

    function openBox(string calldata BoxType) external returns (uint256) {
        require(BoxBalances[msg.sender] > 0, "You have no Boxs to open");
        require(
            BoxCounts[msg.sender][BoxType] > 0,
            "You have no Boxs of this type"
        );
        uint256 BoxIndex = findBoxIndex(BoxType);

        require(BoxIndex < availableBoxs.length, "Invalid Box type");
        Box storage selectedBox = availableBoxs[BoxIndex];
        BoxBalances[msg.sender]--;
        BoxCounts[msg.sender][BoxType]--;

        uint profit = (profitShare * selectedBox.price) / 10000;
        IERC20 token = IERC20(selectedBox.tokenAddress);
        total[selectedBox.tokenAddress] -= profit;
        token.transfer(lockAddr, profit); //fee
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    "demarket"
                )
            )
        );
        uint256 prize = 0;
        if (randomNumber % selectedBox.maxPrizeProbability == 0) {
            prize = selectedBox.maxPrize;
        } else {
            prize = determinePrize(randomNumber % 10000, selectedBox);
        }

        if (prize > 0) {
            require(
                prize <= total[selectedBox.tokenAddress],
                "prize exceed the total"
            );
            require(
                token.transfer(msg.sender, prize),
                "Transfer of prize failed"
            );
            emit PrizeClaimed(msg.sender, BoxType, prize);

            total[selectedBox.tokenAddress] -= prize;

            return prize;
        } else {
            emit PrizeClaimed(msg.sender, BoxType, 0);
            return 0;
        }
    }

    function determinePrize(
        uint256 randomNumber,
        Box storage selectedBox
    ) internal view returns (uint256) {
        if (randomNumber <= ((selectedBox.winningProbability * 60) / 100)) {
            return selectedBox.price;
        } else if (
            randomNumber <= ((selectedBox.winningProbability * 90) / 100)
        ) {
            return selectedBox.price * 2;
        } else if (
            randomNumber <= ((selectedBox.winningProbability * 95) / 100)
        ) {
            return selectedBox.price * 3;
        } else if (randomNumber <= selectedBox.winningProbability) {
            return selectedBox.price * 4;
        } else {
            return 0;
        }
    }

    function selectRandomBox() internal view returns (uint256) {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)
            )
        ) % availableBoxs.length;
        return seed;
    }

    function findBoxIndex(
        string calldata BoxType
    ) internal view returns (uint256) {
        for (uint256 i = 0; i < availableBoxs.length; i++) {
            if (
                keccak256(abi.encodePacked(availableBoxs[i].BoxType)) ==
                keccak256(abi.encodePacked(BoxType))
            ) {
                return i;
            }
        }
        revert("Box type not found");
    }

    function withdrawProfit(
        address tokenAddress,
        uint256 amountToWithdraw
    ) external onlyOwner {
        IERC20 profitToken = IERC20(tokenAddress);
        require(
            profitToken.transfer(owner(), amountToWithdraw),
            "Transfer failed"
        );
    }

    function setProfitShare(uint256 newProfitShare) external onlyOwner {
        profitShare = newProfitShare;
    }

    function changeIsOpen(bool newStatus) public onlyOwner {
        isOk = newStatus; // 修改 isOpen 的状态
    }

    function giftBoxs(
        address recipient,
        string calldata BoxType,
        uint256 numberOfBoxs
    ) external {
        require(numberOfBoxs > 0, "Number of Boxs must be greater than zero");
        uint256 BoxIndex = findBoxIndex(BoxType);

        require(BoxIndex < availableBoxs.length, "Invalid Box type");
        Box storage selectedBox = availableBoxs[BoxIndex];

        require(
            BoxBalances[msg.sender] >= numberOfBoxs,
            "Insufficient Boxs to gift"
        );

        BoxBalances[msg.sender] -= numberOfBoxs;
        BoxCounts[msg.sender][BoxType] -= numberOfBoxs;

        BoxBalances[recipient] += numberOfBoxs;
        BoxCounts[recipient][BoxType] += numberOfBoxs;

        total[selectedBox.tokenAddress] += selectedBox.price * numberOfBoxs;

        emit BoxGifted(msg.sender, recipient, BoxType, numberOfBoxs);
    }
}
