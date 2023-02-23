// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Utils {
    function getRandomItemFromArray(string[] memory items)
        public
        view
        returns (string memory, string[] memory)
    {
        string memory result = "";
        uint256 itemsLength = items.length;

        if (itemsLength == 0) {
            return ("", new string[](0));
        }

        uint256 randomIndex = getRandomNumberBetweenZeroAndMax(itemsLength);

        string[] memory newItems = new string[](itemsLength - 1);

        for (uint256 index = 0; index < itemsLength; index++) {
            if (randomIndex == index) {
                result = items[index];
                break;
            } else {
                newItems[index] = items[index];
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
