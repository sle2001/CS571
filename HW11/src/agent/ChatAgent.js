import createChatDelegator from "./ChatDelegator";
import {isLoggedIn, logout, ofRandom, getLoggedInUsername} from "./Util"

const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "TGKLBARMJ2BYFSRQOADW44OA6CHVTHYA"; // Put your CLIENT access token here.

    const delegator = createChatDelegator();

    let chatrooms = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571.org/api/s24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
            }
        });
        const data = await resp.json();
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const handleTranscription = async (rawSound, contentType) => {
        const resp = await fetch(`https://api.wit.ai/dictation`, {
            method: "POST",
            headers: {
                "Content-Type": contentType,
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            },
            body: rawSound
        })
        const data = await resp.text();
        const transcription = data
            .split(/\r?\n{/g)
            .map((t, i) => i === 0 ? t : `{${t}`)  // Turn the response text into nice JS objects
            .map(s => JSON.parse(s))
            .filter(chunk => chunk.is_final)       // Only keep the final transcriptions
            .map(chunk => chunk.text)
            .join(" ");                            // And conjoin them!
        return transcription;
    }

    const handleSynthesis = async (txt) => {
        if (txt.length > 280) {
            return undefined;
        } else {
            const resp = await fetch(`https://api.wit.ai/synthesize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "audio/wav",
                    "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    q: txt,
                    voice: "Rebecca",
                    style: "soft"
                })
            })
            const audioBlob = await resp.blob()
            return URL.createObjectURL(audioBlob);
        }
    }

    const handleGetHelp = async () => {
        return ofRandom([
            "Try asking 'give me a list of chatrooms', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!"
        ])
    }

    const handleGetChatrooms = async () => {
        let chatroomString = `Of course, there are ${chatrooms.length} chatrooms: `;

        for(let chatroom of chatrooms) {
            if(chatroom === chatrooms[chatrooms.length - 1]) {
                chatroomString += `${chatroom}`;
            } else {
                chatroomString += `${chatroom}, `
            }
        }

        return chatroomString;
    }

    const handleGetMessages = async (data) => {
        const hasSpecifiedChatroom = data.entities["chatrooms:chatrooms"] ? true : false;
        const hasSpecifiedNumber = data.entities["wit$number:number"] ? true : false;
        const numPosts = hasSpecifiedNumber ? data.entities["wit$number:number"][0].value : 1;

        if(hasSpecifiedChatroom) {
            const chatroom = data.entities["chatrooms:chatrooms"][0].value;
            const resp = await fetch(`https://cs571.org/api/s24/hw11/messages?chatroom=${chatroom}&num=${numPosts}`, {
                headers: {
                    "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
                }
            });

            const posts = await resp.json();
            return posts.messages.map(p => `In ${p.chatroom}, ${p.poster} created a post titled '${p.title}' saying '${p.content}'`);
        } else {
            const resp = await fetch(`https://cs571.org/api/s24/hw11/messages?num=${numPosts}`, {
                headers: {
                    "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
                }
            });

            const posts = await resp.json();
            return posts.messages.map(p => `In ${p.chatroom}, ${p.poster} created a post titled '${p.title}' saying '${p.content}'`);
        }
    }

    const handleLogin = async () => {
        return await delegator.beginDelegation("LOGIN");
    }

    const handleRegister = async () => {
        return await delegator.beginDelegation("REGISTER");
    }

    const handleCreateMessage = async (data) => {
        console.log(data);
        return await delegator.beginDelegation("CREATE", data);
    }

    const handleLogout = async () => {
        if (await isLoggedIn()) {
            await logout();
            return ofRandom([
                "You have been signed out, goodbye!",
                "You have been logged out."
            ])
        } else {
            return ofRandom([
                "You are not currently logged in!",
                "You aren't logged in."
            ])
        }
    }

    const handleWhoAmI = async () => {
        if(await isLoggedIn()) {
            const username = await getLoggedInUsername();
            return `You are currently logged in as '${username}'`
        } else {
            return "You are not logged in"
        }
    }

    return {
        handleInitialize,
        handleReceive,
        handleTranscription,
        handleSynthesis
    }
}

export default createChatAgent;