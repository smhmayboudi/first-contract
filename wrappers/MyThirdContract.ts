import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MyThirdContractConfig = {
    number: number;
    address: Address;
};

export function myThirdContractConfigToCell(config: MyThirdContractConfig): Cell {
    return beginCell().storeUint(config.number, 32).storeAddress(config.address).endCell();
}

export class MyThirdContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

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

    async sendIncrement(provider: ContractProvider, sender: Sender, value: bigint, increment_by: number) {
        const msg_body = beginCell()
            .storeUint(1, 32) // OP code
            .storeUint(increment_by, 32) // increment_by value
            .endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get('get_contract_storage_data', []);
        return {
            number: stack.readNumber(),
            recent_sender: stack.readAddress(),
        };
    }
}
