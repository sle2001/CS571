const Student = (props) => {
    const interests = []; // Hold an array of interests for each student
    // Loop through each interest and push it into array, with i as key
    for(let i = 0; i < props.interests.length; ++i) {
        interests.push(<li key={i}> {props.interests[i]}</li>)
    }

    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        <h4>{props.major}</h4>
        <p>Taking {props.numCredits} credits</p>
        {props.fromWisconsin ? <p>From Wisconsin</p> : <p>Not from Wisconsin</p>}
        <ul>{interests}</ul>
    </div>
}

export default Student;