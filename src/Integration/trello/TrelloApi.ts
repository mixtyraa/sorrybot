import axios, { AxiosRequestConfig } from 'axios';
import { IAddCardRequest, IAddWebhookRequest, IAttachment, IBoard, ICard, IList, ITokenResonse, IWebhook } from './interfaces';

export default class TrelloApi {
  private appkey: string = null;
  private token: string = null;
  protected readonly url: string = 'https://api.trello.com';

  public constructor(token: string, appkey: string) {
    this.appkey = appkey;
    this.token = token;
  }

  public async request(method: 'post' | 'get' | 'put' | 'delete', url: string, data: object = null, query: object = null): Promise<any> {
    const config: AxiosRequestConfig = {
      baseURL: `${this.url}${url}`,
      timeout: 60000,
      method,
      params: {
        token: this.token,
        key: this.appkey,
      }
    };

    if (data) {
      config.data = data;
    }

    if (query) {
      config.params = {
        ...config.params,
        ...query
      };
    }

    return (await axios.request(config)).data;
  }

  public tokens(): Promise<ITokenResonse> {
    return this.request('get', `/1/tokens/${this.token}`);
  }

  /**
   * Lists the boards that the user is a member of
   *
   * @param id The ID or username of the member
   *
   * @returns
   */
  public memberBoards(id: string): Promise<IBoard[]> {
    return this.request('get', `/1/members/${id}/boards`);
  }

  /**
   * List the cards in a list
   *
   * @param id The ID of the board
   */
  public boardLists(id: string): Promise<IList[]> {
    return this.request('get', `/1/boards/${id}/lists`);
  }

  /**
   *
   * @param id The ID of the list
   */
  public listCards(id: string): Promise<ICard[]> {
    return this.request('get', `/1/lists/${id}/cards`, null, {
      attachments: true
    });
  }

  /**
   *
   * @param id The ID of the list
   */
  public async addCard(data: IAddCardRequest): Promise<ICard> {
    return this.request('post', `/1/cards`, data);
  }

  public async getCardsAttachments(id: string): Promise<IAttachment[]> {
    return this.request('get', `/1/cards/${id}/attachments`);
  }

  public async getCard(id: string): Promise<ICard> {
    return this.request('get', `/1/cards/${id}`, null, {
      attachments: true
    });
  }

  public async addWebhook(data: IAddWebhookRequest): Promise <IWebhook> {
    return this.request('post', `/1/webhooks/`, null, data);
  }

  public async getTokensWebhooks(token: string): Promise <IWebhook[]> {
    return this.request('get', `/1/tokens/${token}/webhooks`);
  }
}
