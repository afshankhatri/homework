function login() {
    // Get the value of the phone number input field
    const user_id = document.getElementById('user_id').value;
    console.log("Phone number entered:", user_id);


    const password = document.getElementById('password').value;
    console.log("Phone number entered:", password);


    // Create a payload with the phone number
    const payload = { user_id: user_id, password: password };
    
    console.log("Payload being sent to backend:", payload);

    // Send the phone number to the Flask backend via a POST request
    fetch('/phone_no_validation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            console.log("Received response:", response);
            return response.json();
        })
        .then(data => {
            console.log("Response data from server:", data);

            // Check if the backend returned an error
            if (data.error) {
                console.error("Error from backend:", data.message);
                alert(data.message); // Display the error message
                return;
            }

            // If validation succeeds, redirect based on role
            console.log("User role received:", data.role);
            if (data.role === 0) {
                console.log("Redirecting to survey_user page");
                window.location.href = "/survey_user"; // Redirect to user page
            } else if (data.role === 1) {
                console.log("Redirecting to qc_user page");
                window.location.href = "/qc_user"; // Redirect to manager page
            } else if (data.role === 2) {
                console.log("Redirecting to validator_user page");
                window.location.href = "/validator_user"; // Redirect to validator page
            } else if (data.role === 3) {
                console.log("Redirecting to admin_user page");
                window.location.href = "/admin_user"; // Redirect to admin page
            } else {
                console.error("Invalid role received:", data.role);
                alert("Invalid role assigned to the user.");
            }
        })
        .catch(error => {
            console.error("Error occurred during fetch:", error);
            alert("An error occurred. Please try again later.");
        });
}
