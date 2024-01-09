// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract DeMarketBox is Ownable, VRFConsumerBaseV2 {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
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

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }

    // Your subscription ID.
    uint64 private s_subscriptionId;

    // past requests Id.
    uint256[] private requestIds;
    uint256[] private randomNumber;
    bool public isOk = true;
    VRFCoordinatorV2Interface COORDINATOR;
    uint32 private callbackGasLimit = 100000;
    uint16 private requestConfirmations = 3;
    uint32 public numWords = 500;

    bytes32 keyHash =
        0x114f3da0a805b6a67d6e9cd2ec746f7028f1b7376365af575cfea3550dd1aa04;

    Box[] public availableBoxs;
    mapping(address => uint256) public total; //Total amount of tokens (differentiated by token types)
    mapping(string => uint256) public boxTotal;
    mapping(string => BonusInfo) public bonusInfo;
    mapping(address => mapping(string => uint256)) public boxCounts;
    mapping(address => mapping(string => UserRewardInfo))
        private userRewardInfo;
    mapping(uint256 => RequestStatus) private s_requests;

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

    constructor(
        uint64 subscriptionId
    ) VRFConsumerBaseV2(0xc587d9053cd1118f25F645F9E08BB98c9712A4EE) {
        COORDINATOR = VRFCoordinatorV2Interface(
            0xc587d9053cd1118f25F645F9E08BB98c9712A4EE
        );
        s_subscriptionId = subscriptionId;
    }

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
        // require(
        //     numberOfBoxs <= 500,
        //     "Number of Boxs can not be greater than 500"
        // );
        uint256 boxIndex = findBoxIndex(boxType);

        require(boxIndex < availableBoxs.length, "Invalid Box type");
        Box storage selectedBox = availableBoxs[boxIndex];
        IERC20 token = IERC20(selectedBox.tokenAddress);

        require(
            token.transferFrom(
                _msgSender(),
                address(this),
                selectedBox.price.mul(numberOfBoxs)
            ),
            "Transfer failed"
        );
        boxTotal[boxType] = boxTotal[boxType].add(numberOfBoxs);
        boxCounts[_msgSender()][boxType] = boxCounts[_msgSender()][boxType].add(
            numberOfBoxs
        );
        updateAssets(address(0), _msgSender(), boxType, numberOfBoxs);
        total[selectedBox.tokenAddress] = total[selectedBox.tokenAddress].add(
            selectedBox.price.mul(numberOfBoxs)
        );
        // for (uint256 i; i < numberOfBoxs; i++) {
        //     requestRandomWords();
        // }
        emit BoxMinted(_msgSender(), boxType, numberOfBoxs);
    }

    function burnBox(string calldata boxType) external returns (uint256) {
        require(
            boxCounts[_msgSender()][boxType] > 0,
            "You have no Boxs of this type"
        );
        require(randomNumber.length > 0, "randomNumber is null");
        uint256 BoxIndex = findBoxIndex(boxType);

        require(BoxIndex < availableBoxs.length, "Invalid Box type");
        Box storage selectedBox = availableBoxs[BoxIndex];
        boxCounts[_msgSender()][boxType]--;
        boxTotal[boxType]--;
        updateAssets(_msgSender(), address(0), boxType, 1);

        IERC20 token = IERC20(selectedBox.tokenAddress);
        // uint256 _requestId = requestIds[requestIds.length - 1];
        // (, uint256[] memory randomNumber) = getRequestStatus(_requestId);
        uint256 prize = 0;
        if (
            randomNumber[randomNumber.length - 1] %
                selectedBox.maxPrizeProbability ==
            0
        ) {
            prize = selectedBox.maxPrize;
        } else {
            prize = determinePrize(
                randomNumber[randomNumber.length - 1] % 10000,
                selectedBox
            );
        }

        // s_requests[_requestId] = RequestStatus({
        //     randomWords: new uint256[](0),
        //     exists: true,
        //     fulfilled: false
        // });
        randomNumber.pop();
        if (prize > 0) {
            require(
                prize <= total[selectedBox.tokenAddress],
                "prize exceed the total"
            );
            token.safeTransfer(_msgSender(), prize);
            emit PrizeClaimed(_msgSender(), boxType, prize);

            total[selectedBox.tokenAddress] = total[selectedBox.tokenAddress]
                .sub(prize);

            return prize;
        } else {
            emit PrizeClaimed(_msgSender(), boxType, 0);
            return 0;
        }
    }

    function determinePrize(
        uint256 _randomNumber,
        Box storage selectedBox
    ) internal view returns (uint256) {
        if (_randomNumber <= ((selectedBox.winningProbability * 60).div(100))) {
            return selectedBox.price;
        } else if (
            _randomNumber <= ((selectedBox.winningProbability * 90).div(100))
        ) {
            return selectedBox.price.mul(2);
        } else if (
            _randomNumber <= ((selectedBox.winningProbability * 95).div(100))
        ) {
            return selectedBox.price.mul(3);
        } else if (_randomNumber <= selectedBox.winningProbability) {
            return selectedBox.price.mul(4);
        } else {
            return 0;
        }
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
        total[tokenAddress] = total[tokenAddress].sub(amountToWithdraw);
        profitToken.safeTransfer(owner(), amountToWithdraw);
    }

    function changeState(bool newState) public onlyOwner {
        isOk = newState;
    }

    function changeSubscriptionId(uint64 subscriptionId) public onlyOwner {
        s_subscriptionId = subscriptionId;
    }

    function changeKeyHash(bytes32 _keyHash) public onlyOwner {
        keyHash = _keyHash;
    }

    function changeNumWords(uint32 _numWords) public onlyOwner {
        numWords = _numWords;
    }

    function changeConfirmations(uint16 _confirmations) public onlyOwner {
        requestConfirmations = _confirmations;
    }

    function changeCallbackGasLimit(uint32 _callbackGasLimit) public onlyOwner {
        callbackGasLimit = _callbackGasLimit;
    }

    function transferBoxs(
        address recipient,
        string calldata boxType,
        uint256 numberOfBoxs
    ) external {
        require(numberOfBoxs > 0, "Number of Boxs must be greater than zero");
        uint256 boxIndex = findBoxIndex(boxType);

        require(boxIndex < availableBoxs.length, "Invalid Box type");
        require(
            boxCounts[_msgSender()][boxType] >= numberOfBoxs,
            "Insufficient Boxs to gift"
        );

        boxCounts[_msgSender()][boxType] = boxCounts[_msgSender()][boxType].sub(
            numberOfBoxs
        );
        updateAssets(_msgSender(), address(0), boxType, numberOfBoxs);
        boxCounts[recipient][boxType] = boxCounts[recipient][boxType].add(
            numberOfBoxs
        );
        updateAssets(address(0), recipient, boxType, numberOfBoxs);

        emit BoxGifted(_msgSender(), recipient, boxType, numberOfBoxs);
    }

    function addReward(
        string memory _boxType,
        uint256 _amount
    ) external onlyOwner {
        BonusInfo storage bonus = bonusInfo[_boxType];
        if (_amount > 0 && boxTotal[_boxType] > 0) {
            bonus.accPerShare = bonus.accPerShare.add(
                ((_amount.mul(1e22)).div(boxTotal[_boxType]))
            );
            bonus.totalBonus = bonus.totalBonus.add(_amount);
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
                userReward.rewardDebt = userReward.rewardDebt.add(
                    ((_number.mul(bonus.accPerShare)).div(1e22))
                );
            }
            if (_from != address(0)) {
                UserRewardInfo storage userReward = userRewardInfo[_from][
                    _boxType
                ];
                userReward.extra = userReward.extra.add(
                    ((_number * bonus.accPerShare).div(1e22))
                );
            }
        }
    }

    function withdraw(string calldata _boxType) external {
        BonusInfo storage bonus = bonusInfo[_boxType];
        UserRewardInfo storage userReward = userRewardInfo[_msgSender()][
            _boxType
        ];
        uint256 _amount = (
            boxCounts[_msgSender()][_boxType].mul(bonus.accPerShare)
        ).div(1e22).add(userReward.extra);
        _amount > userReward.rewardDebt
            ? _amount = _amount.sub(userReward.rewardDebt)
            : 0;
        if (_amount > 0) {
            userReward.rewardDebt = (
                boxCounts[_msgSender()][_boxType].mul(bonus.accPerShare)
            ).div(1e22);
            userReward.extra = 0;
            userReward.withdrawn = userReward.withdrawn.add(_amount);
            bonusInfo[_boxType].withdrawn = bonusInfo[_boxType].withdrawn.add(
                _amount
            );
            address bonusToken = availableBoxs[findBoxIndex(_boxType)]
                .tokenAddress;
            if (bonusToken != address(0)) {
                IERC20(bonusToken).safeTransfer(_msgSender(), _amount);
            }
        }
    }

    function getUserReward(
        string memory _boxType,
        address _user
    ) external view returns (uint256 _reward) {
        BonusInfo storage bonus = bonusInfo[_boxType];
        _reward = (boxCounts[_user][_boxType].mul(bonus.accPerShare))
            .div(1e22)
            .add(userRewardInfo[_user][_boxType].extra);
        _reward > userRewardInfo[_user][_boxType].rewardDebt
            ? _reward = _reward.sub(userRewardInfo[_user][_boxType].rewardDebt)
            : 0;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() public onlyOwner returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            1
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
    }

    function getRandomLength() public view returns (uint256 length) {
        length = randomNumber.length;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
    }

    function addRandomNumber()
        public
        onlyOwner
        returns (bool fulfilled, uint256[] memory randomWords)
    {
        require(requestIds.length > 0, "request not found");
        uint256 _requestId = requestIds[requestIds.length - 1];
        RequestStatus memory request = s_requests[_requestId];
        if (request.fulfilled == true) {
            requestIds.pop();
            for (uint256 i = 0; i < numWords; i++) {
                randomNumber.push(
                    uint256(keccak256(abi.encode(request.randomWords[0], i)))
                );
            }
            return (request.fulfilled, request.randomWords);
        }
    }

    function removeRequest() public onlyOwner returns (uint256 requestId) {
        require(requestIds.length > 0, "request not found");
        requestId = requestIds[requestIds.length - 1];
        requestIds.pop();
    }
}
