import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MySecondContractConfig = {};

export function mySecondContractConfigToCell(config: MySecondContractConfig): Cell {
    return beginCell().endCell();
}

export class MySecondContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new MySecondContract(address);
    }

    static createFromConfig(config: MySecondContractConfig, code: Cell, workchain = 0) {
        const data = mySecondContractConfigToCell(config);
        const init = { code, data };
        return new MySecondContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getSum(provider: ContractProvider) {
        const result = await provider.get('get_sum', []);
        return result.stack.readAddress();
    }
}
