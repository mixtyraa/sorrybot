import Member from '~/App/members/Member';
import { MessageContextExtended } from './interfaces';

/**
 * Идентифицирует пользователя в системе
 *
 * @param ctx
 * @param next
 */
export async function loadMember(ctx: MessageContextExtended, next: () => {}) {
  ctx.member = await Member.getUser(`id${ctx.senderId}`);
  next();
}
