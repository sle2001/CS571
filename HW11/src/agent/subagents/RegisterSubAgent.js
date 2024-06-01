import AIEmoteType from "../../components/chat/messages/AIEmoteType";
import { isLoggedIn, ofRandom } from "../Util"

const createRegisterSubAgent = (end) => {

    let stage;

    let username, password, confirmedPassword;

    const handleInitialize = async (promptData) => {
        if(await isLoggedIn()) {
            return end("You are already logged in, try logging out first")
        } else {
            stage = "FOLLOWUP_USERNAME";
            return "Ok, what do you want as your username?"
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
            case "FOLLOWUP_CONFIRM_PASSWORD": return await handleFollowupConfirmPassword(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PASSWORD";
        return {
            msg: "Great, and what do you want your password to be?",
            nextIsSensitive: true
        }
    }

    const handleFollowupPassword = async (prompt) => {
        password = prompt;
        stage = "FOLLOWUP_CONFIRM_PASSWORD";
        return {
            msg: "Can you retype the password?",
            nextIsSensitive: true
        }
    }

    const handleFollowupConfirmPassword = async(prompt) => {
        confirmedPassword = prompt;

        if(password !== confirmedPassword) {
            return "The passwords do not match";
        } else {
            const resp = await fetch("https://cs571.org/api/s24/hw11/register", {
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
                    msg: "Success! You have been registered.",
                    emote: AIEmoteType.SUCCESS
                })
            } else if(resp.status === 409) {
                return end({
                    msg: "The user already exists",
                    emote: AIEmoteType.ERROR
                })
            } else if(resp.status === 413) {
                return end({
                    msg: "'username' must be 64 characters or fewer and 'password' must be 128 characters or fewer",
                    emote: AIEmoteType.ERROR
                })
            } else if(resp.status === 400) {
                return end({
                    msg: "A request must contain a 'username' and 'password'", 
                    emote: AIEmoteType.ERROR
                })
            } else {
                return end({
                    msg: "Something went wrong when registering",
                    emote: AIEmoteType.ERROR
                })
            }
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createRegisterSubAgent;