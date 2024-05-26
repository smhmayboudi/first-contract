import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type MyFourthContractConfig = {
    counter: number;
    sender: Address;
    owner: Address;
};

export function myFourthContractConfigToCell(config: MyFourthContractConfig): Cell {
    return beginCell().storeUint(config.counter, 32).storeAddress(config.sender).storeAddress(config.owner).endCell();
}

export class MyFourthContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new MyFourthContract(address);
    }

    static createFromConfig(config: MyFourthContractConfig, code: Cell, workchain = 0) {
        const data = myFourthContractConfigToCell(config);
        const init = { code, data };
        return new MyFourthContract(contractAddress(workchain, init), init);
    }

    async sendIncrement(provider: ContractProvider, via: Sender, value: bigint, amount: number) {
        const msg_body = beginCell()
            .storeUint(1, 32) // OP code
            .storeUint(amount, 32) // amount value
            .endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
        const msg_body = beginCell()
            .storeUint(2, 32) // OP code
            .endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async sendWithdrawalRequest(provider: ContractProvider, sender: Sender, value: bigint, amount: bigint) {
        const msg_body = beginCell()
            .storeUint(3, 32) // OP code
            .storeCoins(amount) // amount value
            .endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async sendNoCodeDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
        const msg_body = beginCell().endCell();
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get('get_contract_storage_data', []);
        return {
            counter: stack.readNumber(),
            sender: stack.readAddress(),
            owner: stack.readAddress(),
        };
    }

    async getBalance(provider: ContractProvider) {
        const { stack } = await provider.get('balance', []);
        return {
            balance: stack.readNumber(),
        };
    }
}
