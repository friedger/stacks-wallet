import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { selectAddress } from '@store/keys';
import { sumStxTxTotal } from '@utils/sum-stx-tx-total';
import { selectAvailableBalance } from '@store/address';
import { stxBalanceValidator } from '@utils/validators/stx-balance-validator';
import { useMempool } from './use-mempool';

export function useBalance() {
  const { outboundMempoolTxs } = useMempool();
  const address = useSelector(selectAddress);

  const sumTotal = outboundMempoolTxs.reduce(
    (acc, tx) => acc.plus(sumStxTxTotal(address || '', tx)),
    new BigNumber(0)
  );

  console.log({ sumTotal: sumTotal.toString() });

  const availableBalanceValue = useSelector(selectAvailableBalance);
  const availableBalance = useMemo(
    () => new BigNumber(availableBalanceValue || 0).minus(sumTotal),
    [availableBalanceValue, sumTotal]
  );
  const availableBalanceValidator = useCallback(() => stxBalanceValidator(availableBalance), [
    availableBalance,
  ]);
  return {
    availableBalance,
    availableBalanceValidator,
  };
}
