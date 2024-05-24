import { toNano } from '@ton/core';
import { MySecondContract } from '../wrappers/MySecondContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mySecondContract = provider.open(MySecondContract.createFromConfig({}, await compile('MySecondContract')));

    await mySecondContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(mySecondContract.address);

    // run methods on `mySecondContract`
}
