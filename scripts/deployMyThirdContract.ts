import { toNano } from '@ton/core';
import { MyThirdContract } from '../wrappers/MyThirdContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const myThirdContract = provider.open(
        MyThirdContract.createFromConfig(
            {
                number: 0,
                address: provider.sender().address!,
            },
            await compile('MyThirdContract'),
        ),
    );

    await myThirdContract.sendDeploy(provider.sender(), toNano('0.05'), 1);

    await provider.waitForDeploy(myThirdContract.address);

    // run methods on `myThirdContract`
}
