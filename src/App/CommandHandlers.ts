import dateform from 'dateformat';
import { MessageContext } from 'vk-io';
import TrelloIntegration from '../Integration/TrelloIntegration';
import VkIntegration from '../Integration/VkIntegration';
import Member from './Member';

export default class CommandHandlers {
  public static vi = new VkIntegration();
  public static ti = new TrelloIntegration();

  public static async start(ctx: MessageContext): Promise<string> {
    try {
      const userChat = await this.vi.getMemberChat(ctx.peerId);
      this.ti.importContract(userChat as Member[]);
    } catch (e) {
      return 'Не удалось экспортировать чат';
    }
  }

  public static async activeEvent(ctx: MessageContext): Promise<string> {
    console.log('activeEvent');

    const events = await CommandHandlers.ti.getActiveEvents();
    if (!events) {
      return 'Нет событий, вы талые!';
    }

    let result = `У нас по планам ${events.length} событие: `;
    events.forEach((event, idx) => {
      result += `
${idx + 1}) ${event.name}:
${event.description}
Начало: ${dateform(event.dateStart, 'dd.mm.yyyy HH:MM')}
      `;
    });

    return result;
  }
}
