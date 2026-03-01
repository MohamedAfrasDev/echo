"use client";

import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react";

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useInfiniteScroll } from "../src/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "../components/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {


    const setScreen = useSetAtom(screenAtom);

    const setConversationId = useSetAtom(conversationIdAtom);

    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionid = useAtomValue(
        contactSessionIdAtomFamily(organizationId || ""),
    );

    const conversation = usePaginatedQuery(
        api.public.conversations.getMany,
        contactSessionid ? {
            contactSessionId: contactSessionid
        } : "skip",
        {
            initialNumItems: 10
        }
    )
    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
        status: conversation.status,
        loadMore: conversation.loadMore,
        loadSize: 10
    })

    return (
        <>
            <WidgetHeader>
                <div className="flex items-center gap-x-2">
                    <Button
                        variant="transparent"
                        size="icon"
                        onClick={() => { setScreen("selection") }}
                    >
                        <ArrowLeftIcon />
                    </Button>
                </div>
            </WidgetHeader>

            <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
                {conversation?.results.length > 0 && conversation?.results.map((conversation) => (
                    <Button
                        className="h-20 w-full justify-between"
                        key={conversation._id}
                        onClick={() => {
                            setConversationId(conversation._id);
                            setScreen("chat");
                        }}
                        variant="outline"
                    >
                        <div className="flex w-full flex-col gap-4 overflow-hidden text-start">
                            <div className="flex w-full items-center justify-between gap-x-2">
                                <p className="text-muted-foreground text-xs">Chat</p>
                                <p className="text-muted-foreground text-xs">
                                    {formatDistanceToNow(new Date(conversation._creationTime))}
                                </p>
                            </div>
                            <div className="flex w-full items-center justify-between gap-x-2">
                                <p className="truncate text-sm">
                                    {conversation.lastMessage?.text}
                                </p>
                                <ConversationStatusIcon status={conversation.status} className="shrink-0" />
                            </div>
                        </div>
                    </Button>
                ))}

                <InfiniteScrollTrigger ref={topElementRef} canLoadMore={canLoadMore} isLoadingMore={isLoadingMore} onLoadMore={handleLoadMore} />

            </div>

            <WidgetFooter />
        </>
    )
}