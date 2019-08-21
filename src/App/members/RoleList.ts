import {IRole} from '~/App/members/interfaces';

export const RoleList: IRole[] = [
  {
    code: 'admin',
    name: 'Администратор',
    commands: ['*']
  },
  {
    code: 'member',
    name: 'Участник',
    commands: ['getAcceptedEvents', 'getAbout', 'getPosterToday', 'getHelp']
  },
  {
    code: 'kristinaurk',
    name: 'Кристя',
    commands: ['tea']
  }
];
