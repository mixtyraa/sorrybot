
import dialogflow from 'dialogflow';
import uuid from 'uuid';

class DialogflowWrap {
  public async defineAction(text: string): Promise<string> {
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient({
      credentials: {
        client_email: process.env.DIALOGFLOW_CLIENT_EMAIL,
        private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
      }
    });
    const sessionPath = sessionClient.sessionPath(process.env.DIALOGFLOW_PROJECT_ID, sessionId);
    const request: dialogflow.DetectIntentRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: 'ru',
        },
      },
    };

    const response = await sessionClient.detectIntent(request);
    return response[0].queryResult.action;

  }

}

export const Dialogflow = new DialogflowWrap();
