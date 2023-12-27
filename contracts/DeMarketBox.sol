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
    IERC20 public bonusToken;
    Box[] public availableBoxs;
    mapping(address => uint256) public total; //Total amount of tokens (differentiated by token types)
    mapping(string => uint256) public BoxTotal;
    mapping(string => BonusInfo) public bonusInfo;
    mapping(address => mapping(string => uint256)) public BoxCounts;
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

        BoxCounts[msg.sender][boxType] += numberOfBoxs;
        updateAssets(address(0), msg.sender, boxType, numberOfBoxs);
        total[selectedBox.tokenAddress] += selectedBox.price * numberOfBoxs;
        emit BoxMinted(msg.sender, boxType, numberOfBoxs);
    }

    function openBox(string calldata boxType) external returns (uint256) {
        require(
            BoxCounts[msg.sender][boxType] > 0,
            "You have no Boxs of this type"
        );
        uint256 BoxIndex = findBoxIndex(boxType);

        require(BoxIndex < availableBoxs.length, "Invalid Box type");
        Box storage selectedBox = availableBoxs[BoxIndex];
        BoxCounts[msg.sender][boxType]--;
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

    function withdrawProfit(
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
        Box storage selectedBox = availableBoxs[boxIndex];

        require(
            BoxCounts[msg.sender][boxType] >= numberOfBoxs,
            "Insufficient Boxs to gift"
        );

        BoxCounts[msg.sender][boxType] -= numberOfBoxs;
        updateAssets(msg.sender, address(0), boxType, numberOfBoxs);

        BoxCounts[recipient][boxType] += numberOfBoxs;
        updateAssets(address(0), recipient, boxType, numberOfBoxs);

        total[selectedBox.tokenAddress] += selectedBox.price * numberOfBoxs;

        emit BoxGifted(msg.sender, recipient, boxType, numberOfBoxs);
    }

    function addReward(
        string memory _boxType,
        uint256 _amount
    ) external onlyOwner {
        BonusInfo storage bonus = bonusInfo[_boxType];
        if (_amount > 0 && BoxTotal[_boxType] > 0) {
            bonus.accPerShare =
                bonus.accPerShare +
                ((_amount * 1e22) / BoxTotal[_boxType]);
            bonus.totalBonus = bonus.totalBonus + _amount;
        }
    }

    function updateAssets(
        address _from,
        address _to,
        string memory _boxType,
        uint256 _number
    ) internal {
        if (BoxTotal[_boxType] > 0) {
            BonusInfo storage bonus = bonusInfo[_boxType];
            if (_to != address(0)) {
                for (uint256 i = 0; i < availableBoxs.length; i++) {
                    UserRewardInfo storage userReward = userRewardInfo[_to][
                        _boxType
                    ];
                    userReward.rewardDebt =
                        userReward.rewardDebt +
                        ((_number * bonus.accPerShare) / 1e22);
                }
            }
            if (_from != address(0)) {
                for (uint256 i = 0; i < availableBoxs.length; i++) {
                    UserRewardInfo storage userReward = userRewardInfo[_from][
                        _boxType
                    ];
                    userReward.extra =
                        userReward.extra +
                        ((_number * bonus.accPerShare) / 1e22);
                }
            }
        }
    }

    function withdraw() external {
        for (uint256 i = 0; i < availableBoxs.length; i++) {
            string memory _boxType = availableBoxs[i].boxType;
            BonusInfo storage bonus = bonusInfo[_boxType];
            UserRewardInfo storage userReward = userRewardInfo[_msgSender()][
                _boxType
            ];
            uint256 _amount = (BoxCounts[msg.sender][_boxType] *
                bonus.accPerShare) /
                1e22 +
                userReward.extra -
                userReward.rewardDebt;
            if (_amount > 0) {
                userReward.rewardDebt =
                    (BoxCounts[msg.sender][_boxType] * bonus.accPerShare) /
                    1e22;
                userReward.extra = 0;
                userReward.withdrawn = userReward.withdrawn + _amount;
                bonusInfo[_boxType].withdrawn =
                    bonusInfo[_boxType].withdrawn +
                    _amount;
                if (address(bonusToken) != address(0)) {
                    bonusToken.safeTransfer(msg.sender, _amount);
                }
            }
        }
    }

    function setBonusToken(address _bonusAddr) external onlyOwner {
        require(_bonusAddr != address(0), "address err");
        bonusToken = IERC20(_bonusAddr);
    }
}
