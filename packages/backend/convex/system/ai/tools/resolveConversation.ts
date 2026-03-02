import { createTool } from "@convex-dev/agent";

import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";



export const resolveConversation = createTool({
    description: "Resolve a conversation",
    args: z.object({}),
    handler: async (ctx, args) => {
        if (!ctx.threadId) {
            return "Missing thread Id";
        }




        await ctx.runMutation(internal.system.conversation.resolve, {
            threadId: ctx.threadId,
        });

        return "Conversation resolved";
    }
})