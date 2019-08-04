import {RoleList} from '~/App/members/RoleList';
import { IRole } from './interfaces';

export default class Roles {
  public static rxId = /role@[a-zA-zА-Яа-яё]+$/gm;
  public static getRole(code: string): IRole {
    return RoleList.find((value) => value.code === code);
  }
}
