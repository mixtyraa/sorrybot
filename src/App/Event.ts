import Chat from './Chat';
import Member from './members/Member';

export enum EventTypes {
  DRAFT = 'DRAFT',
  OFFER = 'OFFER',
  ACCEPTED = 'ACCEPTED',
  SUCCESS = 'SUCCESS',
  SUCKER = 'SUCKER'
}

export default class Event {
  public trelloId: string;
  public description: string;
  public dateStart: Date;
  public member: Member[];
  public name: string;
  public type: EventTypes;
  public chats: Chat[] = [];
}
