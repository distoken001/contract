// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DeMarketBox is Ownable {
    using SafeERC20 for IERC20;

    struct Box {
        string boxType; // Use string identifiers to represent Box types
        string boxName;
        address tokenAddress;
        uint256 price;
        uint256 maxPrize;
        uint256 maxPrizeProbability;
        uint256 winningProbability;
    }
    //奖金信息
    struct BonusInfo {
        uint256 totalBonus;
        uint256 withdrawn;
        uint256 accPerShare;
    }

    struct UserRewardInfo {
        uint256 rewardDebt;
        uint256 withdrawn;
        uint256 extra;
    }

    bool public isOk = true;
    Box[] public availableBoxs;
    mapping(address => uint256) public total; //Total amount of tokens (differentiated by token types)
    mapping(string => uint256) public boxTotal;
    mapping(string => BonusInfo) public bonusInfo;
    mapping(address => mapping(string => uint256)) public boxCounts;
    mapping(address => mapping(string => UserRewardInfo)) public userRewardInfo;

    event BoxMinted(address indexed user, string BoxType, uint256 numberOfBoxs);
    event PrizeClaimed(address indexed user, string BoxType, uint256 prize);

    event BoxTypeAdded(
        string boxType,
        string boxName,
        address tokenAddress,
        uint256 price,
        uint256 maxPrize,
        uint256 maxPrizeProbability,
        uint256 winningProbability
    );
    event BoxTypeRemoved(string boxType);
    event BoxGifted(
        address indexed sender,
        address indexed recipient,
        string boxType,
        uint256 numberOfBoxs
    );

    function addBoxType(
        string calldata boxType,
        string calldata boxName,
        address tokenAddress,
        uint256 price,
        uint256 maxPrize,
        uint256 maxPrizeProbability,
        uint256 winningProbability
    ) external onlyOwner {
        for (uint256 i = 0; i < availableBoxs.length; i++) {
            if (
                keccak256(abi.encodePacked(availableBoxs[i].boxType)) ==
                keccak256(abi.encodePacked(boxType))
            ) {
                revert("Box type exist");
            }
        }
        availableBoxs.push(
            Box(
                boxType,
                boxName,
                tokenAddress,
                price,
                maxPrize,
                maxPrizeProbability,
                winningProbability
            )
        );
        emit BoxTypeAdded(
            boxType,
            boxName,
            tokenAddress,
            price,
            maxPrize,
            maxPrizeProbability,
            winningProbability
        );
    }

    function removeBoxType(string calldata boxType) external onlyOwner {
        for (uint256 i = 0; i < availableBoxs.length; i++) {
            if (
                keccak256(abi.encodePacked(availableBoxs[i].boxType)) ==
                keccak256(abi.encodePacked(boxType))
            ) {
                availableBoxs[i] = availableBoxs[availableBoxs.length - 1];
                availableBoxs.pop();
                emit BoxTypeRemoved(boxType);
            }
        }
    }

    function mintBoxs(string calldata boxType, uint256 numberOfBoxs) external {
        require(isOk, "Contract is not open.");
        require(numberOfBoxs > 0, "Number of Boxs must be greater than zero");
        uint256 boxIndex = findBoxIndex(boxType);

        require(boxIndex < availableBoxs.length, "Invalid Box type");
        Box storage selectedBox = availableBoxs[boxIndex];
        IERC20 token = IERC20(selectedBox.tokenAddress);

        require(
            token.transferFrom(
                msg.sender,
                address(this),
                selectedBox.price * numberOfBoxs
            ),
            "Transfer failed"
        );
        boxTotal[boxType] = boxTotal[boxType] + numberOfBoxs;
        boxCounts[msg.sender][boxType] += numberOfBoxs;
        updateAssets(address(0), msg.sender, boxType, numberOfBoxs);
        total[selectedBox.tokenAddress] += selectedBox.price * numberOfBoxs;
        emit BoxMinted(msg.sender, boxType, numberOfBoxs);
    }

    function openBox(string calldata boxType) external returns (uint256) {
        require(
            boxCounts[msg.sender][boxType] > 0,
            "You have no Boxs of this type"
        );
        uint256 BoxIndex = findBoxIndex(boxType);

        require(BoxIndex < availableBoxs.length, "Invalid Box type");
        Box storage selectedBox = availableBoxs[BoxIndex];
        boxCounts[msg.sender][boxType]--;
        updateAssets(msg.sender, address(0), boxType, 1);

        IERC20 token = IERC20(selectedBox.tokenAddress);
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
            emit PrizeClaimed(msg.sender, boxType, prize);

            total[selectedBox.tokenAddress] -= prize;

            return prize;
        } else {
            emit PrizeClaimed(msg.sender, boxType, 0);
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
        string calldata boxType
    ) internal view returns (uint256) {
        for (uint256 i = 0; i < availableBoxs.length; i++) {
            if (
                keccak256(abi.encodePacked(availableBoxs[i].boxType)) ==
                keccak256(abi.encodePacked(boxType))
            ) {
                return i;
            }
        }
        revert("Box type not found");
    }

    //tokens obtained from minting boxes
    function withdrawEquity(
        address tokenAddress,
        uint256 amountToWithdraw
    ) external onlyOwner {
        IERC20 profitToken = IERC20(tokenAddress);
        require(
            total[tokenAddress] >= amountToWithdraw,
            "Number of Boxs must be greater than zero"
        );
        require(
            profitToken.transfer(owner(), amountToWithdraw),
            "Transfer failed"
        );
    }

    function changeIsOpen(bool newStatus) public onlyOwner {
        isOk = newStatus; // 修改 isOpen 的状态
    }

    function giftBoxs(
        address recipient,
        string calldata boxType,
        uint256 numberOfBoxs
    ) external {
        require(numberOfBoxs > 0, "Number of Boxs must be greater than zero");
        uint256 boxIndex = findBoxIndex(boxType);

        require(boxIndex < availableBoxs.length, "Invalid Box type");
        require(
            boxCounts[msg.sender][boxType] >= numberOfBoxs,
            "Insufficient Boxs to gift"
        );

        boxCounts[msg.sender][boxType] -= numberOfBoxs;
        updateAssets(msg.sender, address(0), boxType, numberOfBoxs);

        boxCounts[recipient][boxType] += numberOfBoxs;
        updateAssets(address(0), recipient, boxType, numberOfBoxs);

        emit BoxGifted(msg.sender, recipient, boxType, numberOfBoxs);
    }

    function addReward(
        string memory _boxType,
        uint256 _amount
    ) external onlyOwner {
        BonusInfo storage bonus = bonusInfo[_boxType];
        if (_amount > 0 && boxTotal[_boxType] > 0) {
            bonus.accPerShare =
                bonus.accPerShare +
                ((_amount * 1e22) / boxTotal[_boxType]);
            bonus.totalBonus = bonus.totalBonus + _amount;
        }
    }

    function updateAssets(
        address _from,
        address _to,
        string memory _boxType,
        uint256 _number
    ) internal {
        if (boxTotal[_boxType] > 0) {
            BonusInfo storage bonus = bonusInfo[_boxType];
            if (_to != address(0)) {
                UserRewardInfo storage userReward = userRewardInfo[_to][
                    _boxType
                ];
                userReward.rewardDebt =
                    userReward.rewardDebt +
                    ((_number * bonus.accPerShare) / 1e22);
            }
            if (_from != address(0)) {
                UserRewardInfo storage userReward = userRewardInfo[_from][
                    _boxType
                ];
                userReward.extra =
                    userReward.extra +
                    ((_number * bonus.accPerShare) / 1e22);
            }
        }
    }

    function withdraw(string calldata _boxType) external {
        BonusInfo storage bonus = bonusInfo[_boxType];
        UserRewardInfo storage userReward = userRewardInfo[_msgSender()][
            _boxType
        ];
        uint256 _amount = (boxCounts[msg.sender][_boxType] *
            bonus.accPerShare) /
            1e22 +
            userReward.extra -
            userReward.rewardDebt;
        if (_amount > 0) {
            userReward.rewardDebt =
                (boxCounts[msg.sender][_boxType] * bonus.accPerShare) /
                1e22;
            userReward.extra = 0;
            userReward.withdrawn = userReward.withdrawn + _amount;
            bonusInfo[_boxType].withdrawn =
                bonusInfo[_boxType].withdrawn +
                _amount;
            address bonusToken = availableBoxs[findBoxIndex(_boxType)]
                .tokenAddress;
            if (bonusToken != address(0)) {
                IERC20(bonusToken).safeTransfer(msg.sender, _amount);
            }
        }
    }

    function getUserReward(
        string memory _boxType,
        address _user
    ) external view returns (uint256 _reward) {
        BonusInfo storage bonus = bonusInfo[_boxType];
        _reward =
            (boxCounts[msg.sender][_boxType] * bonus.accPerShare) /
            1e22 +
            userRewardInfo[_user][_boxType].extra -
            userRewardInfo[_user][_boxType].rewardDebt;
    }
}
