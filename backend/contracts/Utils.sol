// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "truffle/console.sol";

library Utils {
    function getRandomItemFromArray(string[] memory items)
        public
        view
        returns (string memory, string[] memory)
    {
        uint256 itemsLength = items.length;

        require(
            itemsLength != 0,
            "Unable to retrieve an item from an empty list"
        );

        string memory result = "";
        uint256 randomIndex = getRandomNumberBetweenZeroAndMax(itemsLength);

        string[] memory newItems = new string[](itemsLength - 1);

        bool found = false;

        for (uint256 index = 0; index < itemsLength; index++) {
            string memory currentItem = items[index];

            if (randomIndex == index) {
                found = true;
                result = currentItem;
            } else {
                uint256 newItemsIndex = index;

                if (found) {
                    newItemsIndex = index - 1;
                }

                newItems[newItemsIndex] = currentItem;
            }
        }

        return (result, newItems);
    }

    function getRandomNumberBetweenZeroAndMax(uint256 max)
        public
        view
        returns (uint256)
    {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp +
                        block.difficulty +
                        // block.prevrandao + // TODO: test this one
                        ((
                            uint256(keccak256(abi.encodePacked(block.coinbase)))
                        ) / (block.timestamp)) +
                        block.gaslimit +
                        ((uint256(keccak256(abi.encodePacked(msg.sender)))) /
                            (block.timestamp)) +
                        block.number
                )
            )
        );

        return (seed - ((seed / max) * max));
    }
}
