import Axios from 'axios';
import VK, {MessageContext} from 'vk-io';
import { ICommand } from '~/App/commands/interfaces';
import {ListCommands} from '~/App/commands/ListCommands';
import { Dialogflow } from '~/Integration/dialogflow/DialogflowWrap';
import { Trello } from '~/Integration/trello/TrelloWrap';
import { Wit } from '~/Integration/wit/WitWrap';
import Chat from './Chat';
import Member from './members/Member';

export default class Bot {
  private vk: VK;
  private triggers: string[] = ['валера', 'валер', 'валерчик'];
  public constructor() {
    this.vk = new VK({
      token: process.env.BOT_VK_TOKEN
    });
  }

  public async start() {
    await Trello.start();

    this.vk.updates.on('message', async (ctx, next) => {
      if (ctx.hasAttachments()) {
        const audio: any = ctx.attachments[0];
        if (audio.typeName === 'audio') {
          let url = (await Axios.get(audio.url)).request.res.responseUrl;
          url = url.slice(0, -3) + 'mp3';
          const mp3Response = (await Axios({
            url,
            method: 'GET',
            responseType: "arraybuffer"
          }));
          const mp3body = Buffer.from(mp3Response.data, 'binary');
          ctx.text = await Wit.recognition(mp3body);
          console.log(ctx.text);
        }
      }

      const command = ListCommands.find(((cmd) => cmd.commnad === ctx.text));
      if (command) {
        this.callAction(ctx, command);
      } else {
        let isTrigger = false;
        const msg = ctx.text.toLowerCase();
        this.triggers.forEach((trigger) => {
          if (msg.indexOf(trigger) !== -1) {
            isTrigger = true;
            return false;
          }
        });
        if (isTrigger) {
          const action = await Dialogflow.defineAction(ctx.text);
          console.log(action);
          const dfcmd = ListCommands.find(((cmd) => cmd.commnad === action));
          if (dfcmd) {
            this.callAction(ctx, dfcmd);
          }
        }
      }
    });

    this.vk.updates.start().catch(console.error);
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
