//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./EnglishAuctionLib.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EnglishAuction is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    enum Status {
        Initial, //初始化
        Bid, //被拍
        ConfirmShip, //卖家发货
        Completed, //已完成交易
        SellerBreak, //卖家毁约
        SellerCancelWithoutDuty, //卖家无责取消
        ConsultCancelCompleted //协商取消完成
    }
    struct Order {
        address seller; //卖家
        address buyer; //买家
        string name; // 物品名称
        uint256 price; //商品价格
        uint256 amount; //物品数量
        string description; //描述
        string img; //商品图片
        IERC20 token; //质押代币合约地址
        uint256 seller_pledge; //卖家实际质押数量
        uint256 buyer_pledge; //买家实际质押数量（至少得是商品总价）
        uint256 buyer_ex; // 买家超出商品总价质押部分
        Status status; //订单状态
    }

    uint256 public buyerRate; //买家需要支付服务费率 使用整数表示
    uint256 public sellerRate; //卖家需要支付服务费率 使用整数表示
    address public lockAddr;
    Order[] public orders;
    struct DateTime {
        uint256 startTime; //拍卖开始时间
        uint256 endTime; //拍卖结束时间
    }
    struct Contact {
        string seller; //卖家联系方式
        string buyer; //买家联系方式
    }
    mapping(uint256 => DateTime) public orderTime;
    mapping(uint256 => Contact) contact;
    mapping(uint256 => uint256) public orderBidCount;
    mapping(address => uint256[]) public sellerList; //卖家订单
    mapping(address => uint256[]) public buyerList; //买家订单
    mapping(address => uint256) public total; //代币总质押数量

    //创建订单事件
    event AddOrder(
        address indexed defaulter,
        uint256 indexed orderId,
        Status indexed status,
        address seller,
        address buyer
    );
    //订单信息修改
    event SetOrderInfo(
        address indexed defaulter,
        uint256 indexed orderId,
        Status indexed status,
        address seller,
        address buyer
    );
    //退回押金事件
    event RefundDeposit(
        address indexed defaulter,
        uint256 indexed orderId,
        Status indexed status,
        address seller,
        address buyer
    );

    constructor(uint256 _buyerRate, uint256 _sellerRate, address _lockAddr) {
        buyerRate = _buyerRate;
        sellerRate = _sellerRate;
        lockAddr = _lockAddr;
    }

    //计算卖家质押
    function calculateSellerPledge(
        uint256 price,
        uint256 amount,
        uint256 sellerRatio
    ) public view returns (uint256 sellerPledge, uint256 sellerTxFee) {
        (sellerPledge, sellerTxFee) = EnglishAuctionLib.calculateSellerPledge(
            price,
            amount,
            sellerRatio,
            sellerRate
        );
    }

    //计算买家质押
    function calculateBuyerPledge(
        uint256 price,
        uint256 amount
    ) public view returns (uint256 buyerPledge, uint256 buyerTxFee) {
        (buyerPledge, buyerTxFee) = EnglishAuctionLib
            .calculateBuyerTxFeeAndPledge(price, amount, buyerRate);
    }

    //创建拍卖订单
    function addOrder(
        string memory _name,
        string memory _contactSeller,
        string memory _description,
        string memory _img,
        address _token,
        uint256 _price,
        uint256 _amount,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _sellerRatio
    ) external {
        address _user = _msgSender();
        require(
            bytes(_contactSeller).length != 0,
            "Seller contact can not be null"
        );
        require(_endTime > _startTime, "Time Error");
        //1.质押数量
        (uint256 _seller_pledge, ) = calculateSellerPledge(
            _price,
            _amount,
            _sellerRatio
        );
        //2、将代币转入到合约地址
        IERC20(_token).transferFrom(_user, address(this), _seller_pledge);
        orders.push(
            Order({
                name: _name,
                seller: _user,
                buyer: 0x0000000000000000000000000000000000000000,
                token: IERC20(_token),
                amount: _amount,
                seller_pledge: _seller_pledge,
                buyer_pledge: 0,
                buyer_ex: 0,
                status: Status.Initial,
                description: _description,
                img: _img,
                price: _price
            })
        );

        uint256 _orderId = orders.length - 1;
        orderTime[_orderId].startTime = _startTime;
        orderTime[_orderId].endTime = _endTime;
        contact[_orderId].seller = _contactSeller;
        total[_token] += _seller_pledge;
        sellerList[_user].push(_orderId);
        emit AddOrder(
            _user,
            _orderId,
            Status.Initial,
            _user,
            0x0000000000000000000000000000000000000000
        );
    }

    //买家竞拍
    function place(
        uint256 _orderId,
        uint256 _price,
        string memory _buyerContact
    ) external nonReentrant {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, false);
        require(_price > order.price, "_price is error");
        require(
            bytes(_buyerContact).length != 0,
            "Seller contact can not be null"
        );
        //2、校验订单状态是否可以拍
        require(
            order.status == Status.Initial || order.status == Status.Bid,
            "Order status error"
        );
        require(
            orderTime[_orderId].startTime <= block.timestamp &&
                orderTime[_orderId].endTime >= block.timestamp,
            "Order has expired"
        );
        Status _status = Status.Bid;
        if (order.buyer != address(0)) {
            order.token.safeTransfer(order.buyer, order.buyer_pledge);
            total[address(order.token)] -= order.buyer_pledge;
            emit RefundDeposit(
                _user,
                _orderId,
                _status,
                order.seller,
                order.buyer
            );
        }
        order.price = _price;
        (uint256 _buyer_pledge, uint256 _buyer_tx_fee) = calculateBuyerPledge(
            order.price,
            order.amount
        );
        order.status = _status;
        order.buyer_pledge = _buyer_pledge;
        order.buyer_ex = _buyer_tx_fee;
        order.buyer = _user;
        orderBidCount[_orderId] = orderBidCount[_orderId] + 1;
        // buyerList[_user].push(_orderId);
        contact[_orderId].buyer = _buyerContact;
        emit SetOrderInfo(_user, _orderId, _status, order.seller, order.buyer);
        order.token.transferFrom(_user, address(this), _buyer_pledge);
        total[address(order.token)] = total[address(order.token)].add(
            _buyer_pledge
        );
    }

    function cancel(uint256 _orderId) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, true);
        //2、校验订单状态是否可以取消
        require(order.seller == _user, "No permissions");
        require(order.status == Status.Initial, "Order status error");
        Status _status = Status.SellerCancelWithoutDuty;
        order.token.safeTransfer(order.seller, order.seller_pledge);
        total[address(order.token)] = total[address(order.token)].sub(
            order.seller_pledge
        );
        //3、将订单更新为取消状态
        order.status = _status;
        emit SetOrderInfo(_user, _orderId, _status, order.seller, order.buyer);
    }

    function updateEndTime(uint256 _orderId, uint _endTime) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, true);
        //2、校验订单状态是否可以取消
        require(order.seller == _user, "No permissions");
        require(
            order.status == Status.Initial || order.status == Status.Bid,
            "Order status error"
        );
        require(orderTime[_orderId].endTime > _endTime, "time error");
        require(orderTime[_orderId].startTime < _endTime, "time error");
        orderTime[_orderId].endTime = _endTime;
        emit SetOrderInfo(
            _user,
            _orderId,
            order.status,
            order.seller,
            order.buyer
        );
    }

    //确认订单
    function confirm(uint256 _orderId) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, true);
        //2、校验订单状态是否可以确认
        require(
            order.status == Status.ConfirmShip,
            "Order cannot be confirmed"
        );
        require(order.buyer == _user, "No permissions");
        Status _status = Status.Completed;
        order.status = _status;
        (
            uint256 sellerFee,
            uint256 buyerFee,
            uint256 sellerBack,
            uint256 buyerBack
        ) = EnglishAuctionLib.confirmCalculateRefunds(
                order.seller_pledge,
                order.buyer_pledge,
                order.price,
                order.amount,
                buyerRate,
                sellerRate,
                order.buyer_ex
            );
        order.token.safeTransfer(order.seller, sellerBack); //转给卖家
        order.token.safeTransfer(order.buyer, buyerBack); //转给买家
        order.token.safeTransfer(lockAddr, sellerFee.add(buyerFee)); //fee
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge; //更新总质押代币数量
        emit SetOrderInfo(_user, _orderId, _status, order.seller, order.buyer);
    }

    //确认已将商品交付
    function confirmShip(uint256 _orderId) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, false);
        //2、校验订单状态是否可以确认发货
        require(order.status == Status.Bid, "Order cannot be confirmed");
        require(orderTime[_orderId].endTime < block.timestamp, "time error");
        require(order.seller == _user, "No permissions");
        Status _status = Status.ConfirmShip;
        //3、将订单更新为发货状态
        order.status = _status;
        emit SetOrderInfo(_user, _orderId, _status, order.seller, order.buyer);
    }

    //争议订单取消强制双方返还
    function adminCancel(uint256 _orderId) external onlyOwner {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, false);
        adminValidateStatus(order.status);
        //2、默认争议订单取消
        Status _status = Status.ConsultCancelCompleted;
        order.status = _status;
        order.token.safeTransfer(order.seller, order.seller_pledge);
        order.token.safeTransfer(order.buyer, order.buyer_pledge);
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge;
        emit SetOrderInfo(_user, _orderId, _status, order.seller, order.buyer);
    }

    //争议订单强制确认
    function adminConfirm(uint256 _orderId) external onlyOwner {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, false);
        adminValidateStatus(order.status);
        //2、默认争议订单被确认
        Status _status = Status.Completed;
        order.status = _status;

        (
            uint256 sellerFee,
            uint256 buyerFee,
            uint256 sellerBack,
            uint256 buyerBack
        ) = EnglishAuctionLib.confirmCalculateRefunds(
                order.seller_pledge,
                order.buyer_pledge,
                order.price,
                order.amount,
                buyerRate,
                sellerRate,
                order.buyer_ex
            );
        order.token.safeTransfer(order.seller, sellerBack); //转给卖家
        order.token.safeTransfer(order.buyer, buyerBack); //转给买家
        order.token.safeTransfer(lockAddr, sellerFee.add(buyerFee));
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge; //更新总质押代币数量
        emit SetOrderInfo(_user, _orderId, _status, order.seller, order.buyer);
    }

    function adminBreak(uint256 _orderId) external onlyOwner {
        (Order storage order, address _user) = validate(_orderId, false);
        adminValidateStatus(order.status);
        Status _status = Status.SellerBreak;
        order.status = _status;
        order.token.safeTransfer(
            order.buyer,
            order.buyer_pledge + order.seller_pledge
        );
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge; //更新总质押代币数量
        emit SetOrderInfo(_user, _orderId, _status, order.seller, order.buyer);
    }

    function getContact(
        uint256 _orderId
    ) external view returns (string memory _seller, string memory _buyer) {
        address _user = _msgSender();

        if (
            _user == owner() ||
            (orderTime[_orderId].endTime < block.timestamp &&
                (EnglishAuctionLib.contains(sellerList[_user], _orderId) ||
                    EnglishAuctionLib.contains(buyerList[_user], _orderId)))
        ) {
            _seller = contact[_orderId].seller;
            _buyer = contact[_orderId].buyer;
        }
    }

    //set Rate
    function setRate(
        uint256 _buyerRate,
        uint256 _sellerRate
    ) external onlyOwner {
        buyerRate = _buyerRate;
        sellerRate = _sellerRate;
    }

    //set lockAddr
    function setLock(address _lockAddr) external onlyOwner {
        lockAddr = _lockAddr;
    }

    function validate(
        uint256 _orderId,
        bool isValidateSender
    ) internal view returns (Order storage order, address user) {
        user = _msgSender();
        order = orders[_orderId];
        require(_orderId < orders.length, "Order does not exist");
        if (isValidateSender) {
            require(
                order.buyer == user || order.seller == user,
                "No permissions"
            );
        }
    }

    function adminValidateStatus(Status status) internal pure {
        require(
            status == Status.Bid || status == Status.ConfirmShip,
            "Status Error"
        );
    }
}
