import Ti from '../Integration/TrelloIntegration';
import Vi from '../Integration/VkIntegration';
import { IRole } from './RoleList';

export default class Member {
  public vkid: number;
  public firstname: string;
  public lastname: string;
  public domain: string;
  public description: string;
  public links: string[] = [];
  public trelloLoaded: boolean = false;
  public vkLoaded: boolean = false;
  public roles: IRole[] = [];

  public static async getUser(domain: string): Promise<Member> {
    const vi = new Vi();
    const ti = new Ti();
    const vkUser = (await vi.getUser(domain))[0];

    const uDomain = (vkUser.domain === `id${vkUser.vkid}`) ? null : vkUser.domain;
    let tUser = (await ti.getContact(`id${vkUser.vkid}`))[0];
    console.log(tUser);
    if (!tUser) {
      tUser = (await ti.getContact(uDomain))[0];
      console.log(tUser);
    }
    const newMember = new Member();

    newMember.vkLoaded = !!vkUser;
    newMember.trelloLoaded = !!tUser;

    if (vkUser && tUser) {
      newMember.links = tUser.links;
      newMember.description = tUser.description;
      newMember.domain = vkUser.domain;
      newMember.firstname = vkUser.firstname;
      newMember.lastname = vkUser.lastname;
      newMember.vkid = vkUser.vkid;
      newMember.roles = tUser.roles;
      return newMember;
    } else {
      return vkUser || tUser;
    }
  }
}
