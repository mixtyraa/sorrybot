import Executor from '../Executor';
import { command } from './command';
import { MessageContextExtended } from './interfaces';

/**
 * Устанавливает признак команды,
 * заверщаем работу обработки запроса
 *
 * @param ctx
 * @param next
 */
export function isCommand(ctx: MessageContextExtended, next: () => void) {
  ctx.isCommand = (ctx.text || '')[0] === '/';

  if (ctx.isCommand) {
    command(ctx, () => {
      Executor.do(ctx);
    });
  } else {
    next();
  }
}
