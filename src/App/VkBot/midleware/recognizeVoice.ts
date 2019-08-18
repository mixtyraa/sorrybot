import { DocumentAttachment } from 'vk-io';
import SpeechKit from '~/Integration/speechkit/SpeechKit';
import { MessageContextExtended } from './interfaces';

/**
 * Распазнает сказаное в голосовом сообщении
 *
 * @param ctx
 * @param next
 */
export async function recognizeVoice(ctx: MessageContextExtended, next: () => {}) {
  if (ctx.isCommand === false
    && ctx.hasAttachments()
    && (ctx.attachments[0] as DocumentAttachment).typeName === 'audio') {
      ctx.text = await SpeechKit.recognizeUrl((ctx.attachments[0] as DocumentAttachment).url);
  }
  next();
}
