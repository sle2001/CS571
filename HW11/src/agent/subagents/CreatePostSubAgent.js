import AIEmoteType from "../../components/chat/messages/AIEmoteType";
import { isLoggedIn, ofRandom } from "../Util"

const createPostSubAgent = (end) => {

    const CS571_WITAI_ACCESS_TOKEN = "TGKLBARMJ2BYFSRQOADW44OA6CHVTHYA";

    let stage;

    let title, content, confirm, chatroom;

    const handleInitialize = async (promptData) => {

        const hasSpecifiedChatroom = promptData.entities["chatrooms:chatrooms"] ? true : false;

        if(await isLoggedIn()) {
            if(hasSpecifiedChatroom) {
                chatroom = promptData.entities["chatrooms:chatrooms"][0].value;
                stage = "FOLLOWUP_TITLE";
                return ofRandom([
                    "Sure, what would you like the title to be?",
                    "Alright, what would you like to be the title?"
                ])
            } else {
                return end("Please specify a chatroom");
            }
        } else {
            return end(ofRandom([
                "You must be signed in to create a post.",
                "Please sign in before creating a post."
            ]))
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_TITLE": return await handleFollowupTitle(prompt);
            case "FOLLOWUP_CONTENT": return await handleFollowupContent(prompt);
            case "FOLLOWUP_CONFIRM": return await handleFollowupConfirm(prompt);
        }
    }

    const handleFollowupTitle = async(prompt) => {
        title = prompt;
        stage = "FOLLOWUP_CONTENT";
        return ofRandom([
            "Sounds good, what do you want as the content?",
            "Great, what do you want the content to be?"
        ])
    }

    const handleFollowupContent = async(prompt) => {
        content = prompt;
        stage = "FOLLOWUP_CONFIRM";
        return ofRandom([
            "Sounds good, are you ready to post this comment?",
            "Great, are you ready to post this comment?"
        ])
    }

    const handleFollowupConfirm = async (prompt) => {
        confirm = prompt;
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0 && data.intents[0].name === 'wit$confirmation') {
            await fetch(`https://cs571.org/api/s24/hw11/messages?chatroom=${chatroom}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            })
            return end({
                msg: "Your post has been posted!",
                emote: AIEmoteType.SUCCESS
            });
        } else {
            return end(ofRandom([
                "No worries, if you want to create a post in the future, just ask!",
                "That's alright, if you want to create a post in the future, just ask!"
            ]))
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createPostSubAgent;