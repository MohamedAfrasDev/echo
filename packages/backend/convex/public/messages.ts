import { ConvexError, v } from "convex/values"
import { action, query } from "../_generated/server"
import { internal } from "../_generated/api"
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";

export const create = action({
    args: {
        prompt: v.string(),
        threadId: v.string(),
        contactSessionId: v.id("contactSession"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.runQuery(internal.system.ai.contactSessions.getOne, {
            contactSessionId: args.contactSessionId
        });

        if (!contactSession || contactSession.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            })
        };

        const conversation = await ctx.runQuery(internal.system.conversation.getByThreadId, {
            threadId: args.threadId
        });

        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found"
            })
        };

        if (conversation.status === "resolved") {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation is already resolved"
            })
        };


        const { thread } = await supportAgent.continueThread(ctx, {
            threadId: args.threadId,
        });

        await (thread.generateText as any)({
            prompt: args.prompt
        });
    }
});


export const getMany = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        contactSessionId: v.id("contactSession")
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.db.get(args.contactSessionId);

        if (!contactSession || contactSession.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            });


        }

        const paginated = await supportAgent.listMessages(ctx, {
            threadId: args.threadId,
            paginationOpts: args.paginationOpts
        });

        return paginated;

    }
})