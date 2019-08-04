import { MessageContext } from "vk-io";

export interface ICommand {
  commnad: string;
  info?: string;
  action: (ctx: MessageContext) => Promise < string > ;
  canChat?: boolean;
  canUser?: boolean;
}
