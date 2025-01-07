
// Function to enable or disable buttons based on checkbox validation
function toggleValidationButtons() {
    const sectionCheckboxes = document.querySelectorAll('.section-checkbox');
    const allChecked = Array.from(sectionCheckboxes).every(checkbox => checkbox.checked);
    const acceptButton = document.getElementById('acceptPushButton');

    acceptButton.disabled = !allChecked;
    // rejectButton.disabled = !allChecked;
}

// Add event listeners to section checkboxes to monitor changes
document.querySelectorAll('.section-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', toggleValidationButtons);
});




// Event listener for the "Accept and Push for Validation" button
document.getElementById("acceptPushButton").addEventListener("click", function () {
    // Fetch the value of the hidden input field (surveyformdata_uid)
    const surveyFormDataUid = document.getElementById("surveyformdata_uid").textContent;

    // Log the form ID to the console for debugging purposes
    console.log("Survey Form Data UID:", surveyFormDataUid);

    // Check if the form ID exists; if not, display an alert
    if (!surveyFormDataUid) {
        alert("Form ID is missing. Please check the form and try again.");
        return; // Exit if form ID is missing
    }

    // Function to handle the button click and send data to the backend
    acceptAndPushForValidation(surveyFormDataUid);
});

// Function to handle the backend update
function acceptAndPushForValidation(surveyFormDataUid) {
    // Display a confirmation dialog to the user
    const userConfirmed = confirm("Are you sure you want to accept and push this for validation?");
    
    // Exit if the user cancels the action
    if (!userConfirmed) return;

    // Create an XMLHttpRequest to send data to the backend
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_status", true); // Define the URL to send the request
    xhr.setRequestHeader("Content-Type", "application/json"); // Set the content type for JSON data

    // Handle the response from the backend
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Success: Display a success message
                alert("Data updated successfully!");
            } else {
                // Error: Parse the error message and display it
                const response = JSON.parse(xhr.responseText);
                alert(`Error updating data: ${response.error || "Unknown error. Please try again."}`);
            }
        }
    };

    // Prepare the JSON data, ensuring the key matches the backend expectation
    const data = JSON.stringify({
    surveyFormDataUid: surveyFormDataUid,  // Pass the form ID
    is_qc_done: 1,  // Mark the QC status as 1 (accepted)
    });

    // Print the data before sending it to the backend
    console.log("Data being sent:", data);

    // Send the request to the backend
    xhr.send(data);
}



// Open modal for image
function openModal(image) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = 'flex';
    modalImg.src = image.src;
}

// Close image modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}


// copy the  main prt from editByQC.js file 


function fetchPlotDetails() {
    fetch('/get_outputform_data')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log("This is the data");
                console.log(data);

                // Populate the fields with fetched data
                document.getElementById("surveyformdata_uid").textContent = data.surveyformdata_uid || "No data";
                document.getElementById("entry_date_created").textContent = data.entry_date_created || "No data";
                document.getElementById("user_name").textContent = data.user_name || "No data";
            
                document.getElementById("node_name").textContent = data.node_name || "No data";
                document.getElementById("sector_no").textContent = data.sector_no || "No data";
                console.log("this is hte blcok name", data.block_name)
                document.getElementById("block_name").textContent = data.block_name || "No data";
                document.getElementById("plot_name").textContent = data.plot_name || "No data";
                document.getElementById("plot_status").textContent = data.plot_status || "No data";
                document.getElementById("surveyor_remarks").textContent = data.surveyor_remarks || "No data";
                document.getElementById("allotment_date").textContent = data.allotment_date || "No data";
                document.getElementById("original_allottee").textContent = data.original_allottee || "No data";
              
                // document.getElementById("area").textContent = data.area || "No data";
                document.getElementById("use_of_plot").textContent = data.use_of_plot || "No data";
                document.getElementById("rate").textContent = data.rate || "No data";
                console.log("owner tra Details: ye haaaaaaaiiiiiiiiiiii", data.ownerNtransferDate);
                // document.getElementById("ownerNtransferDate").textContent = data.ownerNtransferDate || "No data";
                console.log("Owner and Transfer Details: ye haaaaaaaiiiiiiiiiiii", data.ownerNtransferDate);
             
                // Handle photos
                document.getElementById("front_photo").src = data.front_photo ?
                    `static/uploads/${data.front_photo}` : "static/uploads/default.png";
                document.getElementById("left_photo").src = data.left_photo ?
                    `static/uploads/${data.left_photo}` : "static/uploads/default.png";
                document.getElementById("back_photo").src = data.back_photo ?
                    `static/uploads/${data.back_photo}` : "static/uploads/default.png";
                document.getElementById("right_photo").src = data.right_photo ?
                    `static/uploads/${data.right_photo}` : "static/uploads/default.png";
                document.getElementById("plot_sketch").src = data.plot_sketch ?
                    `static/uploads/${data.plot_sketch}` : "static/uploads/default.png";
                
                // Optionally update alt text to handle missing photos
                document.getElementById("front_photo").alt = data.front_photo ? data.front_photo : "No Photo for front";
                document.getElementById("left_photo").alt = data.left_photo ? data.left_photo : "No Photo for left";
                document.getElementById("back_photo").alt = data.back_photo ? data.back_photo : "No Photo for back";
                document.getElementById("right_photo").alt = data.right_photo ? data.right_photo : "No Photo for right";
                document.getElementById("plot_sketch").alt = data.plot_sketch ? data.plot_sketch : "No Photo for sketch";

                // Get the transfer details
                const transferDetails = data.ownerNtransferDate;


            // Check if ownerNtransferDate is null or empty
if (!transferDetails) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td colspan="3" style="text-align: center;">No Data</td>
    `;
    tableBody.appendChild(row);
} else {
    // // Add table headers
    transferTable.innerHTML = `
        <thead>
            <tr>
                <th>Transfer Owner</th>
                <th>Owner Name</th>
                <th>Transfer Date</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

//    Parse the data into an array of objects
            const parsedData = transferDetails.split(', ').map((entry, index) => {
                const [ownerName, transferDate] = entry.split('|');
                return {
                    owner: `Transfer Owner Name ${index + 1}`,
                    ownerName,
                    transferDate
                };
            });

            // Get the table body element
            const tableBody = document.querySelector("#transferTable tbody");
            const table = document.querySelector("#transferTable");

            // Populate the table dynamically
            parsedData.forEach(({ owner, ownerName, transferDate }) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${owner}</td>
                    <td>${ownerName}</td>
                    <td>${transferDate}</td>
                `;

                tableBody.appendChild(row);
            });
}




            // area details of plot

            const area = data.area;
            console.log(area);

            const parsedAreaData = area.split(',').map((entry, index) => {
                const [dimensions, area] = entry.split('=');
                const[side1,side2] = dimensions.split('x')
                return {
                    row: `Area ${index + 1}`,
                    side1,side2,
                    area
                };
            });

            const AreatableBody = document.querySelector("#dimensionsTable tbody");

            parsedAreaData.forEach(({ row, side1, side2, area }) => {
                const rowElement = document.createElement("tr");
            
                rowElement.innerHTML = `
                    <td>${row}</td>
                    <td>${side1}</td>
                    <td>${side2}</td>
                    <td>${area}</td>
                `;
            
                AreatableBody.appendChild(rowElement);
            });
        }})}

// Call the function to populate data on page load
window.onload = function() {
    fetchPlotDetails();  // Fetch data as soon as the page loads
    
};

