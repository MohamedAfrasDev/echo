import { openai } from "@ai-sdk/openai";
import { v } from "convex/values";

import { Agent } from "@convex-dev/agent";

import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
    name: "supportAgent",
    languageModel: openai("gpt-4o-mini"),
    instructions: "You are a customer support agent",
})