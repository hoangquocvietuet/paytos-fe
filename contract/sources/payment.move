module paytos::payment {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::event::{emit};
    use aptos_framework::object::Object;
    use aptos_framework::primary_fungible_store;

    #[event]
    struct SentEvent<phantom CoinType> has drop, store {
        sender: address,
        receiver: address,
        ephemeral_public_key: vector<u8>,
        value: u64,
    }

    public entry fun send<CoinType: key>(
        sender: &signer,
        metadata: Object<CoinType>,
        recipient: address,
        ephemeral_public_key: vector<u8>,
        amount: u64,
    ) {
        primary_fungible_store::transfer<CoinType>(sender, metadata, recipient, amount);
        emit(SentEvent<CoinType> {
            sender: signer::address_of(sender),
            receiver: recipient,
            ephemeral_public_key,
            value: amount,
        });
    }
}
