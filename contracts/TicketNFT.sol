// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/** @title NFT contract to deal with NFT tickets */
contract TicketNFT is ERC721, ERC721URIStorage, Ownable {
    // nft's counter
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Yob", " YobNFT") { }

    struct minted_ticket {
        uint256 ticket_id;
        uint256 token_id;
    }

    mapping(address => minted_ticket[]) internal mints;
    uint256 public tickets_counter = 0;
    /** @dev mints of a clients
     * @param user address of a client
     * @return minted_ticket[] array of structs
     */
    function mintsByUser(address user) public view returns (minted_ticket[] memory) {
        return mints[user];
    }

    /**
     * @param to address of a client
     * @param ticket_id identifier of a ticket
     * @param uri link to nft metadata
     */
    function safeMint(address to, uint256 ticket_id, string memory uri) public {
        // only client can mint his ticket NFT
        require(to == msg.sender, "You can't mint this NFT");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        _mint(to, newItemId);

        // use custom uri from frontend
        _setTokenURI(newItemId, uri);

        mints[to].push(minted_ticket(ticket_id, newItemId));
    }

    // Overrides the supportsInterface function to specify which implementation to use
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return ERC721.supportsInterface(interfaceId) || ERC721URIStorage.supportsInterface(interfaceId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}