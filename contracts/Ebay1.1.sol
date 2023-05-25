//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./EbayLib1.1.sol";
import "./Validate1.1.sol";

contract Ebay is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using Validate for uint8;
    enum Status {
        Initial, //待购买0
        Ordered, //被下单1
        Completed, //已完成2
        ConfirmShip, //卖家发货3
        SellerBreak, //卖家毁约4
        SellerCancelWithoutDuty, //卖家无责取消5
        BuyerLanchCancel, //买家发起取消6
        SellerLanchCancel, //卖家发起取消7
        SellerRejectCancel, //卖家拒绝取消8
        BuyerRejectCancel, //买家拒绝取消9
        ConsultCancelCompleted //协商取消完成10
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
        uint256 seller_pledge; //卖家实际质押数量，如果是白名单用户则是手续费
        uint256 buyer_pledge; //买家实际质押数量（至少得是商品总价）
        uint256 buyer_ex; // 买家超出商品总价质押部分（如果是白名单用户则是手续费）
        Status status; //订单状态
    }

    struct Contact {
        string seller; //卖家联系方式
        string buyer; //买家联系方式
    }
    uint256 public buyerRate; //买家需要支付服务费率 使用整数表示
    uint256 public sellerRate; //卖家需要支付服务费率 使用整数表示
    address public lockAddr;

    Order[] public orders;
    mapping(uint256 => Contact) contact;
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
    //修改状态事件
    event SetStatus(
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
        (sellerPledge, sellerTxFee) = EbayLib.calculateSellerPledge(
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
        (buyerPledge, buyerTxFee) = EbayLib.calculateBuyerTxFeeAndPledge(
            price,
            amount,
            buyerRate
        );
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
        uint256 _amount,
        uint256 _sellerRatio
    ) external {
        address _user = _msgSender();
        require(
            bytes(_contactSeller).length != 0,
            "Seller contact can not be null"
        );
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
                buyer: _buyer,
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
        contact[_orderId].seller = _contactSeller;
        total[_token] += _seller_pledge;
        sellerList[_user].push(_orderId);
        emit AddOrder(_user, _orderId, Status.Initial, _user, _buyer);
    }

    //买家下单
    function place(
        uint256 _orderId,
        uint256 _amount,
        string memory _buyerContact
    ) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, false);
        require(
            bytes(_buyerContact).length != 0,
            "Seller contact can not be null"
        );
        //2、校验订单状态是否可以交易
        require(order.status == Status.Initial, "Order has expired");
        require(_amount <= order.amount, "amount error");
        //3、校验订单是否指定买家
        require(
            order.buyer == address(0) || order.buyer == _user,
            "Non designated buyer"
        );
        Status _status = Status.Ordered;
        (uint256 _buyer_pledge, uint256 _buyer_tx_fee) = calculateBuyerPledge(
            order.price,
            _amount
        );
        if (_amount == order.amount) {
            order.status = _status;
            order.buyer_pledge = _buyer_pledge;
            order.buyer_ex = _buyer_tx_fee;
            order.buyer = _user;
            buyerList[_user].push(_orderId);
            contact[_orderId].buyer = _buyerContact;
            emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
        } else {
            uint256 _seller_pledge_new = EbayLib.divider(
                _amount,
                order.amount,
                order.seller_pledge
            );
            orders.push(
                Order({
                    name: order.name,
                    seller: order.seller,
                    buyer: _user,
                    token: order.token,
                    amount: _amount,
                    seller_pledge: _seller_pledge_new,
                    buyer_pledge: _buyer_pledge,
                    buyer_ex: _buyer_tx_fee,
                    status: _status,
                    description: order.description,
                    img: order.img,
                    price: order.price
                })
            );
            uint256 _order_id_new = orders.length - 1;
            sellerList[order.seller].push(_order_id_new);
            buyerList[_user].push(_order_id_new);
            contact[_order_id_new].buyer = _buyerContact;
            contact[_order_id_new].seller = contact[_orderId].seller;
            order.amount -= _amount;
            order.seller_pledge -= _seller_pledge_new;
            emit SetStatus(
                _user,
                _orderId,
                Status.Initial,
                order.seller,
                order.buyer
            );
            emit AddOrder(
                _user,
                _order_id_new,
                Status.Ordered,
                order.seller,
                _user
            );
        }
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
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    //确认订单
    function confirm(uint256 _orderId) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, true);
        //2、校验订单状态是否可以确认
        uint8(order.status).validateConfirm();
        require(order.buyer == _user, "No permissions");
        Status _status = Status.Completed;
        order.status = _status;
        (
            uint256 sellerFee,
            uint256 buyerFee,
            uint256 sellerBack,
            uint256 buyerBack
        ) = EbayLib.confirmCalculateRefunds(
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
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    //确认发货
    function confirmShip(uint256 _orderId) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, false);
        //2、校验订单状态是否可以确认发货
        uint8(order.status).validateConfirmShip();
        require(order.seller == _user, "No permissions");
        Status _status = Status.ConfirmShip;
        //3、将订单更新为发货状态
        order.status = _status;
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    //发起取消
    function launchCancel(uint256 _orderId) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, true);
        //2.校验状态
        uint8(order.status).validateLaunchCancel();
        Status _status = Status.BuyerLanchCancel;
        if (order.seller == _user) {
            _status = Status.SellerLanchCancel;
        }
        //3、将订单更新为发起取消状态
        order.status = _status;
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    //拒绝取消
    function rejectCancel(uint256 _orderId) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, true);
        Status _status = Status.BuyerRejectCancel;
        if (order.buyer == _user) {
            require(
                order.status == Status.SellerLanchCancel,
                "Order cannot be canceled"
            );
        } else {
            require(
                order.status == Status.BuyerLanchCancel,
                "Order cannot be canceled"
            );
            _status = Status.SellerRejectCancel;
        }
        //2、将订单更新为拒绝取消状态
        order.status = _status;
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    //确认取消
    function confirmCancel(uint256 _orderId) external {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, true);
        //2、默认协商取消完成
        Status _status = Status.ConsultCancelCompleted;
        if (order.buyer == _user) {
            require(
                order.status == Status.SellerLanchCancel,
                "Order cannot be canceled"
            );
        } else {
            require(
                order.status == Status.BuyerLanchCancel,
                "Order cannot be canceled"
            );
        }
        order.status = _status;
        (
            uint256 buyerFee,
            uint256 sellerFee,
            uint256 sellerBack,
            uint256 buyerBack
        ) = EbayLib.confirmCancelCalculateFeesAndRefunds(
                order.buyer_pledge,
                order.seller_pledge,
                order.price,
                order.amount,
                buyerRate,
                sellerRate,
                order.buyer_ex
            );
        order.token.safeTransfer(order.seller, sellerBack);
        order.token.safeTransfer(order.buyer, buyerBack);
        order.token.safeTransfer(lockAddr, sellerFee.add(buyerFee));
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge; //更新总质押代币数量
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    //争议订单取消强制双方返还
    function adminCancel(uint256 _orderId) external onlyOwner {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, false);
        uint8(order.status).adminValidateStatus();
        //2、默认争议订单取消
        Status _status = Status.ConsultCancelCompleted;
        order.status = _status;

        (
            uint256 buyerFee,
            uint256 sellerFee,
            uint256 sellerBack,
            uint256 buyerBack
        ) = EbayLib.confirmCancelCalculateFeesAndRefunds(
                order.buyer_pledge,
                order.seller_pledge,
                order.price,
                order.amount,
                buyerRate,
                sellerRate,
                order.buyer_ex
            );
        order.token.safeTransfer(order.seller, sellerBack);
        order.token.safeTransfer(order.buyer, buyerBack);
        order.token.safeTransfer(lockAddr, sellerFee.add(buyerFee));
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge;
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    //争议订单强制确认
    function adminConfirm(uint256 _orderId) external onlyOwner {
        //1、校验订单是否存在
        (Order storage order, address _user) = validate(_orderId, false);
        uint8(order.status).adminValidateStatus();
        //2、默认争议订单被确认
        Status _status = Status.Completed;
        order.status = _status;

        (
            uint256 sellerFee,
            uint256 buyerFee,
            uint256 sellerBack,
            uint256 buyerBack
        ) = EbayLib.confirmCalculateRefunds(
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
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    function adminBreak(uint256 _orderId) external onlyOwner {
        (Order storage order, address _user) = validate(_orderId, false);
        uint8(order.status).adminValidateStatus();
        Status _status = Status.SellerBreak;
        order.status = _status;
        order.token.safeTransfer(
            order.buyer,
            order.buyer_pledge + order.seller_pledge
        );
        total[address(order.token)] -= order.buyer_pledge + order.seller_pledge; //更新总质押代币数量
        emit SetStatus(_user, _orderId, _status, order.seller, order.buyer);
    }

    function getContact(
        uint256 _orderId
    ) external view returns (string memory _seller, string memory _buyer) {
        address _user = _msgSender();
        if (
            _user == owner() ||
            EbayLib.contains(sellerList[_user], _orderId) ||
            EbayLib.contains(buyerList[_user], _orderId)
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

    function renounceOwnership() public pure override {}

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
}
