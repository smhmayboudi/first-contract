import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MySecondContract } from '../wrappers/MySecondContract';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MySecondContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MySecondContract');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let mySecondContract: SandboxContract<MySecondContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        mySecondContract = blockchain.openContract(MySecondContract.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await mySecondContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: mySecondContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and mySecondContract are ready to use
    });

    it('should getSum', async () => {
        const counterBefore = await deployer.address;
        const counterAfter = await mySecondContract.getSum();
        console.log(counterAfter);
        // expect(counterAfter.toString()).toBe(counterBefore.toString());
    });
});
