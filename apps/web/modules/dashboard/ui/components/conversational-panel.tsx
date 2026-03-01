"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon, CornerUpLeftIcon, ListIcon } from "lucide-react";
import { DicebearAvatar } from "@workspace/ui/components/dicebar-avatar";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/hooks/infinite-scroll-trigger"
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "../../atoms";
import { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { Skeleton } from "@workspace/ui/components/skeleton";
export const ConversationalPanel = () => {


    const pathName = usePathname();

    const statusFilter = useAtomValue(statusFilterAtom);
    const setStatusFilter = useSetAtom(statusFilterAtom);

    const conversations = usePaginatedQuery(api.private.conversations.getMany, {
        status: statusFilter === "all" ? undefined : statusFilter
    }, {
        initialNumItems: 10,
    });

    const {
        topElementRef,
        handleLoadMore,
        canLoadMore,
        isLoadingMore,
        isLoadingFirstPage,
    } = useInfiniteScroll(
        {
            status: conversations.status,
            loadMore: conversations.loadMore,
            loadSize: 10,
            observerEnabled: false,
        }
    );

    return (
        <div className="flex h-full w-full flex-col bg-background text-sidebar-foreground">
            <div className="flex flex-col gap-3.5 border-b p-2">
                <Select
                    defaultValue="all"
                    onValueChange={(value) => setStatusFilter(value as "unresolved" | "escalated" | "resolved" | "all")}
                    value={statusFilter}
                >
                    <SelectTrigger
                        className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0"
                    >
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <ListIcon className="size-4" />
                                <span>All</span>
                            </div>

                        </SelectItem>
                        <SelectItem value="unresolved">
                            <div className="flex items-center gap-2">
                                <ArrowRightIcon className="size-4" />
                                <span>Unresolved</span>
                            </div>

                        </SelectItem>
                        <SelectItem value="escalated">
                            <div className="flex items-center gap-2">
                                <ArrowUpIcon className="size-4" />
                                <span>Escalated</span>
                            </div>

                        </SelectItem>
                        <SelectItem value="resolved">
                            <div className="flex items-center gap-2">
                                <CheckIcon className="size-4" />
                                <span>Resolved</span>
                            </div>

                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {isLoadingFirstPage ? (
                <SkeletonConversation />
            ) : (
                <ScrollArea className="max-h-[calc(100vh-53px)]">
                    <div className="flex w-full flex-1 flex-col text-sm">
                        {conversations.results.map((conversations) => {
                            const isLastMessageFromOperator = conversations.lastMessage?.message?.role !== "user";


                            const country = getCountryFromTimezone(conversations.contactSession.metadata?.timezone);


                            const countryFlagUrl = country?.code
                                ? getCountryFlagUrl(country.code)
                                : undefined;

                            return (
                                <Link
                                    key={conversations._id}
                                    className={cn("relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                                        pathName === `/conversations/${conversations._id}` && "bg-accent text-accent-foreground"
                                    )}
                                    href={`/conversations/${conversations._id}`}
                                >
                                    <div className={cn("-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                                        pathName === `/conversations/${conversations._id}` && "opacity-100"
                                    )} />

                                    <DicebearAvatar seed={conversations.contactSession._id}
                                        size={40} className="shrink-0" badgeImageUrl={countryFlagUrl} />

                                    <div className="flex-1">
                                        <div className="flex w-full items-center gap-2">
                                            <span className="truncate font-bold">
                                                {conversations.contactSession.name}
                                            </span>
                                            <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                                                {formatDistanceToNow(conversations._creationTime)}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between gap-2">
                                            <div className="flex w-0 grow items-center gap-1">
                                                {isLastMessageFromOperator && (
                                                    <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
                                                )}

                                                <span className={cn("line-clamp-1 text-muted-foreground", !isLastMessageFromOperator && "font-black text-black")}>
                                                    {conversations.lastMessage?.text}
                                                </span>
                                            </div>
                                            <ConversationStatusIcon status={conversations.status} />

                                        </div>
                                    </div>

                                </Link>
                            )
                        })}

                        <InfiniteScrollTrigger
                            canLoadMore={canLoadMore}
                            isLoadingMore={isLoadingMore}
                            onLoadMore={handleLoadMore}
                            ref={topElementRef}
                        />
                    </div>
                </ScrollArea>
            )}
        </div>
    )
}


export const SkeletonConversation = () => {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
            <div className="relative flex w-full min-w-0 flex-col p-2">
                <div className="w-full space-y-2">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            className="flex items-start gap-3 rounded-lg p-4" key={index}>

                            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                            <div className="min-w-0 flex-1">
                                <div className="flex w-full items-center gap-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="ml-auto h-3 w-12 shrink-0" />
                                </div>
                                <div className="mt-2">
                                    <Skeleton className="h-3 w-full" />
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}