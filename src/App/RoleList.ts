export interface IRole {
  name: string;
  code: string;
  commands: string[];
}

export default class RoleList {
  private static RoleList: IRole[] = [
    {
      code: 'admin',
      name: 'Администратор',
      commands: [/*'/start'*/]
    },
    {
      code: 'member',
      name: 'Участник',
      commands: ['/события']
    }
  ];

  public static getRole(code: string) {
    return this.RoleList.find((value) => value.code === code);
  }
}
