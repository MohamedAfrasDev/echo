import { mutation, query } from "../_generated/server";

import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { components } from "../_generated/api";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";

export const getMany = query({
    args: {
        contactSessionId: v.id("contactSession"),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found"
            })
        };


        const conversations = await ctx.db.query("conversations").withIndex("by_contact_session_id", (q) => q.eq("contactSessionId", args.contactSessionId),).order("desc").paginate(args.paginationOpts);


        const converationsWithLastMessage = await Promise.all(conversations.page.map(async (conversations) => {
            let lastMessage: MessageDoc | null = null;

            const messages = await supportAgent.listMessages(ctx, {
                threadId: conversations.threadId,
                paginationOpts: { numItems: 1, cursor: null },
            });

            if (messages.page.length > 0) {
                lastMessage = messages.page[0] ?? null;
            }

            return {
                _id: conversations._id,
                _creationTime: conversations._creationTime,
                status: conversations.status,
                organizationId: conversations.organizationId,
                threadId: conversations.threadId,
                lastMessage: lastMessage,
            }
        }))

        return {
            ...conversations,
            page: converationsWithLastMessage,
        }
    }
})

export const getOne = query({
    args: {
        conversationId: v.id("conversations"),
        contactSessionId: v.id("contactSession"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found"
            })
        }

        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) {
            return null;
        }

        if (conversation.contactSessionId !== args.contactSessionId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            })
        }

        return {
            _id: conversation._id,
            status: conversation.status,
            threadId: conversation.threadId,
        }
    }
})


export const create = mutation({
    args: {
        organizationId: v.string(),
        contactSessionId: v.id("contactSession"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);


        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            });
        }

        const { threadId } = await supportAgent.createThread(ctx, {
            userId: args.organizationId
        });

        await saveMessage(ctx, components.agent, {
            threadId,
            message: {
                role: "assistant",
                content: "Hello! How can I help you today?"
            }
        })

        const conversationId = await ctx.db.insert("conversations", {
            contactSessionId: session._id,
            status: "unresolved",
            organizationId: args.organizationId,
            threadId: threadId
        });

        return conversationId;
    }
})