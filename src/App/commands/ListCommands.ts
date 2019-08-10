import { getAbout, getAcceptedEvents, getPosterToday, start } from '~/App/commands/Commands';
import { ICommand } from '~/App/commands/interfaces';

export const ListCommands: ICommand[] = [
  {
    commnad: '/start',
    info: 'Добавляет беседу в трелло',
    canChat: true,
    canUser: false,
    action: start,
    code: 'start',
  },
  {
    commnad: '/события',
    info: 'Показывает события',
    canChat: true,
    canUser: false,
    action: getAcceptedEvents,
    code: 'getAcceptedEvents',
  },
  {
    commnad: '/бот',
    info: 'Информация о боте',
    canChat: true,
    canUser: true,
    action: getAbout,
    code: 'getAbout',
  },
  {
    commnad: '/кино',
    info: 'Афиша в Премьере на этот месяц',
    canChat: true,
    canUser: true,
    action: getPosterToday,
    code: 'getPosterToday'
  }
];
