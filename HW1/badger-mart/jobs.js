function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!

    const listOfJobs = document.getElementsByName('job');
    for(let i = 0; i < listOfJobs.length; ++i) {
        if(listOfJobs[i].checked) {
            alert("Thank you for applying to be a " + listOfJobs[i].value + "!");
            break;
        }

        if(i == listOfJobs.length - 1) {
            alert("Please select a job!");
        }
    }

    window.location.reload();
}