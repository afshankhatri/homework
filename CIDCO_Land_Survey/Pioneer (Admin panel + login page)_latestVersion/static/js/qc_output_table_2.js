
// Function to generate table rows dynamically with fetched data
function generateTableRows(data) {
    const tableBody = document.querySelector("#dataTable tbody");

    // Clear any existing table rows before inserting new ones
    tableBody.innerHTML = "";
    console.log("yes we are getting no data")

    if (data.length === 0) {
        console.log("yes we are getting no data")
        // Handle empty data by adding a "NO DATA" row
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="10" style="text-align: center;">NO DATA</td>
        `;
        tableBody.appendChild(row);
        return; // Exit the function early since there's no data to process
    }
    console.log("yes we are getting no data")

    data.forEach((item, index) => {
        const row = document.createElement("tr");
        const serialNumber = index + 1;

       // Conditionally display the validator_remarks column
       const validatorRemarksCell = 
       filter_list.selected_button === 'reject' 
       ? `<td>${item.validator_remarks || ''}</td>` 
       : `<td style="display: none;"></td>`;

   row.innerHTML = `
       <td><button onclick="viewDetails(${item.surveyformdata_uid})">View</button></td>
       <td>${serialNumber}</td>
       <td>${item.surveyformdata_uid}</td>
       <td>${item.user_name}</td>
       <td>${item.month_date}</td>
       <td>${item.node_name}</td>
       <td>${item.sector_no}</td>
       <td>${item.block_name}</td>
       <td>${item.plot_name}</td>
       ${validatorRemarksCell}
   `;

   tableBody.appendChild(row);
});
}

// Function to handle the view details button click
function viewDetails(item) {
    // Create query parameters from the selected row data
    // const query = new URLSearchParams(item).toString();

    console.log("this is the id we are sending")
    console.log(item)

    sendFormID(item)
    console.log("yeh dekho ye role hai", role)
    route = '/qc_user'
   
     if (role ==0)
        route = '/surveyor_output_form'
    else if (role ==1)
        route = '/qc_form_verify'
    
    else if (role ==2)
        route = '/validator_verify'
    else  if (role ==3)
        route = '/qc_form_verify'

    // Redirect to survey_output_form.html with the query parameters
    window.location.href = route;
}


// Function to send form ID to Flask route
function sendFormID(formID) {
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "/send_formid?form_id=" + formID, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Form ID sent to Flask: " + formID);
        }
    };
    xhr.send();
}



// Function to filter the table based on the search and date filter
function filterTable() {
    const searchValue = document.getElementById('searchBar').value.toLowerCase();
    const dateValue = document.getElementById('dateFilter').value; // Value in YYYY-MM
    const table = document.getElementById('dataTable'); // Correct table ID
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        const cells = rows[i].getElementsByTagName('td');
        const name = cells[3].innerText.toLowerCase(); // Assuming Surveyor Name is in the 4th column (index 3)
        const tableDate = cells[4].innerText; // Assuming Date Uploaded is in the 5th column (index 4)

        // Extract YYYY-MM from the stored YYYY-MM-DD format
        const formattedTableDate = tableDate.split(" ")[0]; // Get only the date part

        // Match search and filter
        const nameMatch = name.includes(searchValue);
        const dateMatch = !dateValue || formattedTableDate.startsWith(dateValue); // Compare against YYYY-MM

        if (nameMatch && dateMatch) {
            rows[i].style.display = ''; // Show matching rows
        } else {
            rows[i].style.display = 'none'; // Hide non-matching rows
        }
    }
}




// Add event listeners for filtering
document.getElementById('searchBar').addEventListener('input', filterTable);
document.getElementById('dateFilter').addEventListener('change', filterTable);

let selectedButton = 'default'; // Tracks the selected button

// Function to handle button selection
function selectButton(buttonId) {
    // Deselect all buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mark the clicked button as active
    document.getElementById(`${buttonId}Button`).classList.add('active');

    // Update the selected button value
    selectedButton = buttonId;

}

// Function to apply the filter
function applyFilter() {
    const dateFilter = document.getElementById('dateFilter')?.value || '';

    if (!selectedButton) {
        alert('Please select a filter button.');
        return;
    }

    // Prepare payload
    const payload = {
        selectedButton,
        dateFilter,
    };
    if (selectedButton === null) {
        // If no button is selected, use GET method to fetch unfiltered data
        fetch('/query_plot_details?role=qc&sector=your_sector', { // Use query parameters for GET request
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Unfiltered Data:', data);
            alert('Unfiltered data loaded successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching data.');
        });
    } else {
        // Use POST method to apply the filter
        fetch('/query_plot_details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Filtered Data:', data);
            alert('Filter applied successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while applying the filter.');
        });
    }
}


// Add event listeners for filtering
document.getElementById('searchBar').addEventListener('input', filterTable);


// Add event listeners for filtering
document.getElementById('searchBar').addEventListener('input', filterTable);
