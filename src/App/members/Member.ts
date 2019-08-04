import { IRole } from '~/App/members/interfaces';
import { Trello } from '~/Integration/trello/TrelloWrap';
import { VK } from '~/Integration/VkIntegration';
import Roles from './Roles';

export default class Member {
  public vkid: number;
  public trelloId: string;
  public firstname: string;
  public lastname: string;
  public domain: string;
  public description: string;
  public links: string[] = [];
  public roles: IRole[] = [];
  public static rxId = /vk.com\/[a-zA-Z0-9]+/gm;

  public constructor() {
    this.roles.push(Roles.getRole('member'));
  }

  public static async getUser(domain: string): Promise<Member> {
    const vkUser = (await VK.getUser(domain))[0];

    const uDomain = (vkUser.domain === `id${vkUser.vkid}`) ? null : vkUser.domain;
    let trelloUser = (await Trello.getContact(`id${vkUser.vkid}`));

    if (!trelloUser) {
      trelloUser = (await Trello.getContact(uDomain));
    }
    const newMember = new Member();

    if (vkUser && trelloUser) {
      newMember.links = trelloUser.links;
      newMember.description = trelloUser.description;
      newMember.domain = vkUser.domain;
      newMember.firstname = vkUser.firstname;
      newMember.lastname = vkUser.lastname;
      newMember.vkid = vkUser.vkid;
      newMember.roles = trelloUser.roles;
      return newMember;
    } else {
      return vkUser;
    }
  }
}
