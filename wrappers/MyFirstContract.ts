import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MyFirstContractConfig = {};

export function myFirstContractConfigToCell(config: MyFirstContractConfig): Cell {
    return beginCell().endCell();
}

export class MyFirstContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MyFirstContract(address);
    }

    static createFromConfig(config: MyFirstContractConfig, code: Cell, workchain = 0) {
        const data = myFirstContractConfigToCell(config);
        const init = { code, data };
        return new MyFirstContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
