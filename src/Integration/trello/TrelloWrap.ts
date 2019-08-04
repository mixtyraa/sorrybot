import BodyParser from 'body-parser';
import Express from 'express';
import RemoveMarkdown from 'remove-markdown';
import { MemoryCache } from '~/App/Cache';
import Chat from '~/App/Chat';
import Event from '~/App/Event';
import {EventTypes} from '~/App/Event';
import Member from '~/App/members/Member';
import Roles from '~/App/members/Roles';
import TrelloApi from '~/Integration/trello/TrelloApi';
import { IAction } from './interfaces';

interface IUnitUnfo {
  id: string;
  name: string;
  cachePath ?: string;
}

class TrelloWrap {
  protected readonly infoBoard: IUnitUnfo = {
    id: process.env.TRELLO_BOARD,
    name: process.env.TRELLO_BOARD,
    cachePath: null,
  };

  protected readonly infoEvents: { [key: string]: IUnitUnfo } = {
    DRAFT: {
      id: null,
      name: process.env.TRELLO_LIST_EVENTS_DRAFT,
      cachePath: 'events/draft',
    },
    OFFER: {
      id: null,
      name: process.env.TRELLO_LIST_EVENTS_OFFER,
      cachePath: 'events/offer',
    },
    ACCEPTED: {
      id: null,
      name: process.env.TRELLO_LIST_EVENTS_ACCEPTED,
      cachePath: 'events/accepted',
    },
    SUCCESS: {
      id: null,
      name: process.env.TRELLO_LIST_EVENTS_SUCCESS,
      cachePath: 'events/success',
    },
    SUCKER: {
      id: null,
      name: process.env.TRELLO_LIST_EVENTS_SUCKER,
      cachePath: 'events/sucker',
    },
  };

  protected readonly infoContact: IUnitUnfo = {
    id: null,
    name: process.env.TRELLO_LIST_CONTACTS,
    cachePath: 'contacts',
  };

  protected readonly infoChat: IUnitUnfo = {
    id: null,
    name: process.env.TRELLO_LIST_CHATS,
    cachePath: 'chats',
  };

  protected readonly infoMember: IUnitUnfo = {
    id: null,
    name: null,
    cachePath: 'members',
  };

  protected readonly mapListCard: IUnitUnfo[] = [];

  protected trelloConnection: TrelloApi = null;

  protected expressServer: Express.Application = null;

  public constructor() {
    if (!process.env.TRELLO_APP_KEY) {
      throw new Error('Trello TRELLO_APP_KEY not set up');
    }

    if (!process.env.TRELLO_TOKEN) {
      throw new Error('Trello TRELLO_TOKEN not set up');
    }

    this.trelloConnection = new TrelloApi(
      process.env.TRELLO_TOKEN,
      process.env.TRELLO_APP_KEY,
    );

    this.expressServer = Express();
  }

  public async start() {
    this.infoMember.id = (await this.trelloConnection.tokens()).idMember;
    const boards = await this.trelloConnection.memberBoards(this.infoMember.id);
    const boardEvents = boards.find((board) => board.name === this.infoBoard.name);
    if (boardEvents) {
      this.infoBoard.id = boardEvents.id;
    } else {
      throw new Error(`Not found board with name ${this.infoBoard.name}`);
    }

    const lists = await this.trelloConnection.boardLists(this.infoBoard.id);

    Object.keys(this.infoEvents).forEach((key) => {
      const list = lists.find((x) => x.name === this.infoEvents[key].name);
      if (list) {
        this.infoEvents[key].id = list.id;
      } else {
        throw new Error(`Not found event with name ${this.infoEvents[key].name}`);
      }
    });

    const chatList = lists.find((x) => x.name === this.infoChat.name);

    if (chatList) {
      this.infoChat.id = chatList.id;
    } else {
      throw new Error(`Not found board with name ${this.infoChat.name}`);
    }

    const contactList = lists.find((x) => x.name === this.infoContact.name);

    if (contactList) {
      this.infoContact.id = contactList.id;
    } else {
      throw new Error(`Not found board with name ${this.infoContact.name}`);
    }

    this.mapListCard.push(
      this.infoBoard,
      this.infoChat,
      this.infoContact,
      this.infoMember,
      ...Object.values(this.infoEvents)
    );

    await this.startWebhook();
  }

  public async getChat(vkId: string): Promise<Chat> {
    const cachedChat = MemoryCache.get(this.infoChat.cachePath, vkId);

    if (cachedChat) {
      return cachedChat;
    }

    const chats = await this.trelloConnection.listCards(this.infoChat.id);
    let result: Chat = null;

    chats.reduce((accChats, chat) => {
      const newChat = Chat.parseTrello(chat);

      if (newChat) {
        return accChats;
      }

      if (newChat.vkId === vkId) {
        result = newChat;
      }
      accChats.push(newChat);

      MemoryCache.set(this.infoChat.cachePath, newChat.vkId, newChat);
      return accChats;
    }, []);

    return result;
  }

  public async addChat(name: string, vkId: string): Promise<Chat> {
    const existsChat = await this.getChat(vkId);

    if (existsChat) {
      return existsChat;
    }

    const chat = new Chat();
    chat.description = `chat@${vkId}`;
    chat.name = name;
    chat.vkId = vkId;

    const response = await this.trelloConnection.addCard({
      name: chat.name,
      idList: this.infoChat.id,
      desc: chat.description
    });
    chat.trelloId = response.id;
    MemoryCache.set(this.infoChat.cachePath, chat.vkId, chat);
    return chat;
  }

  public async getContact(vkDomain: string): Promise<Member> {
    const cachedContact = MemoryCache.get(this.infoMember.cachePath, vkDomain);

    if (cachedContact) {
      return cachedContact;
    }

    const members = await this.trelloConnection.listCards(this.infoContact.id);

    let result: Member = null;

    members.forEach((member) => {
      const newMember = new Member();

      newMember.trelloId = member.id;

      newMember.description = RemoveMarkdown(member.desc);
      newMember.links = newMember.description.match(Member.rxId);
      const fullname = (member.name || '').split(' ');
      newMember.firstname = fullname[0];
      newMember.lastname = fullname[1];

      newMember.roles = [
        ...newMember.roles,
        ...(newMember.description
          .match(Roles.rxId) || [])
          .reduce((roles, descRole) => {
            const role = Roles.getRole(descRole.slice(descRole.indexOf('@') + 1, descRole.length));
            if (role && role !== Roles.getRole('member')) {
              roles.push(role);
            }
            return roles;
          }, []),
      ];

      newMember.domain = (newMember.links[0] || '')
        .slice((newMember.links[0] || '').indexOf('vk.com/') + 'vk.com/'.length, (newMember.links[0] || '').length);

      if (newMember.domain === vkDomain) {
        result = newMember;
      }

      MemoryCache.set(this.infoMember.cachePath, newMember.domain, newMember);
    });

    return result;
  }

  public async addContact(member: Member): Promise<Member> {
    const existsMember = await this.getContact(member.domain);
    if (existsMember) {
      return existsMember;
    }

    let description = `https://vk.com/${member.domain}\n`;
    member.roles.forEach((role) => {
      description += `role@${role.code}\n`;
    });

    const response = await this.trelloConnection.addCard({
      name: `${member.firstname} ${member.lastname}`,
      idList: this.infoContact.id,
      desc: description
    });

    member.description = description;
    member.trelloId = response.id;
    member.links = ['https://vk.com/${member.domain}'];
    return member;
  }

  public async getEvents(type: EventTypes): Promise<Event[]> {
    const cachedEvents = MemoryCache.get(this.infoEvents[type].cachePath);

    if (cachedEvents) {
      return cachedEvents;
    }

    const events = await this.trelloConnection.listCards(this.infoEvents[type].id);
    return await Promise.all(events.map(async (event) => {
      const instance = new Event();
      if (event.attachments) {
        await Promise.all(event.attachments.map(async (attachment) => {
          if (attachment.isUpload === false) {
            const baseUrl = 'https://trello.com/c/';
            let id = attachment.url;
            if (id.indexOf(baseUrl) === 0) {
              id = id.slice(baseUrl.length);
              id = id.slice(0, id.indexOf('/'));
              const card = await this.trelloConnection.getCard(id);
              if (card.idList === this.infoChat.id) {
                const chat = Chat.parseTrello(card);
                if (chat) {
                  instance.chats.push(chat);
                }
              }
            }
          }
        }));
      }
      instance.trelloId = event.id;
      instance.description = event.desc;
      instance.name = event.name;
      instance.dateStart = new Date(event.due);
      MemoryCache.set(this.infoEvents[type].cachePath, instance.trelloId, instance);
      return instance;
    }));
  }

  public async startWebhook() {
    this.expressServer.use(BodyParser.json());
    const port = process.env.WEBHOOK_SERVER_PORT || 3000;
    await this.expressServer.listen(
      port,
      () => console.log(`Webhook server started on port ${port}`)
    );
    await this.expressServer.head(process.env.TRELLO_WEBHOOK_PATH, (req, res) => {
      res.end();
    });
    await this.expressServer.post(process.env.TRELLO_WEBHOOK_PATH, (req, res) => {
      res.end();
      const action: IAction = req.body.action;
      console.log(action.type);
      switch (action.type) {
        case 'updateCard':
        case 'createCard':
        case 'deleteCard':
          const list = this.mapListCard.find((x) => x.id === action.data.list.id);
          if (list.cachePath) {
            MemoryCache.clear(list.cachePath);
          }
      }
    });
    this.updateWebhook();
  }

  public async updateWebhook() {
    const existsToken = await this.trelloConnection.getTokensWebhooks(process.env.TRELLO_TOKEN);
    const whUrl = `${process.env.TRELLO_WEBHOOK_BASE_URL}${process.env.TRELLO_WEBHOOK_PATH}`;
    const isActiveWebhook = existsToken.find((wh) => wh.callbackURL === whUrl && wh.active);
    if (!isActiveWebhook) {
      try {
        await this.trelloConnection.addWebhook({
          callbackURL: whUrl,
          idModel: this.infoBoard.id,
        });
      } catch (e) {
        if (e.response) {
          console.log(e.response.data);
        } else {
          console.error(e);
        }
      }
    }
  }
}

export const Trello = new TrelloWrap();
