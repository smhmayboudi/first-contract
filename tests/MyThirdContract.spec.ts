import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MyThirdContract } from '../wrappers/MyThirdContract';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MyThirdContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MyThirdContract');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let myThirdContract: SandboxContract<MyThirdContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        myThirdContract = blockchain.openContract(MyThirdContract.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await myThirdContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: myThirdContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and myThirdContract are ready to use
    });
});
