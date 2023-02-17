// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Utils {
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
        max += 1;

        uint256 result = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        ) % max;

        return result - 1;
    }
}
