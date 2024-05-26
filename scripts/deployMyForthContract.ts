import { toNano } from '@ton/core';
import { MyForthContract } from '../wrappers/MyForthContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const myForthContract = provider.open(MyForthContract.createFromConfig({}, await compile('MyForthContract')));

    await myForthContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(myForthContract.address);

    // run methods on `myForthContract`
}
