import { ListCommands } from '~/App/commands/ListCommands';
import { MessageContextExtended } from './interfaces';

/**
 * Находит запрашиваемую команду и определяет разрешение на выполнение
 * если команда запрещена, то заверщает работу по этому запросу
 *
 * @param ctx
 * @param next
 */
export async function command(ctx: MessageContextExtended, next: () => void) {
  if (ctx.isCommand) {
    const end = ctx.text.indexOf(' ') === -1 ? ctx.text.length : ctx.text.indexOf(' ');
    const ctxCmd = ctx.text.slice(0,  end);
    ctx.command = ListCommands.find((cmd) => cmd.commnad === ctxCmd);
  } else {
    ctx.command = ListCommands.find((cmd) => cmd.commnad === ctx.action.action);
  }

  if (ctx.command) {
    let allowed = false;
    // проверяем, можем ли пользователь выполнить комманду
    ctx.member.roles.forEach((role) => {
      if (role.commands.indexOf('*') !== -1) {
        allowed = true;
        return false;
      }

      const res = role.commands.find((cmd) => cmd === ctx.command.code);

      if (res) {
        allowed = true;
        return false;
      }

      // проверяем может ли команда выполнятся из чата или диалога
      if (allowed) {
        if (ctx.isChat === true) {
          allowed = ctx.command.canChat;
        } else {
          allowed = ctx.command.canUser;
        }
      }
    });
    // если действие разрешено идем дальше
    if (allowed) {
      next();
    }
  }

}
