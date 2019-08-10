import { MessageContextExtended } from "./midleware/interfaces";

export default class Executor {
  public static async do(ctx: MessageContextExtended) {
    const result = await ctx.command.action(ctx);
    ctx.send(result);
  }

}
