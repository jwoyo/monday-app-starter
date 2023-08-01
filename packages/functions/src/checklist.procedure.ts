import {mondayOAuthUserProcedure} from './server';
import {z} from 'zod';

/**
 * builds a procedure that requires that the user has access to the monday item which the checklist is connected to.
 * @return {middleware} middleware
 */
export const checklistProcedure = mondayOAuthUserProcedure
    .input(
        z.object({
          itemId: z.number(),
        }))
    .use(async (opts) => {
      const mondayItem = await opts.ctx.mondayClient
          .itemById({id: opts.input.itemId})
          .catch(async (err) => {
            console.warn('Could not find item ' + opts.input.itemId, err);
            return null;
          });
      if (!mondayItem?.items?.[0]) {
        throw new Error('Item not found');
      }
      return opts.next();
    });
