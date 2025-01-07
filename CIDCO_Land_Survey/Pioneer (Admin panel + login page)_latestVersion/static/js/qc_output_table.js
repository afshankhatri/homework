var filter_list = {selected_button:"default", month_date:"default"}
var role = ""

window.onload = getdata(filter_list)


function getdata(filter_list) {

    // console.log("window on load function");

    // Send an initial "default" message and fetch data from the backend
    fetch('/output_table', {

        method: 'POST', // Use POST to send the initial message
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        
        body: JSON.stringify(filter_list) // Send the "default" message

    })

    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        console.log(data); // Log the data to the console
        role = data['role']
        
        console.log(role)
        generateTableRows(data['results_data']); // Pass the fetched data to generateTableRows
    })
    .catch(error => {
        console.error('Error fetching data:', error); // Handle any errors
    });
    
}


document.getElementById('validatorRemarksHeader').style.display = 
    filter_list.selected_button === 'reject' ? 'table-cell' : 'none';





// Event listener for "Default" button
document.getElementById('default_button').addEventListener('click', function (event) {
    console.log("default is clicked");
    filter_list.selected_button = "default";
    console.log(filter_list);
    // set this as active and clear active from the rest
    setActiveButton('default_button');
    getdata(filter_list); // Assuming you want to pass this updated filter_list to the function
});


// Event listener for "Accept" button
document.getElementById('accept_button').addEventListener('click', function (event) {
    console.log("accept is clicked");
    filter_list.selected_button = "accept";
    console.log(filter_list);
 // set this as active and clear active from the rest
 setActiveButton('accept_button');
    getdata(filter_list); // Assuming you want to pass this updated filter_list to the function
});



// Event listener for "Reject" button
document.getElementById('reject_button').addEventListener('click', function (event) {
    console.log("reject is clicked");
    filter_list.selected_button = "reject";
    console.log(filter_list);
 // set this as active and clear active from the rest
    setActiveButton('reject_button');
    getdata(filter_list); // Assuming you want to pass this updated filter_list to the function
});

function toggleColumn(view) {
    const validatorColumn = document.getElementById("validatorRemarksHeader");
    const tableRows = document.querySelectorAll("#dataTable tbody tr");

    if (view === 'rejected') {
        // Show the Validator Remarks column
        validatorColumn.style.display = "table-cell";
        tableRows.forEach(row => {
            row.cells[9].style.display = "table-cell"; // Display the 10th column (Validator Remarks)
        });
    } else {
        // Hide the Validator Remarks column
        validatorColumn.style.display = "none";
        tableRows.forEach(row => {
            row.cells[9].style.display = "none"; // Hide the 10th column (Validator Remarks)
        });
    }
    
}

// Function to handle active button state
function setActiveButton(activeButtonId) {
    // Select all buttons
    const buttons = document.querySelectorAll('.filter-button');

    // Remove 'active' class from all buttons
    buttons.forEach(button => button.classList.remove('active'));

    // Add 'active' class to the clicked button
    document.getElementById(activeButtonId).classList.add('active');
}