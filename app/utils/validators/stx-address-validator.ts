import * as yup from 'yup';
import { validateStacksPrincipal } from '../get-stx-transfer-direction';
import { validateAddressChain } from '../../crypto/validate-address-net';
import { NETWORK } from '@constants/index';

// accepts standard and contract addresses
export function stxPrincipalSchema() {
  let timer = 0;
  return yup
    .string()
    .defined('Must define a STX address')
    .test({
      name: 'address-validation',
      async test(value: any, context) {
        return new Promise(resolve => {
          clearTimeout(timer);
          timer = window.setTimeout(() => {
            if (!value) return resolve(false);
            const valid = validateStacksPrincipal(value);

            if (!valid) {
              return resolve(
                context.createError({ message: 'Input address is not a valid STX address' })
              );
            }
            if (!validateAddressChain(value)) {
              return resolve(context.createError({ message: `Must use a ${NETWORK} STX address` }));
            }
            return resolve(true);
          }, 400);
        });
      },
    });
}
