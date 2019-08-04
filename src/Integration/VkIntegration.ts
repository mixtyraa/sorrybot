import VKIO from 'vk-io';
import Chat from '~/App/Chat';
import Member from '~/App/members/Member';

class VkIntegration {
  private vk: VKIO = null;

  public constructor() {
    this.vk = new VKIO({
      token: process.env.BOT_VK_TOKEN
    });
  }

  public async getMemberChat(peer_id: number): Promise < Member[] > {
    const response = await this.vk.api.messages.getConversationMembers({
      peer_id,
      fields: ['domain']
    });

    const result: Member[] = response.profiles.map((member) => {
      const mem = new Member();
      mem.firstname = member.first_name;
      mem.lastname = member.last_name;
      mem.domain = member.domain;
      mem.vkid = member.id;

      return mem;
    });
    return result;
  }

  public async getConversations(peer_ids: number | number[]): Promise<Chat[]> {

    const response = await this.vk.api.messages.getConversationsById({
      peer_ids,
    });

    return response.items.map((items) => {
      const chat = new Chat();
      // chat.member_ids = items.chat_settings.active_ids;
      chat.name = items.chat_settings.title;
      return chat;
    });

  }

  public async getUser(user_ids: string | string[]): Promise < Member[] > {
    const response = await this.vk.api.users.get({
      user_ids,
      fields: ['domain']
    });
    return response.map((user) => {
      const member = new Member();
      member.firstname = user.first_name;
      member.lastname = user.last_name;
      member.domain = user.domain;
      member.vkid = user.id;
      return member;
    });
  }
}

export const VK = new VkIntegration();
