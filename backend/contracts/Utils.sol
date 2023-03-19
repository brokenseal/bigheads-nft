// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "truffle/console.sol";

library Utils {
    function getRandomItemFromArrayOld(
        string[] memory items
    ) public view returns (string memory, string[] memory) {
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

    function getRandomItemFromArray(
        string[] memory items,
        uint cursor
    ) public view returns (string memory, string[] memory, uint) {
        uint256 itemsLength = items.length;

        require(
            itemsLength != 0,
            "Unable to retrieve an item from an empty list"
        );

        uint256 randomIndex = getRandomNumberBetweenZeroAndMax(cursor + 1);

        // get the found value
        string memory result = items[randomIndex];
        // move found value to the end of the available list, where the cursor is
        string memory replaceWith = items[cursor];

        // swap the two values
        items[randomIndex] = replaceWith;
        items[cursor] = result;

        // move the cursor one position to the left
        uint newCursor = cursor == 0 ? cursor : cursor - 1;

        // console.log("------------------------> cursor: ", cursor);
        // console.log("------------------------> newCursor: ", newCursor);
        // console.log("------------------------> randomIndex: ", randomIndex);
        // console.log("------------------------> result: ", result);

        for (uint i = 0; i < items.length; i++) {
            console.log("------------------------> items: ", i, items[i]);
        }
        return (result, items, newCursor);
    }

    function getRandomNumberBetweenZeroAndMax(
        uint256 max // not inclusive
    ) public view returns (uint256) {
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

    // from chatgpt
    function getRandomNumber(uint256 max) public view returns (uint256) {
        uint256 blockNumber = block.number - 1;
        bytes32 blockHash = blockhash(blockNumber);
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(blockHash)));

        return randomNumber % (max + 1);
    }
}
