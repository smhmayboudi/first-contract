import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MyFourthContract } from '../wrappers/MyFourthContract';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MyFourthContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MyFourthContract');
    });

    let blockchain: Blockchain;
    let sender: SandboxContract<TreasuryContract>;
    let owner: SandboxContract<TreasuryContract>;
    let myFourthContract: SandboxContract<MyFourthContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        sender = await blockchain.treasury('sender');
        owner = await blockchain.treasury('owner');
        myFourthContract = blockchain.openContract(
            MyFourthContract.createFromConfig(
                {
                    counter: 0,
                    sender: sender.address,
                    owner: owner.address,
                },
                code,
            ),
        );
    });

    it('sendIncrement', async () => {
        const deployResult = await myFourthContract.sendIncrement(sender.getSender(), toNano('0.05'), 1);
        expect(deployResult.transactions).toHaveTransaction({
            from: sender.address,
            to: myFourthContract.address,
            deploy: true,
            success: true,
        });
    });

    it('sendDeposit', async () => {
        const depositMessageResult = await myFourthContract.sendDeposit(sender.getSender(), toNano('5'));
        expect(depositMessageResult.transactions).toHaveTransaction({
            from: sender.address,
            to: myFourthContract.address,
            success: true,
        });
        const balanceRequest = await myFourthContract.getBalance();
        expect(balanceRequest.balance).toBeGreaterThan(toNano('4.99'));
    });

    it('getData', async () => {
        const deployResult = await myFourthContract.sendIncrement(sender.getSender(), toNano('0.05'), 1);
        expect(deployResult.transactions).toHaveTransaction({
            from: sender.address,
            to: myFourthContract.address,
            deploy: true,
            success: true,
        });
        const data = await myFourthContract.getData();
        expect(data.counter).toEqual(1);
        expect(data.sender.toString()).toBe(sender.address.toString());
        expect(data.owner.toString()).toBe(owner.address.toString());
    });

    it('getBalance', async () => {
        const deployResult = await myFourthContract.sendIncrement(sender.getSender(), toNano('0.05'), 1);
        expect(deployResult.transactions).toHaveTransaction({
            from: sender.address,
            to: myFourthContract.address,
            deploy: true,
            success: true,
        });
        const data = await myFourthContract.getBalance();
        expect(data.balance).toBeGreaterThan(toNano(0.048));
    });
});
