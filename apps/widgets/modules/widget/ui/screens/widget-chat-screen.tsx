"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react";
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";



export const WidgetChatScreen = () => {


    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom);
    const conversationId = useAtomValue(conversationIdAtom);
    const organizationId = useAtomValue(organizationIdAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

    const conversation = useQuery(
        api.public.conversations.getOne,
        conversationId && contactSessionId
            ? {
                conversationId,
                contactSessionId
            } : "skip"
    );

    const onBack = () => {
        setConversationId(null);
        setScreen("selection");
    }


    return (
        <>
            <WidgetHeader className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Button size="icon" variant="transparent">

                        <ArrowLeftIcon />
                    </Button>
                </div>
            </WidgetHeader>

            <div className="flex flex-1 flex-col items-center gap-y-4 p-4 ">
                <p>{JSON.stringify(conversation)}</p>

            </div>
        </>
    )
}