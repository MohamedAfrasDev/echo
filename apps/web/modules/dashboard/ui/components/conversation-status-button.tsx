import { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Hint } from "@workspace/ui/components/hint";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

export const ConversationStatusButton = ({
    status,
    onClick,
    disabled
}: {
    status: Doc<"conversations">["status"];
    onClick: () => void;
    disabled?: boolean;
}) => {
    if (status === "resolved") {
        return (
            <Hint text="Mark as resolved">
                <Button disabled={disabled} onClick={onClick} size="sm" variant="tertiary">
                    <CheckIcon />
                    Resolve
                </Button>
            </Hint>
        )
    }

    if (status === "escalated") {
        return (
            <Hint text="Mark as escalated">
                <Button onClick={onClick} size="sm" variant="warning" disabled={disabled}>
                    <ArrowUpIcon />
                    Escalate
                </Button>
            </Hint>
        )
    }

    if (status === "unresolved") {
        return (
            <Hint text="Mark as unresolved">
                <Button onClick={onClick} size="sm" variant="destructive" disabled={disabled}>
                    <ArrowRightIcon />
                    Unresolve
                </Button>
            </Hint>
        )
    }
}