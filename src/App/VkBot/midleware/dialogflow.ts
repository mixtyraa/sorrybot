import { Dialogflow } from "~/Integration/dialogflow/DialogflowWrap";
import { MessageContextExtended } from "./interfaces";

export async function dialogflow(ctx: MessageContextExtended, next: () => {}) {
  ctx.action = await Dialogflow.defineAction(ctx.text);
  if (ctx.action.action) {
    next();
  }
}
