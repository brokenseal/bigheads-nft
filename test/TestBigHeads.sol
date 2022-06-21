// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BigHeads.sol";

contract TestBigHeads {

  function testInitialCount() public {
    BigHeads meta = BigHeads(DeployedAddresses.BigHeads());

    uint expected = 0;

    Assert.equal(meta.count(), expected, "Unexpected minted count");
  }
}
