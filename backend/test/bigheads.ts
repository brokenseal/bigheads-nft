import { expect } from "chai";
import web3 from "web3";

const BigHeads = artifacts.require("BigHeads");
const Utils = artifacts.require("Utils");

contract("Utils", (accounts) => {
  const user = accounts[0];

  it("retrieves a random string from given array", async () => {
    const instance = await Utils.new();
    const testArray = ["one", "two", "three", "four"];

    const transactionResult = await instance.getRandomItemFromArray(
      testArray,
      3,
      { from: user }
    );

    expect(testArray).to.contain(transactionResult[0]);
  });

  it("moves found value to index of the cursor", async () => {
    const instance = await Utils.new();
    const testArray = ["one", "two", "three", "four"];

    const transactionResult = await instance.getRandomItemFromArray(
      testArray,
      2,
      { from: user }
    );

    const result = transactionResult[0];
    const newArray = transactionResult[1];

    expect(newArray[2]).to.equal(result);
  });

  it("moves found values to index of the cursor", async () => {
    const instance = await Utils.new();
    let testArray = ["one", "two", "three", "four", "five"];

    const results: Array<[string, string[], number]> = [];

    for (const cursor of [4, 3, 2, 1, 0]) {
      const transactionResult = await instance.getRandomItemFromArray(
        testArray,
        cursor,
        { from: user }
      );

      const result = transactionResult[0];
      testArray = transactionResult[1];
      const newCursor = transactionResult[2];

      results.push([result, testArray, newCursor.toNumber()]);
    }

    console.log("results", results);
  });

  it("returns an empty", async () => {
    const instance = await Utils.new();
    const testArray = ["one", "two", "three", "four"];

    const transactionResult = await instance.getRandomItemFromArray(
      testArray,
      3,
      {
        from: user,
      }
    );

    expect(testArray).to.contain(transactionResult[0]);
  });

  it("exhausts all strings from an array", async () => {
    const instance = await Utils.new();
    let testArray = ["one", "two", "three", "four"];

    let transactionResult = await instance.getRandomItemFromArray(
      testArray,
      3,
      {
        from: user,
      }
    );

    expect(testArray).to.contain(transactionResult[0]);

    testArray = transactionResult[1];

    transactionResult = await instance.getRandomItemFromArray(testArray, 3, {
      from: user,
    });

    expect(testArray).to.contain(transactionResult[0]);

    testArray = transactionResult[1];

    transactionResult = await instance.getRandomItemFromArray(testArray, 3, {
      from: user,
    });

    expect(testArray).to.contain(transactionResult[0]);

    testArray = transactionResult[1];

    transactionResult = await instance.getRandomItemFromArray(testArray, 3, {
      from: user,
    });

    expect(testArray).to.contain(transactionResult[0]);
  });
});

contract("BigHeads", (accounts) => {
  const defaultURIs = ["uri 1", "uri 2", "uri 3", "uri 4"];
  const owner = accounts[0];
  const user = accounts[1];

  const createNewInstance = async () => {
    return await BigHeads.new(defaultURIs, { from: owner });
  };

  it("has zero minted nfts at the beginning", async () => {
    const instance = await createNewInstance();
    const minted = await instance.getMinted();

    expect(minted).to.have.lengthOf(0);
  });

  it("has 4 NFTs to mint at the beginning", async () => {
    const instance = await createNewInstance();
    const availableCount = await instance.getAvailableCount();

    expect((availableCount as any).words[0]).to.eq(4);
  });

  it("mints one", async () => {
    const instance = await createNewInstance();

    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei("0.01", "ether"),
    });
    const minted = await instance.getMinted();

    expect(minted).to.have.lengthOf(1);
  });

  it("mints two", async () => {
    const instance = await createNewInstance();

    for (const _ in [1, 2]) {
      await instance.mint(user, {
        from: user,
        value: web3.utils.toWei("0.01", "ether"),
      });
    }
    const minted = await instance.getMinted();

    expect(minted).to.have.lengthOf(2);
  });

  it("mints three", async () => {
    const instance = await createNewInstance();

    for (const _ in [1, 2, 3]) {
      await instance.mint(user, {
        from: user,
        value: web3.utils.toWei("0.01", "ether"),
      });
    }
    const minted = await instance.getMinted();

    expect(minted).to.have.lengthOf(3);
  });

  it("mints four", async () => {
    const instance = await createNewInstance();

    for (const _ in [1, 2, 3, 4]) {
      await instance.mint(user, {
        from: user,
        value: web3.utils.toWei("0.01", "ether"),
      });
    }

    const minted = await instance.getMinted();

    expect(minted).to.have.lengthOf(4);
  });

  it("does not mint more than available URIs", async () => {
    const instance = await createNewInstance();
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei("0.01", "ether"),
    });
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei("0.01", "ether"),
    });
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei("0.01", "ether"),
    });
    await instance.mint(user, {
      from: user,
      value: web3.utils.toWei("0.01", "ether"),
    });

    await instance
      .mint(user, {
        from: user,
        value: web3.utils.toWei("0.01", "ether"),
      })
      .then(() => {
        assert.fail("It should have thrown an exception but it didn't");
      })
      .catch((error) => {
        assert.ok(!!error);
      });
  });
});
