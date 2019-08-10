import VK from 'vk-io';
import Executor from './Executor';
import { command } from './midleware/command';
import { dialogflow } from './midleware/dialogflow';
import { MessageContextExtended } from './midleware/interfaces';
import { isCommand } from './midleware/isCommand';
import { loadMember } from './midleware/loadMember';
import { recognizeVoice } from './midleware/recognizeVoice';
import { thatForMe } from './midleware/thatForMe';

export default class Bot {
  private vk: VK;

  public constructor() {
    this.vk = new VK({
      token: process.env.BOT_VK_TOKEN
    });
  }

  /**
   * Устанавливает middleware
   */
  protected initMw() {
    /**
     * Загружает данные по участнику
     * и записывает в ctx.member
     */
    this.vk.updates.use(loadMember);
    /**
     * Определяет явную команду
     *
     * Явной командой является текст, который начинается со слэша,
     * например: /кино, /события, /бот
     *
     * Если подтверждается, что пришла явная комманда,
     * управление переходит сразу к MW command,
     * пропуская остальные
     *
     * Устанавливает значение ctx.isCommand
     */
    this.vk.updates.use(isCommand);
    /**
     * Если пришло голосовое сообщение распазнает речь
     *
     * Текст из голосового сообщения помещает в ctx.text
     */
    this.vk.updates.use(recognizeVoice);
    /**
     * Провреят, относится ли сказаное к боту
     *
     * Если сказанное относится к боту то действие передается
     * следующему MW
     */
    this.vk.updates.use(thatForMe);
    /**
     * Распазнает действие по тексту с помощью сервиса DialogFlow
     *
     * Устанавливает ctx.action
     *
     * Если действие на распознано, то прекращает обработку запроса
     */
    this.vk.updates.use(dialogflow);
    /**
     * Находит команду и проверяет разрешение на выполнение
     *
     * Прерывает обработку запроса, если команда не найдена,
     * изи выполнение запрещено
     */
    this.vk.updates.use(command);

  }

  public async start() {
    this.vk.updates.on('message', async (ctx: MessageContextExtended, next) => {
      Executor.do(ctx);
    });

    this.vk.updates.start().catch(console.error);
  }

}
