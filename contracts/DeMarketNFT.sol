// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DeMarketNFT is ERC721, Ownable {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    address public lockAddr;
    IERC20 token;
    Counters.Counter private _tokenIdCounter;
    uint256 public price = 100000000000000000000;
    string private baseURI =
        "ipfs://QmcdDLrvhPeqrmXYDoVkrKTxZQBqrnCnQxgK2DRPCCDVAp/";

    constructor() ERC721("DeMarket NFT", "DeMarket") {
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

    function mintWithToken(uint256 _amount) public {
        require(_amount >= price, "Token amount error");
        token.safeTransferFrom(msg.sender, address(lockAddr), _amount);
        safeMint(msg.sender);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function withraw() public onlyOwner {
        uint256 amount = token.balanceOf(address(this));
        token.safeTransfer(owner(), amount);
    }

    function setLock(address _lockAddr) external onlyOwner {
        lockAddr = _lockAddr;
    }
}
