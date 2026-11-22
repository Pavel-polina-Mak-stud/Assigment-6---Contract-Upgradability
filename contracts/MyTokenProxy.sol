// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract MyTokenProxy is TransparentUpgradeableProxy {
    constructor(address logic, address initialOwner, bytes memory data)
        TransparentUpgradeableProxy(logic, initialOwner, data)
    {}
}