import request from 'request-promise';

class WitWrap {
  public async recognition(audio: Buffer) {
    return JSON.parse((await request.post({
      uri: 'https://api.wit.ai/speech',
      headers: {
        'Accept': 'audio/x-mpeg-3',
        'Authorization': `Bearer ${process.env.WIT_KEY}`,
        'Content-Type': 'audio/mpeg3',
        'Transfer-Encoding': 'chunked'
      },
      body: audio
    })))._text;
  }
}

export const Wit = new WitWrap();
