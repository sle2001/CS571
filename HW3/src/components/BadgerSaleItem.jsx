import React, {useState} from 'react';

export default function BadgerSaleItem(props) {
    const [quantity, setQuantity] = useState(0); // Set state to 0 (0 items)

    //const handleDecrement = () => {setQuantity(quantity-1);}; // Handles when pressing '-' and decrease number by 1
    //const handleIncrement = () => {setQuantity(quantity+1);}; // Handles when pressing '+' and increase number by 1

    // Function versions
    function handleDecrement() {
        setQuantity(quantity-1);
    }

    function handleIncrement() {
        setQuantity(quantity+1);
    }

    return <div style={{backgroundColor: props.featured ? 'aquamarine' : 'transparent'}}>
        <h2>{props.name}</h2>
        <p>{props.description}</p>
        <p>${props.price}</p>
        <div>
            <button className="inline" onClick={handleDecrement} disabled={quantity <= 0}>-</button>
            <p className="inline">{quantity}</p>
            <button className="inline" onClick={handleIncrement}>+</button>
        </div>
    </div>
}