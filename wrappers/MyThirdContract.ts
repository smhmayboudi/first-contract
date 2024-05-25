import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MyThirdContractConfig = {};

export function myThirdContractConfigToCell(config: MyThirdContractConfig): Cell {
    return beginCell().endCell();
}

export class MyThirdContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MyThirdContract(address);
    }

    static createFromConfig(config: MyThirdContractConfig, code: Cell, workchain = 0) {
        const data = myThirdContractConfigToCell(config);
        const init = { code, data };
        return new MyThirdContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
