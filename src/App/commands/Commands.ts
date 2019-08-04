import { MessageContext } from "vk-io";
import { Trello } from "~/Integration/trello/TrelloWrap";
import { VK } from "~/Integration/VkIntegration";
import { EventTypes } from "../Event";

import dateformat from 'dateformat';
import { getVersion } from "~/Helper/getVersion";

export async function start(ctx: MessageContext): Promise<string> {
  try {
    const vkId = ctx.peerId;
    const chatInfo = await VK.getConversations(vkId);
    await Trello.addChat(chatInfo[0].name, vkId.toString());
    return 'Веселимся, ребят!🍾🎉';
  } catch (e) {
    console.log(e);
    return 'Не удалось экспортировать чат';
  }
}

export async function getAcceptedEvents(ctx: MessageContext): Promise<string> {
  const events = await Trello.getEvents(EventTypes.ACCEPTED);
  let result: string = '';

  events.filter((event) => event.chats.find((chat) => +chat.vkId === ctx.peerId))
  .forEach((event, idx) => {
    result += `\n`;
    result += `${idx + 1}) ${event.name}\n`;
    if (event.description) {
      result += `${event.description}\n`;
    }

    if (event.dateStart.getTime() !== 0) {
      result += `Когда: ${dateformat(event.dateStart, 'dd.mm.yyyy HH:MM')}`;
    }
    result += `\n`;
  });
  return result;
}

export async function getAbout(ctx: MessageContext): Promise<string> {
  const ver = await getVersion();
  let result = 'Sorry Bot';
  if (ver) {
    result += `\nVersion: ${ver}`;
  }
  return result;
}
