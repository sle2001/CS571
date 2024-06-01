import AIEmoteType from "../../components/chat/messages/AIEmoteType";
import { isLoggedIn, ofRandom } from "../Util"

const createLoginSubAgent = (end) => {

    let stage;

    let username, password;

    const handleInitialize = async (promptData) => {
        if(await isLoggedIn()) {
            return end("You are already logged in, try logging out first")
        } else {
            stage = "FOLLOWUP_USERNAME";
            return "Ok, what is your username?"
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PASSWORD";
        return {
            msg: "Great, and what is your password?",
            nextIsSensitive: true
        }
    }

    const handleFollowupPassword = async (prompt) => {
        password = prompt;
        const resp = await fetch("https://cs571.org/api/s24/hw11/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        
        if (resp.status === 200) {
            return end({
                msg: "Successfully logged in!",
                emote: AIEmoteType.SUCCESS
            })
        } else {
            return end({
                msg: "Sorry, that username and/or password is incorrect.",
                emote: AIEmoteType.ERROR
            })
        }      
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;