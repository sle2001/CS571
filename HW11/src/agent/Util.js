const ofRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const isLoggedIn = async () => {
    const resp = await fetch("https://cs571.org/api/s24/hw11/whoami", {
        credentials: "include",
        headers: {
            "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
        }
    })
    const body = await resp.json();
    return body.isLoggedIn;
}

const getLoggedInUsername = async () => {
    const resp = await fetch("https://cs571.org/api/s24/hw11/whoami", {
        credentials: "include",
        headers: {
            "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
        }
    })
    const body = await resp.json();
    if (body.isLoggedIn) {
        return body.user.username;
    } else {
        return undefined;
    }
}

const logout = async () => {
    await fetch("https://cs571.org/api/s24/hw11/logout", {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
        }
    })
}

export {
    ofRandom,
    isLoggedIn,
    getLoggedInUsername,
    logout
}