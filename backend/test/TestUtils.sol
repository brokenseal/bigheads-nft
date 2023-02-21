// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "truffle/Assert.sol";
import "../contracts/Utils.sol";

contract TestUtils {
    function testGetRandomNumberBetweenZeroAndMax() public {
        for (uint256 i = 0; i < 300; i++) {
            uint256 result = Utils.getRandomNumberBetweenZeroAndMax(3);

            Assert.isAtLeast(result, 0, "Value is lower than 0");
            Assert.isAtMost(result, 2, "Value is higher than 2");
        }
    }
}
