import { getAbout, getAcceptedEvents, start } from '~/App/commands/Commands';
import { ICommand } from '~/App/commands/interfaces';

export const ListCommands: ICommand[] = [
  {
    commnad: '/start',
    info: 'Добавляет беседу в трелло',
    canChat: true,
    canUser: false,
    action: start
  },
  {
    commnad: '/события',
    info: 'Показывает события',
    canChat: true,
    canUser: false,
    action: getAcceptedEvents
  },
  {
    commnad: '/бот',
    info: 'Информация о боте',
    canChat: true,
    canUser: true,
    action: getAbout
  }
];
