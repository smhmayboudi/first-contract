import { toNano } from '@ton/core';
import { MyFirstContract } from '../wrappers/MyFirstContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const myFirstContract = provider.open(MyFirstContract.createFromConfig({}, await compile('MyFirstContract')));

    await myFirstContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(myFirstContract.address);

    // run methods on `myFirstContract`
}
