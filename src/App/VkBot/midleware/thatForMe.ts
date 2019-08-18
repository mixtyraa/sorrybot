import { MessageContextExtended } from "./interfaces";

const triggers: string[] = ['валера',
  'валер',
  'валерчик',
  'валерий аркадьевич',
  'рыжий'
];

/**
 * Определяет, относится ли сказаное к боту
 *
 * @param ctx
 * @param next
 */
export async function thatForMe(ctx: MessageContextExtended, next: () => {}) {
  const msg = ctx.text.toLowerCase();
  let isTrigger: boolean = false;
  triggers.forEach((trigger) => {
    if (msg.indexOf(trigger) !== -1) {
      isTrigger = true;
      return false;
    }
  });

  if (isTrigger) {
    next();
  }
}
