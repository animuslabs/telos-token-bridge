const { Chain } = require("qtest-js");
const config = require("../config.json");
const { expectAction, expectThrow } = require("qtest-js");
const { ethers } = require("ethers");
const EVM_BRIDGE = "6f989daff4f485aba94583110d555e7af36e531a";
const EVM_REGISTER = "5f989daff4f485aba94583110d555e7af36e531a";

describe("tokenBridge.cpp test", () => {
    let chain;
    let account, account2, bridgeAccount;
    let chainName = process.env.CHAIN_NAME || 'TLOS';
    let bridge;

    beforeAll(async () => {
        chain = await Chain.setupChain(chainName);
        account = await chain.system.createAccount("testaccount1");
        account2 = await chain.system.createAccount("testaccount2");
        bridgeAccount = await chain.system.createAccount(config.CONTRACT_NAME);
        // Todo: deploy eosio.evm with TokenBridge, PairBridgeRegister and a ERC20Bridgeable ?
        // Todo: deploy an eosio token
        bridge = await bridgeAccount.setContract({
            abi: `./build/${config.CONTRACT_NAME}.abi`,
            wasm: `./build/${config.CONTRACT_NAME}.wasm`,
        });
        bridge.action.init(
            { "bridge_address": EVM_BRIDGE, "register_address": EVM_REGISTER, "version": "1", "admin": bridgeAccount.name },
            [{ actor: bridgeAccount.name, permission: "active" }]
        );
    }, 60000);

    describe(":: Deployment", function () {
        it("Should not let random accounts init configuration", async () => {
            await expectThrow(
                bridge.action.init(
                    { "bridge_address": EVM_BRIDGE, "register_address": EVM_REGISTER, "version": "1", "admin": account.name },
                    [{ actor: account.name, permission: "active" }]
                ),
                `missing authority of ${config.CONTRACT_NAME}`
            );
        });
        it("Should not let init be called twice", async () => {
            await expectThrow(
                bridge.action.init(
                    { "bridge_address": EVM_BRIDGE, "register_address": EVM_REGISTER, "version": "1", "admin": bridgeAccount.name },
                    [{ actor: bridgeAccount.name, permission: "active" }]
                ),
                "contract already initialized"
            );
        });
    });
    describe(":: Setters", function () {
        it("Should let admin set new evm contracts addresses", async () => {
            bridge.action.setevmctc(
                { "bridge_address" : EVM_BRIDGE, "register_address" : EVM_REGISTER },
                [{ actor: bridgeAccount.name, permission: "active" }]
            );
        });
        it("Should not let random accounts set new evm contracts addresses", async () => {
            await expectThrow(
                bridge.action.setevmctc(
                    { "bridge_address" : EVM_BRIDGE, "register_address" : EVM_REGISTER },
                    [{ actor: account.name, permission: "active" }]
                ),
                `missing authority of ${config.CONTRACT_NAME}`
            );
        });
        it("Should let admin set the admin", async () => {
            bridge.action.setadmin(
                { "new_admin" : bridgeAccount.name },
                [{ actor: bridgeAccount.name, permission: "active" }]
            );
        });
        it("Should not let random accounts set the admin", async () => {
            await expectThrow(
                bridge.action.setadmin(
                    { "new_admin" : account.name },
                    [{ actor: account.name, permission: "active" }]
                ),
                `missing authority of ${config.CONTRACT_NAME}`
            );
        });
        it("Should let admin set the version", async () => {
            bridge.action.setversion(
                { "new_version" : "2" },
                [{ actor: bridgeAccount.name, permission: "active" }]
            );
        });
        it("Should not let random accounts set the version", async () => {
            await expectThrow(
                bridge.action.setversion(
                    { "new_version" : "2" },
                    [{ actor: account.name, permission: "active" }]
                ),
                `missing authority of ${config.CONTRACT_NAME}`
            );
        });
    });
    describe(":: Sign EVM registration request", function () {
        it("Should let token owners sign registration requests from Antelope", async () => {
            // Todo: find way to have EVM test deployment on same network or mock it
        });
    });
    describe(":: Bridge to EVM", function () {
        it("Should let users bridge a eosio.token token with a registered pair to its paired token on EVM", async () => {
            // Todo: find way to have EVM test deployment on same network or mock it
        });
    });
    describe(":: Bridge from EVM", function () {
        it("Should let anyone notify of a bridging request on EVM", async () => {
            // Todo: find way to have EVM test deployment on same network or mock it
        });
        it("Should revert if no requests are found on EVM", async () => {
            // Todo: find way to have EVM test deployment on same network or mock it
            await expectThrow(
                bridge.action.reqnotify(
                    {},
                    [{ actor: account.name, permission: "active" }]
                ),
                "No requests found"
            );
        });
        it("Should let anyone notify of a refund on EVM", async () => {
            // Todo: find way to have EVM test deployment on same network or mock it
        });
        it("Should revert if no refunds are found on EVM", async () => {
            // Todo: find way to have EVM test deployment on same network or mock it
            await expectThrow(
                bridge.action.refundnotify(
                    {},
                    [{ actor: account.name, permission: "active" }]
                ),
                "No refunds found"
            );
        });
    });
});