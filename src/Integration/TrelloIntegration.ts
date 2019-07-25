import Event from '~/App/Event';
import Member from '~/App/Member';
import Roles from '~/App/RoleList';

export default class TrelloIntegration {
  private trello: any = null;
  private nameBoardContacts: string;
  private idBoard: string;
  private listContact: any;
  private rgxpRole = /role@[a-zA-zА-Яа-яё]+$/gm;

  public constructor() {
    const Trello = require('trello');

    if (!process.env.TRELLO_APP_KEY) {
      throw new Error('Trello TRELLO_APP_KEY not set up');
    }

    if (!process.env.TRELLO_TOKEN) {
      throw new Error('Trello TRELLO_TOKEN not set up');
    }

    this.trello = new Trello('c2d1dda36c4098b8ae4be4ecaebb3cd1', '10726723bf5b04f25c5e4b69749e462c16c89a6b8bfc08265430e95c4e0729e6');

    this.nameBoardContacts = process.env.TRELLO_BOARD_CONTACTS || 'Контакты';

    if (!process.env.TRELLO_BOARD) {
      throw new Error('Trello id board not set up');
    }
    this.idBoard = process.env.TRELLO_BOARD;
  }

  public async getCardContact(): Promise < any > {
    const lists = await this.trello.getListsOnBoard(this.idBoard);
    this.listContact = lists.filter((val: any) => val.name === this.nameBoardContacts)[0];
    return this.listContact;
  }

  public async getContacts(): Promise < Member[] > {
    const listContact = await this.getCardContact();
    const contactsCard = await this.trello.getCardsOnList(listContact.id);
    const rmmd = require('remove-markdown');
    const conctactsTrello: Member[] = contactsCard.map((contact: any) => {
      const member = new Member();

      // отчищаем описание карточки от markdown
      const description = rmmd(contact.desc);

      // вытаскиваем всё ссылки на вк, среди них есть ссылка на профайл вк
      const vkRegex = /vk.com\/[a-zA-Z0-9]+/gm;
      const vkLinks = description.match(vkRegex);

      // достаем роли
      const role: string[] = description.match(this.rgxpRole);
      console.log(role);
      if (role) {
        role.forEach((rol) => {
          const oRole = Roles.getRole(rol.substr(5));
          member.roles.push(oRole);
        });
      }

      const fullname = (contact.name || '').split(' '); // не точно !
      member.description = description;
      member.firstname = fullname[0];
      member.lastname = fullname[1];
      member.links = vkLinks;
      member.trelloLoaded = true;

      return member;
    });

    return conctactsTrello;
  }

  public async importContract(listMember: Member[]) {
    const contractCards = await this.getContacts();
    listMember.forEach(async (contact) => {
      const exists = !!contractCards.filter((contactTrello) => {
        const idLink = `vk.com/${contact.vkid}`;
        const domainLink = `vk.com/${contact.domain}`;
        const linksVk = (contactTrello.links || []).join(', ');
        return linksVk.indexOf(idLink) !== -1 || linksVk.indexOf(domainLink) !== -1;
      }).length;
      if (!exists) {
        console.log('contract не существует');
        const result = await this.addContact(contact);
      }
    });
  }

  public async addContact(contact: Member): Promise < any > {
    contact.links.push(`https://vk.com/${contact.domain}`);
    contact.description = `https://vk.com/${contact.domain}`;
    try {
      // TODO добавить проверку на существование, чтобы не дублировались записи
      this.trello.addCard(
        `${contact.firstname} ${contact.lastname}`,
        contact.description,
        this.listContact.id);
      contact.trelloLoaded = true;
      return contact;
    } catch {
      return false;
    }
  }

  public async getContact(domain: string) {
    const contacts = await this.getContacts();
    // console.log(contacts);
    const domainLink = `vk.com/${domain}`;
    const user = contacts.filter((contact) => {
      const find = contact.links.find((link) => {
        return link.indexOf(domainLink) !== -1;
      });
      return !!find;
    });

    return user;
  }

  public async getActiveEvents(): Promise<Event[]> {
    const lists = await this.trello.getListsOnBoard(this.idBoard);
    const eventList = lists.filter((val: any) => val.name === process.env.TRELLO_BOARD_ACTIVE_EVENTS)[0];
    const eventsCard = await this.trello.getCardsOnList(eventList.id);
    console.log(eventsCard);
    return eventsCard.map((event: any) => {
      const instance = new Event();
      instance.description = event.desc;
      instance.name = event.name;
      instance.dateStart = new Date(event.due);
      return instance;
    });

  }
}
