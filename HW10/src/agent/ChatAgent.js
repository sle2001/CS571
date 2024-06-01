const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = "VD5WOYYDNG54FC5WAXNF24QPRFDS66AJ"; // Put your CLIENT access token here.

    let availableItems = [];
    let cart = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571.org/api/s24/hw10/items", {
            method: "GET",
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
            }
        })

        const data = await resp.json();
        
        console.log(data);
        if(data.length > 0) {
            availableItems = data;
            console.log(availableItems);
            cart = availableItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: 0
            }))
        }
        return "Welcome to Badger Mart! Type your question or ask for help if you need help."
    }

    const handleReceive = async (prompt) => {
        const resp = await fetch("https://api.wit.ai/message?q=" + encodeURIComponent(prompt), {
            headers: {
                "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN
            }
        })

        const data = await resp.json();

        console.log(data);
        if(data.intents.length > 0) {
            switch(data.intents[0].name) {
                case "get_help": return getHelp();
                case "get_items": return getItems();
                case "get_price": return getPrice(data);
                case "add_item": return addItem(data);
                case "remove_item": return removeItem(data);
                case "view_cart": return viewCart();
                case "checkout": return checkout();
            }
        }

        return "Sorry I didn't understand. Type 'help' to see what you can do!"
    }

    const getHelp = async() => {
        return "In Badger Mart, you can get the list of items, the price of an item, add or remove an item from your cart, and checkout!"
    }

    const getItems = async() => {
        const itemNames = availableItems.map(item => item.name.toLowerCase());
        const itemNameString = itemNames.join(", ");

        return `We have ${itemNameString} for sale!`
    }

    const getPrice = async(data) => {
        const isItemAvailable = data.entities["food_type:food_type"] ? true : false;

        if(isItemAvailable) {
            const itemName = data.entities["food_type:food_type"][0].value;
            const item = availableItems.find(item => itemName === item.name);
            const price = item.price.toFixed(2);

            return `${itemName}s cost $${price} each.`
        } else {
            return "The item is not in stock."
        }
    }

    const addItem = async(data) => {
        const isItemAvailable = data.entities["food_type:food_type"] ? true : false;
        const hasSpecifiedNumber = data.entities["wit$number:number"] ? true : false;

        if(isItemAvailable) {
            const itemName = data.entities["food_type:food_type"][0].value;
            const item = cart.find(item => itemName === item.name);
            const quantity = hasSpecifiedNumber ? data.entities["wit$number:number"][0].value : 1;

            if(quantity <= 0) {
                return "The quantity is invalid."
            } else {
                item.quantity += Math.floor(quantity);
    
                return `I'm adding ${quantity} ${itemName.toLowerCase()}(s) to your cart.`
            }
            
        } else {
            return "The item is not in stock."
        }
    }

    const removeItem = async(data) => {
        const isItemAvailable = data.entities["food_type:food_type"] ? true : false;
        const hasSpecifiedNumber = data.entities["wit$number:number"] ? true : false;

        if(isItemAvailable) {
            const itemName = data.entities["food_type:food_type"][0].value;
            const item = cart.find(item => itemName === item.name);
            const quantity = hasSpecifiedNumber ? data.entities["wit$number:number"][0].value : 1;

            if(quantity <= 0) {
                return "The quantity is invalid."
            } else {
                if(quantity > item.quantity) {
                    item.quantity = 0;
                    return `I'm removing all ${itemName.toLowerCase()}(s) from your cart.`
                } else {
                    item.quantity -= Math.floor(quantity);
                    return `I'm removing ${Math.floor(quantity)} ${itemName.toLowerCase()}(s) from your cart.`
                }
            }
            
        } else {
            return "The item is not in stock."
        }
    }

    const viewCart = async() => {
        let itemsInCart = []
        let totalPrice = 0;
        for(let item of cart) {
            if(item.quantity > 0) {
                itemsInCart.push(item);
                totalPrice += item.quantity * item.price;
            }
        }

        if(itemsInCart.length == 0) {
            return "There is nothing in the cart."
        } else if(itemsInCart.length == 1) {
            return `You have ${itemsInCart[0].quantity} ${itemsInCart[0].name.toLowerCase()}(s) in your cart with the total of
            $${totalPrice.toFixed(2)}`
        } else if(itemsInCart.length == 2) {
            return `You have ${itemsInCart[0].quantity} ${itemsInCart[0].name.toLowerCase()}(s) and ${itemsInCart[1].quantity} 
            ${itemsInCart[1].name.toLowerCase()}(s) in your cart with the total of $${totalPrice.toFixed(2)}`;
        } else {
            let response = "You have ";
            for(let item of itemsInCart) {
                if(item !== itemsInCart[itemsInCart.length - 1]) {
                    response += `${item.quantity} ${item.name.toLowerCase()}(s), `;
                } else {
                    response += `and ${item.quantity} ${item.name.toLowerCase()}(s) in your cart with the total of $${totalPrice.toFixed(2)}`;
                }
            }
            return response;
        }
    }

    const checkout = async() => {
        if(cart.every(item => item.quantity === 0)) {
            return "There is nothing in the cart.";
        }

        const bodyData = {};
        cart.forEach(item => {
            bodyData[item.name] = item.quantity;
        })

        const resp = await fetch("https://cs571.org/api/s24/hw10/checkout", {
            method: "POST",
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        })

        const data = await resp.json();
        console.log(bodyData);
        if(resp.status == 200) {
            cart.forEach(item => { item.quantity = 0 });
            return `Success! Your confirmation ID is ${data.confirmationId}. Come back soon!`;
        } else {
            return `Error has occured when checking out (${resp.status})`;
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;