import { MessageContext } from "vk-io";
import { Trello } from "~/Integration/trello/TrelloWrap";
import { VK } from "~/Integration/VkIntegration";
import { EventTypes } from "../Event";

import dateformat from 'dateformat';
import { getVersion } from "~/Helper/getVersion";
import Helper from "~/Helper/Helper";
import Premiercinema from "~/Services/cinemas/Premiercinema";
import { IRole } from "../members/interfaces";
import { MessageContextExtended } from "../VkBot/midleware/interfaces";
import { ListCommands } from "./ListCommands";

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

  if (result.length === 0) {
    result = 'У вас нет событий вы талые 👎👎👎💩🙉🙈';
  }

  return result;
}

export async function getAbout(ctx: MessageContext): Promise<string> {
  let ver = null;
  try {
    ver = await getVersion();
  } catch {
    ver = 'Тебя вообще ебёт какая ???!?!!?';
  }

  let result = 'Sorry Bot 🏴‍☠😎';
  if (ver) {
    result += `\nVersion: ${ver}`;
  }
  return result;
}

export async function getPosterToday(ctx: MessageContext): Promise<string> {
  const pc = new Premiercinema();
  const films = await pc.getPosterToday();
  let result = '';
  films.forEach((film, idx) => {
    result += `
${idx + 1}) ${film.name}
Страна ${film.country}
Жанр ${film.genre}
Продолжительность ${film.duration}
В кино ${film.startdate}

`;
  });
  return result;
}

export async function getHelp(ctx: MessageContextExtended): Promise<string> {
  let result = 'Вам доступны следующие команды:\n';
  const allowedAction = [...new Set(Helper.flat(ctx.member.roles.map((role) => role.commands)))];

  ListCommands.forEach((commnad) => {
    let allowed = false;
    if (ctx.isChat) {
      allowed = commnad.canChat;
    } else {
      allowed = commnad.canUser;
    }

    if (allowed && (allowedAction.indexOf(commnad.code) !== -1 || allowedAction.indexOf('*') !== -1)) {
      result += `${commnad.commnad} -- ${commnad.info}\n`;
    }
  });

  return result;
}

export async function tea(ctx: MessageContextExtended): Promise<string> {
  const answer = [
    'Кристя, ну какой ещё чай',
    'неа',
    'в пизду',
    'сама ставь',
    'рыся в чайник насала',
    'я тебе что раб',
    'ага',
    'сейчас очередь рыси',
    'угу',
    'ajhahah',
  ];
  return answer[Helper.randomNumber(0, answer.length - 1)];
}
