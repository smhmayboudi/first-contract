import { toNano } from '@ton/core';
import { MyFourthContract } from '../wrappers/MyFourthContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const myFourthContract = provider.open(
        MyFourthContract.createFromConfig(
            {
                counter: 0,
                sender: provider.sender().address!,
                owner: provider.sender().address!,
            },
            await compile('MyFourthContract'),
        ),
    );

    await myFourthContract.sendDeposit(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(myFourthContract.address);

    // run methods on `myFourthContract`
}
