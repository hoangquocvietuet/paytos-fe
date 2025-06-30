module paytos::payment {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::event::{emit};

    #[event]
    struct SentEvent<phantom CoinType> has drop, store {
        sender: address,
        receiver: address,
        ephemeral_public_key: vector<u8>,
        value: u64,
    }

    public entry fun send<CoinType>(
        sender: &signer,
        receiver: address,
        ephemeral_public_key: vector<u8>,
        amount: u64,
    ) {
        let coin = coin::withdraw<CoinType>(sender, amount);
        coin::deposit<CoinType>(receiver, coin);
        emit(SentEvent<CoinType> {
            sender: signer::address_of(sender),
            receiver,
            ephemeral_public_key,
            value: amount,
        });
    }
}
