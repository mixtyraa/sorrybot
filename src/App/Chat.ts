import { ICard } from '~/Integration/trello/interfaces';
import { Trello } from '~/Integration/trello/TrelloWrap';
import { VK } from '~/Integration/VkIntegration';

export default class Chat {
  public static rxVkId = /chat@[a-zA-zА-Яа-яё0-9]+$/gm;
  /**
   * Данные загружаемые из trello
   */
  public trelloId: string;
  public description: string;

  /**
   * Данные с двух сервисов
   */
  public name: string;
  public vkId: string;

  /**
   * Данные из ВК
   */
  // public member_ids: number[] = [];

  public static async getChat(vkId: string): Promise<Chat> {
    const [trelloChat, vkChat] = await Promise.all([
      Trello.getChat(vkId),
      VK.getConversations(+vkId),
    ]);

    const chat: Chat = new Chat();
    chat.name = vkChat[0].name;
    chat.vkId = vkId;
    chat.trelloId = trelloChat.trelloId;
    chat.description = trelloChat.description;

    return chat;
  }

  public static parseTrello(card: ICard): Chat {
    const newChat = new Chat();
    newChat.name = card.name;
    newChat.description = card.desc;
    newChat.trelloId = card.id;

    const descVkId = (card.desc.match(Chat.rxVkId) || []) [0];
    if (!descVkId) {
      return null;
    }
    newChat.vkId = descVkId.slice(descVkId.indexOf('@') + 1, descVkId.length);
    return newChat;
  }

}
