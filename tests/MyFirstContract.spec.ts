import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MyFirstContract } from '../wrappers/MyFirstContract';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MyFirstContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MyFirstContract');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let myFirstContract: SandboxContract<MyFirstContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        myFirstContract = blockchain.openContract(MyFirstContract.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await myFirstContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: myFirstContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and myFirstContract are ready to use
    });
});
