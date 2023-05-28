// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DeMarketAvatarNFT is ERC721, Ownable {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    IERC20 token;
    Counters.Counter private _tokenIdCounter;
    //0.9 token price
    uint256 public price = 20000000;
    string private baseURI =
        "ipfs://QmaKYYkBxHmgaw4tLKjZ9JJW1GcjsDcdk3PLTYYMSBgM1s/";

    constructor(address _token) ERC721("DeMarket Avatar NFT", "DeMarket") {
        token = IERC20(_token);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
    function setToken(address _token) public onlyOwner {
        token = IERC20(_token);
    }
    function _setBaseURI(string memory baseURI_) internal virtual {
        baseURI = baseURI_;
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        _setBaseURI(baseURI_);
    }

    function safeMint(address to) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function mint(address to) external onlyOwner {
        safeMint(to);
    }

    // 购买
    function mintWithToken(uint256 _amount) public {
        require(_amount >= price, "Token amount error");
        token.safeTransferFrom(msg.sender, address(this), _amount);
        safeMint(msg.sender);
    }

    //设置价格
    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    //获取余额
    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    //提现
    function withraw() public onlyOwner {
        uint256 amount = token.balanceOf(address(this));
        token.safeTransfer(owner(), amount);
    }
}
