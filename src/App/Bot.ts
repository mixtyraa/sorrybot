import VK, {MessageContext} from 'vk-io';
import { ICommand } from '~/App/commands/interfaces';
import {ListCommands} from '~/App/commands/ListCommands';
import { Trello } from '~/Integration/trello/TrelloWrap';
import Chat from './Chat';
import Member from './members/Member';

export default class Bot {
  private vk: VK;

  public constructor() {
    this.vk = new VK({
      token: process.env.BOT_VK_TOKEN
    });
  }

  public async start() {
    await Trello.start();

    ListCommands.forEach((command) => {
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
      if (role.commands.indexOf('*') !== -1) {
        allowed = true;
        return false;
      }

      const res = role.commands.find((cmd) => cmd === commnad.commnad);
      if (res) {
        allowed = true;
        return false;
      }
    });

    if (allowed) {
      if (ctx.isChat === true) {
        allowed = commnad.canChat;
      } else {
        allowed = commnad.canUser;
      }
    }

    if (allowed) {
      const result = await commnad.action(ctx);
      ctx.send(result);
    }
  }
}
