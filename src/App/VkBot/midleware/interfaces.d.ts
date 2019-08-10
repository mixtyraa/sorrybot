import {MessageContext} from 'vk-io';
import Member from '~/App/members/Member';
import { IAction } from '~/Integration/dialogflow/interfaces';
import { ICommand } from '~/App/commands/interfaces';

export interface MessageContextExtended extends MessageContext {
  isCommand: boolean;
  member: Member;
  action: IAction;
  command: ICommand;
}
