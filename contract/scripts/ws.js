import { Alchemy, AlchemySubscription } from 'alchemy-sdk';

const alchemy = new Alchemy();

// Listen to all new pending transactions.
alchemy.ws.on('block', res => console.log(res));

// Listen to only the next transaction on the USDC contract.
alchemy.ws.once(
  {
    method: AlchemySubscription.PENDING_TRANSACTIONS,
    toAddress: 'vitalik.eth'
  },
  res => console.log(res)
);

// Remove all listeners.
//alchemy.ws.removeAllListeners();