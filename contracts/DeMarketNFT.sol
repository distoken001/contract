// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// 准备NFTs的图片与Metadata属性文件，并上传到IPFS。参考文档 https://docs.ipfs.tech/how-to/desktop-app/#install-ipfs-desktop
// 编写合约
// 使用Hardhat工具部署合约到optimism网络，并且Verify代码，方便用户在etherscan上直接够NFTs
// OpenSea上预览或出售NFTS

contract DeMarketNFT is ERC721, Ownable {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    IERC20 dma;
    Counters.Counter private _tokenIdCounter;
    //0.9 dma price
    uint256 public price = 900000;

    constructor(address _dma) ERC721("DeMarket NFT", "DMA NFT") {
        dma = IERC20(_dma);
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmU3Ey6Hmnndha2CtUpgYV4BCEBQq9fBTo9FStP11dtHiS/";
    }

    function safeMint(address to) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function mint(address to) external onlyOwner {
        safeMint(to);
    }

    // 1 dma 购买
    function mintWithDma(uint256 _amount) public {
        require(_amount >= price, "Dma amount error");
        dma.safeTransferFrom(msg.sender, address(this), _amount);
        safeMint(msg.sender);
    }

    //设置价格
    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    //获取Dma余额
    function getDmaBalance() public view returns (uint256) {
        return dma.balanceOf(address(this));
    }

    //提现Dma
    function withraw() public onlyOwner {
        uint256 amount = dma.balanceOf(address(this));
        dma.safeTransfer(owner(), amount);
    }
}
