import Axios from 'axios';
import request from 'request-promise';

export default class SpeechKit {
  public static async recognize(audio: Buffer): Promise<string> {
    return JSON.parse((await request.post({
      uri: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
      qs: {
        lang: 'ru-RU',
        topic: 'general',
      },
      headers: {
        'Authorization': `Api-Key ${process.env.SPEECHKIT_API_KEY}`,
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: audio
    }))).result;
  }

  public static async recognizeUrl(url: string): Promise<string> {
    const response = await Axios.get(url, {responseType: "arraybuffer"});
    const bin = Buffer.from(response.data);
    return await SpeechKit.recognize(bin);
  }
}
