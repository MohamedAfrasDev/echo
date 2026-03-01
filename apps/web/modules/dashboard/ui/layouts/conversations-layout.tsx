import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@workspace/ui/components/resizable";
import { ConversationalPanel } from "../components/conversational-panel";



export const ConversationsLayout = ({
    children
}: { children: React.ReactNode; }) => {
    return (
        <ResizablePanelGroup className="h-full flex-1">
            <ResizablePanel defaultSize={300} maxSize={300} minSize={100}>
                <ConversationalPanel />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="h-full" defaultSize={300}>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
};