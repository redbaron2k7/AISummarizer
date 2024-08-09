import "./styles.css";

import { addButton, removeButton, ButtonItem } from "@api/MessagePopover";
import { addAccessory, removeAccessory } from "@api/MessageAccessories";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { ChannelStore, React, useState, useEffect } from "@webpack/common";
import { Message } from "discord-types/general";

const settings = definePluginSettings({
    customPrompt: {
        type: OptionType.STRING,
        default: "Please summarize the following message into 2-3 sentences, ensuring that the summary is shorter than the original message, concise, and retains the key information. Return only the summary.",
        description: "Custom prompt for the AI summarizer"
    }
});

let aiSession: any = null;
let isAiAvailable = false;

const initializeAiSession = async () => {
    if (!("ai" in window)) {
        isAiAvailable = false;
        return;
    }
    try {
        const status = await (window as any).ai.canCreateTextSession();
        isAiAvailable = status === "readily";
        if (isAiAvailable) {
            aiSession = await (window as any).ai.createTextSession();
        }
    } catch (error) {
        console.error("Error initializing AI session:", error);
        isAiAvailable = false;
    }
};

const AISummarizerIcon: React.FC<{ width?: number; height?: number; }> = ({ width = 24, height = 24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
);

const summaries = new Map<string, (summary: string) => void>();

async function summarizeMessage(content: string): Promise<string> {
    if (!aiSession) {
        return "AI service is not available. https://github.com/redbaron2k7/AISummarizer/tree/main?tab=readme-ov-file#enabling-windowai";
    }

    try {
        const prompt = `${settings.store.customPrompt} "${content}"`;
        const stream = aiSession.promptStreaming(prompt);
        let finalSummary = "";

        for await (const response of stream) {
            finalSummary = response;
        }

        return finalSummary || "Unable to generate summary.";
    } catch (error) {
        console.error("Error summarizing message:", error);
        return "An error occurred while summarizing the message.";
    }
}

const Dismiss: React.FC<{ onDismiss: () => void; }> = ({ onDismiss }) => (
    <button
        onClick={onDismiss}
        className="vc-ai-summarizer-dismiss"
    >
        Dismiss
    </button>
);

const SummaryAccessory: React.FC<{ message: Message; }> = ({ message }) => {
    const [summary, setSummary] = useState<string>("");

    useEffect(() => {
        summaries.set(message.id, setSummary);
        return () => void summaries.delete(message.id);
    }, [message.id]);

    if (!summary) return null;

    return (
        <div className="vc-ai-summarizer-accessory">
            <AISummarizerIcon width={16} height={16} />
            {summary}
            {" - "}
            <Dismiss onDismiss={() => setSummary("")} />
        </div>
    );
};

export default definePlugin({
    name: "AISummarizer",
    description: "Summarize messages using Chrome's local AI",
    authors: [{ name: "redbaron2k7", id: 1142923640778797157n }],
    dependencies: ["MessagePopoverAPI", "MessageAccessoriesAPI"],
    settings,

    async start() {
        await initializeAiSession();

        addAccessory("vc-ai-summarizer", props => <SummaryAccessory message={props.message} />);

        addButton("ai-summarizer", (message: Message): ButtonItem | null => {
            if (!message?.content) return null;

            const channel = message.channel_id ? ChannelStore.getChannel(message.channel_id) : null;
            if (!channel) return null;

            return {
                label: "Summarize",
                icon: AISummarizerIcon,
                message,
                channel,
                onClick: async () => {
                    const summary = await summarizeMessage(message.content);
                    const setSummary = summaries.get(message.id);
                    if (setSummary) {
                        setSummary(summary);
                    }
                }
            };
        });
    },

    stop() {
        removeButton("ai-summarizer");
        removeAccessory("vc-ai-summarizer");
    }
});