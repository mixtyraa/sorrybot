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
    commands: ['/события', '/бот', '/кино']
  }
];
