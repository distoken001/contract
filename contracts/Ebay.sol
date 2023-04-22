//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Ebay is Ownable {
    using SafeERC20 for IERC20;

    enum Status {
        Initial, //待购买0
        Ordered, //被下单1
        Completed, //已完成2
        BuyerBreak, //买家毁约3
        SellerBreak, //卖家毁约4
        SellerCancelWithoutDuty, //卖家无责取消5
        BuyerLanchCancel, //买家发起取消6
        SellerLanchCancel, //卖家发起取消7
        SellerRejectCancel, //卖家拒绝取消8
        BuyerRejectCancel, //买家拒绝取消9
        ConsultCancelCompleted, //协商取消完成10
        AdminCancelCompleted //协商取消完成11
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
        uint256 seller_pledge; //商品价格=卖家需要质押代币数量
        uint256 buyer_pledge; //买家需要质押代币数量 前端提醒买方质押代币数量要大于卖方质押代币数量
        uint256 buyer_ex; // 买家比卖家需要多质押数量
        Status status; //订单状态
    }

    struct DateTime {
        uint256 createTimestamp; //订单创建时间
        uint256 finishedTimestamp; //订单完成时间
        uint256 cancelTimestamp; //订单取消时间
        uint256 placeTimestamp; //买家下单时间
        uint256 adminCancelTimestamp; //管理员强制取消时间
    }

    struct Contact {
        string seller; //卖家联系方式
        string buyer; //买家联系方式
    }

    uint256 public buyerRate; //买家需要支付服务费率 使用整数表示
    uint256 public sellerRate; //卖家需要支付服务费率 使用整数表示
    uint256 public buyerIncRatio; //买家比卖家质押增量比例
    uint256 public sellerRatio = 10000; //卖家质押数量是商品总价的百分比/分母10000
    address public lockAddr;

    Order[] public orders;
    mapping(uint256 => DateTime) public dateTime;
    mapping(uint256 => Contact) contact;
    mapping(uint256 => mapping(address => bool)) isContact;
    mapping(address => uint256[]) public sellerList; //卖家订单
    mapping(address => uint256[]) public buyerList; //买家订单
    mapping(address => uint256) public total; //代币总质押数量

    event AddOrder(address indexed seller, uint256 indexed orderId); //创建订单事件
    event SetStatus(
        address indexed defaulter,
        uint256 indexed orderId,
        Status indexed status
    );
    event Confirm(address indexed buyer, uint256 indexed orderId); //确认订单事件

    constructor(
        uint256 _buyerRate,
        uint256 _sellerRate,
        uint256 _buyerIncRatio,
        uint256 _sellerRatio,
        address _lockAddr
    ) {
        buyerRate = _buyerRate;
        sellerRate = _sellerRate;
        buyerIncRatio = _buyerIncRatio;
        lockAddr = _lockAddr;
        sellerRatio = _sellerRatio;
    }

    //创建订单
    function addOrder(
        string memory _name,
        string memory _contactSeller,
        string memory _description,
        string memory _img,
        address _buyer,
        address _token,
        uint256 _price,
        uint256 _amount
    ) external {
        //1、卖家联系方式不能为空
        require(
            bytes(_contactSeller).length != 0,
            "Seller contact can not be null"
        );
        //2、验证代币合约是否有效
        require(verifyByAddress(_token) == 20, "Invalid contract");
        //3.质押数量
        uint256 _seller_pledge = (_price * _amount * sellerRatio) / 10000;
        //4、将代币转入到合约地址
        IERC20(_token).transferFrom(
            _msgSender(),
            address(this),
            _seller_pledge
        );
        uint256 _buyer_ex = (_seller_pledge * buyerIncRatio) / 10000;
        orders.push(
            Order({
                name: _name,
                seller: _msgSender(),
                buyer: _buyer,
                token: IERC20(_token),
                amount: _amount,
                seller_pledge: _seller_pledge,
                buyer_pledge: 0,
                buyer_ex: _buyer_ex,
                status: Status.Initial,
                description: _description,
                img: _img,
                price: _price
            })
        );
        uint256 _orderId = orders.length - 1;
        dateTime[_orderId].createTimestamp = block.timestamp;
        contact[_orderId].seller = _contactSeller;
        isContact[_orderId][_msgSender()] = true;
        total[_token] += _seller_pledge; //更新总质押代币数量
        sellerList[_msgSender()].push(_orderId);
        emit AddOrder(_msgSender(), _orderId);
    }

    //买家下单
    function place(uint256 _orderId, string memory _buyerContact) external {
        //1、校验订单是否存在
        Order storage order = orders[_orderId];
        require(_orderId < orders.length, "Order does not exist");
        //2、校验订单状态是否可以交易
        require(order.status == Status.Initial, "Order has expired");
        address _user = _msgSender();
        //3、校验订单是否指定买家
        require(
            order.buyer == address(0) || order.buyer == _user,
            "Non designated buyer"
        );
        uint256 _buyePrice = order.seller_pledge + order.buyer_ex;
        //4、将代币转入到合约地址
        order.token.transferFrom(_user, address(this), _buyePrice);
        buyerList[_user].push(_orderId);
        total[address(order.token)] += _buyePrice; //更新总质押代币数量
        buyerList[_user].push(_orderId);
        //5、将订单更新为已下单状态
        order.status = Status.Ordered;
        dateTime[_orderId].placeTimestamp = block.timestamp;
        order.buyer = _user;
        order.buyer_pledge = _buyePrice;
        contact[_orderId].buyer = _buyerContact;
        isContact[_orderId][_msgSender()] = true;
        emit SetStatus(_user, _orderId, Status.Ordered);
    }

    function cancel(uint256 _orderId) external {
        //1、校验订单是否存在
        Order storage order = orders[_orderId];
        require(_orderId < orders.length, "Order does not exist");
        //2、校验订单状态是否可以取消
        address _user = _msgSender();
        require(order.seller == _user, "No permissions");
        require(order.status == Status.Initial, "Order status error");

        Status _status = Status.SellerCancelWithoutDuty;
        order.token.safeTransfer(order.seller, order.seller_pledge); // 转给卖家 卖家质押数量
        total[address(order.token)] -= order.seller_pledge; //更新总质押代币数量
        //4.2、未匹配订单，卖家取消，则原路返还全部质押数量
        //5、将订单更新为取消状态
        order.status = _status;
        dateTime[_orderId].cancelTimestamp = block.timestamp;
        emit SetStatus(_user, _orderId, _status);
    }

    //确认订单
    function confirm(uint256 _orderId) external {
        //1、校验订单是否存在
        Order storage order = orders[_orderId];
        require(_orderId < orders.length, "Order does not exist");
        //2、校验订单的买家是否为调用者
        require(order.buyer == _msgSender(), "No permissions");
        //3、校验订单状态是否可以确认
        require(
            order.status == Status.Ordered ||
                order.status == Status.BuyerLanchCancel ||
                order.status == Status.SellerLanchCancel ||
                order.status == Status.SellerRejectCancel ||
                order.status == Status.BuyerRejectCancel,
            "Order cannot be confirmed"
        );
        //4、计算双方需要支付的服务费，进行退押金操作
        uint256 sellerFee = (order.seller_pledge * sellerRate) / 10000; //计算卖家平台服务费 这里服务费全按卖家质押数量计算
        uint256 buyerFee = (order.seller_pledge * buyerRate) / 10000; //计算买家平台服务费 这里服务费全按卖家质押数量计算
        uint256 sellerBack = order.seller_pledge * 2 - sellerFee; //返还卖家数量
        uint256 buyerBack = order.buyer_pledge - order.seller_pledge - buyerFee; //返还买家数量

        order.token.safeTransfer(order.seller, sellerBack); //转给卖家  （卖家质押数量 + 卖家应得数量：这里默认跟质押数量是相同的 - 卖家平台服务费
        order.token.safeTransfer(order.buyer, buyerBack); //转给买家  （买家质押数量 - 卖家应得数量：这里默认跟质押数量是相同的 - 买家平台服务费 ）
        order.token.safeTransfer(lockAddr, sellerFee + buyerFee); //fee
        dateTime[_orderId].finishedTimestamp = block.timestamp;
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge; //更新总质押代币数量

        //5、将订单更新为完成状态
        order.status = Status.Completed;
        emit Confirm(_msgSender(), _orderId);
    }

    //发起取消
    function launchCancle(uint256 _orderId) external {
        //1、校验订单是否存在
        Order storage order = orders[_orderId];
        require(_orderId < orders.length, "Order does not exist");
        //2、校验订单状态是否可以取消
        require(
            order.status == Status.Ordered ||
                order.status == Status.SellerRejectCancel ||
                order.status == Status.BuyerRejectCancel,
            "Order cannot be launched"
        );
        //3、校验调用合约者是否是买家 or 卖家
        require(
            order.buyer == _msgSender() || order.seller == _msgSender(),
            "No permissions"
        );
        Status _status = Status.BuyerLanchCancel; // 6 买家发起取消
        if (order.seller == _msgSender()) {
            _status = Status.SellerLanchCancel;
        }
        //5、将订单更新为发起取消状态
        order.status = _status;
        emit SetStatus(_msgSender(), _orderId, _status);
    }

    //拒绝取消
    function rejectCancle(uint256 _orderId) external {
        //1、校验订单是否存在
        Order storage order = orders[_orderId];
        require(_orderId < orders.length, "Order does not exist");
        //2、校验订单状态是否可以取消
        require(
            order.status == Status.BuyerLanchCancel ||
                order.status == Status.SellerLanchCancel,
            "Order cannot be canceled"
        );
        //3、校验调用合约者是否是买家 or 卖家
        require(
            order.buyer == _msgSender() || order.seller == _msgSender(),
            "No permissions"
        );
        Status _status = Status.BuyerRejectCancel;
        if (order.seller == _msgSender()) {
            //2、校验订单状态是否可以取消
            require(
                order.status == Status.BuyerLanchCancel,
                "Order cannot be canceled"
            );
            _status = Status.SellerRejectCancel;
        } else {
            //2、校验订单状态是否可以取消
            require(
                order.status == Status.SellerLanchCancel,
                "Order cannot be canceled"
            );
        }
        //5、将订单更新为发起取消状态
        order.status = _status;
        emit SetStatus(_msgSender(), _orderId, _status);
    }

    //确认取消
    function confirmCancle(uint256 _orderId) external {
        //1、校验订单是否存在
        Order storage order = orders[_orderId];
        require(_orderId < orders.length, "Order does not exist");
        //3、校验调用合约者是否是买家 or 卖家
        require(
            order.buyer == _msgSender() || order.seller == _msgSender(),
            "No permissions"
        );
        //默认协商取消完成
        Status _status = Status.ConsultCancelCompleted;
        if (order.seller == _msgSender()) {
            //2、校验订单状态是否可以取消
            require(
                order.status == Status.BuyerLanchCancel,
                "Order cannot be canceled"
            );
        } else {
            //2、校验订单状态是否可以取消
            require(
                order.status == Status.SellerLanchCancel,
                "Order cannot be canceled"
            );
        }
        uint256 buyerFee = (order.seller_pledge * buyerRate) / 10000; //平台服务费 这里服务费全按卖家质押数量计算
        uint256 sellerFee = (order.seller_pledge * sellerRate) / 10000; //平台服务费 这里服务费全按卖家质押数量计算
        //卖方返还和买方返回
        uint256 sellerBack = order.seller_pledge - sellerFee;
        uint256 buyerBack = order.buyer_pledge - buyerFee;
        //结果小于0要转换为0
        sellerBack = sellerBack < 0 ? 0 : sellerBack;
        buyerBack = buyerBack < 0 ? 0 : sellerBack;
        order.token.safeTransfer(order.seller, sellerBack);
        order.token.safeTransfer(order.buyer, buyerBack);
        order.token.safeTransfer(lockAddr, sellerFee + buyerFee);
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge; //更新总质押代币数量
        order.status = _status;
        dateTime[_orderId].cancelTimestamp = block.timestamp;
        emit SetStatus(_msgSender(), _orderId, _status);
    }

    //争议订单取消
    function adminCancle(uint256 _orderId) external {
        //1、校验订单是否存在
        Order storage order = orders[_orderId];
        require(_orderId < orders.length, "Order does not exist");
        //3、校验调用合约者是否是买家 or 卖家
        require(owner() == _msgSender(), "No permissions");
        //默认协商取消完成
        Status _status = Status.AdminCancelCompleted;
       
        uint256 buyerFee = (order.seller_pledge * buyerRate) / 10000; //平台服务费 这里服务费全按卖家质押数量计算
        uint256 sellerFee = (order.seller_pledge * sellerRate) / 10000; //平台服务费 这里服务费全按卖家质押数量计算
        //卖方返还和买方返回
        uint256 sellerBack = order.seller_pledge - sellerFee;
        uint256 buyerBack = order.buyer_pledge - buyerFee;
        //结果小于0要转换为0
        sellerBack = sellerBack < 0 ? 0 : sellerBack;
        buyerBack = buyerBack < 0 ? 0 : sellerBack;
        order.token.safeTransfer(order.seller, sellerBack);
        order.token.safeTransfer(order.buyer, buyerBack);
        order.token.safeTransfer(lockAddr, sellerFee + buyerFee);
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge; //更新总质押代币数量
        order.status = _status;
        dateTime[_orderId].adminCancelTimestamp = block.timestamp;
        emit SetStatus(_msgSender(), _orderId, _status);
    }

    function getContact(
        uint256 _orderId
    ) external view returns (string memory _seller, string memory _buyer) {
        if (_msgSender() == owner()) {
            _seller = contact[_orderId].seller;
            _buyer = contact[_orderId].buyer;
        } else if (isContact[_orderId][_msgSender()] == true) {
            _seller = contact[_orderId].seller;
            _buyer = contact[_orderId].buyer;
        }
    }

    //set Rate
    function setRate(
        uint256 _buyerRate,
        uint256 _sellerRate,
        uint256 _buyerIncRatio,
        uint256 _sellerRatio
    ) external onlyOwner {
        buyerRate = _buyerRate;
        sellerRate = _sellerRate;
        buyerIncRatio = _buyerIncRatio;
        sellerRatio = _sellerRatio;
    }

    //set lockAddr
    function setLock(address _lockAddr) external onlyOwner {
        lockAddr = _lockAddr;
    }

    function verifyByAddress(
        address _address
    ) internal returns (uint256 contractType) {
        bytes memory ownerOfData = abi.encodeWithSignature(
            "ownerOf(uint256)",
            0
        );
        (, bytes memory returnOwnerOfData) = _address.call{value: 0}(
            ownerOfData
        );
        if (returnOwnerOfData.length > 0) {
            return 721;
        } else {
            bytes memory totalSupplyData = abi.encodeWithSignature(
                "totalSupply()"
            );
            (, bytes memory returnTotalSupplyData) = _address.call{value: 0}(
                totalSupplyData
            );
            if (returnTotalSupplyData.length > 0) {
                return 20;
            } else {
                return 1155;
            }
        }
    }
}
