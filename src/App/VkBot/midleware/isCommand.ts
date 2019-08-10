import Executor from '../Executor';
import { MessageContextExtended } from './interfaces';

/**
 * Устанавливает признак команды,
 * заверщаем работу обработки запроса
 *
 * @param ctx
 * @param next
 */
export function isCommand(ctx: MessageContextExtended, next: () => {}) {
  ctx.isCommand =  ctx.text[0] === '/';
  Executor.do(ctx);
}
