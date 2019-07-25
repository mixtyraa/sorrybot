import VK, {MessageContext} from 'vk-io';
import CommandsList from '~/App/CommandList';
import { ICommand } from '~/App/CommandList';
import Member from './Member';

export default class Bot {
  private vk: VK;

  public constructor() {
    this.vk = new VK({
      token: process.env.BOT_VK_TOKEN
    });
    this.vk.updates.use((ctx, next) => {
      console.log(ctx);
      next();
    });
  }

  public start() {
    CommandsList.commandList.forEach((command) => {
      this.vk.updates.hear(command.commnad, (ctx) => {
        this.callAction(ctx, command);
      });
    });
    this.vk.updates.start().catch(console.error);
    console.log('Bot started');
  }

  protected async callAction(ctx: MessageContext, commnad: ICommand) {
    const domain = `id${ctx.senderId}`;
    const member: Member = await Member.getUser(domain);
    let allowed = false;

    member.roles.forEach((role) => {
      const res = role.commands.find((cmd) => cmd === commnad.commnad);
      if (res) {
        allowed = true;
        return false;
      }
    });

    if (ctx.isChat === true) {
      allowed = commnad.canChat;
    } else {
      allowed = commnad.canUser;
    }

    if (allowed) {
      const result = await commnad.action(ctx);
      ctx.send(result);
    }
  }
}
