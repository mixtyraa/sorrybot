import Bot from '~/App/VkBot/Bot';
import { Trello } from './Integration/trello/TrelloWrap';

(async () => {
  await Trello.start().then(() => {
    console.log('Trello init');
  });

  new Bot().start().then(() => {
    console.log('Valera is started');
  });
})();
