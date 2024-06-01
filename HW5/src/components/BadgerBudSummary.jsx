import { useState } from 'react';
import { Button, Carousel } from 'react-bootstrap';

function BadgerBudSummary({ bud, saveCat }) {
    const [showMore, setShowMore] = useState(false);

    const getImages = () => {
        if (showMore) {
            return (
                <Carousel>
                    {bud.imgIds.map((imgId, index) => (
                        <Carousel.Item key={index}>
                            <img src={`https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${imgId}`} alt={`Image of ${bud.name} ${index + 1}`} />
                        </Carousel.Item>))}
                </Carousel>);
        } else {
            return <img src={`https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${bud.imgIds[0]}`} alt={`Picture of ${bud.name}`} />;
        }
    };

    return (
        <div className={`display-box ${showMore ? 'expanded' : ''}`}> {getImages()}
            <div className="text-container"></div>
                <h2>{bud.name}</h2>
                {showMore ? (
                    <div>
                        <p><strong>Gender: </strong>{bud.gender}</p>
                        <p><strong>Breed: </strong>{bud.breed}</p>
                        <p><strong>Age: </strong>{bud.age}</p>
                        {bud.description && <p><strong>Description:</strong> {bud.description}</p>}
                    </div>) 
                : null}
            <div className="button-container">
                <div className="bud-actions">
                    <Button onClick={() => setShowMore(!showMore)}>{showMore ? "Show Less" : "Show More"}</Button>
                    <Button className="save-button" onClick={() => saveCat(bud.id, bud.name)}>Save</Button>
                </div>
            </div>
        </div>
    );
}

export default BadgerBudSummary;