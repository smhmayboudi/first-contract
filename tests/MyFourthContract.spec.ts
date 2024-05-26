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
    let deployer: SandboxContract<TreasuryContract>;
    let myFourthContract: SandboxContract<MyFourthContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        myFourthContract = blockchain.openContract(
            MyFourthContract.createFromConfig(
                {
                    counter: 0,
                    sender: deployer.address,
                    owner: deployer.address,
                },
                code,
            ),
        );

        const deployResult = await myFourthContract.sendDeploy(deployer.getSender(), toNano('0.05'), 1);

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: myFourthContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and myFourthContract are ready to use
    });

    it('getData', async () => {
        const data = await myFourthContract.getData();
        expect(data.recent_sender.toString()).toBe(deployer.address.toString());
        expect(data.number).toEqual(1);
    });
});
