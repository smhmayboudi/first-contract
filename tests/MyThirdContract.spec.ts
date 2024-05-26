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

        deployer = await blockchain.treasury('deployer');

        myThirdContract = blockchain.openContract(
            MyThirdContract.createFromConfig(
                {
                    number: 0,
                    address: deployer.address,
                },
                code,
            ),
        );

        const deployResult = await myThirdContract.sendDeploy(deployer.getSender(), toNano('0.05'), 1);

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

    it('getData', async () => {
        const data = await myThirdContract.getData();
        expect(data.recent_sender.toString()).toBe(deployer.address.toString());
        expect(data.number).toEqual(1);
    });
});
