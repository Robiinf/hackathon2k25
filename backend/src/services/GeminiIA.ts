import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { IiAAgent } from "./IiAAgent";

export class GeminiIA implements IiAAgent<ChatGoogleGenerativeAI> {
    private model: ChatGoogleGenerativeAI;
    constructor(){
        this.model = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            temperature: 0
        });
    }

    getModel(): ChatGoogleGenerativeAI {
        return this.model;
    }
}