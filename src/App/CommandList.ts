import { MessageContext } from 'vk-io';
import CommandHandlers from './CommandHandlers';

export interface ICommand {
  commnad: string;
  info?: string;
  action: (ctx: MessageContext) => Promise < string > ;
  canChat?: boolean;
  canUser?: boolean;
}

export default class CommandList {
  public static readonly commandList: ICommand[] = [
    {
      commnad: '/start',
      info: 'Добавляет беседу в трелло',
      canChat: true,
      canUser: false,
      action: CommandHandlers.start
    },
    {
      commnad: '/события',
      info: 'Показывает события',
      canChat: true,
      canUser: false,
      action: CommandHandlers.activeEvent
    }
  ];

  public static getCommand(commnad: string) {
    return this.commandList.find((cmd) => cmd.commnad === commnad);
  }
}
