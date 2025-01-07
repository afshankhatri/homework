window.onload = async function () {
    try {
        const response = await fetch('/onload_manage_sector');
        const data = await response.json();
        console.log("this is the data", data)
            //  // Filter the data to only include rows where sectortable_isactive is 1
            //  const filteredData = data.filter(row => row.sectortable_isactive === 0);

        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows

// Create a Set to hold unique user_name and user_id combinations
const uniqueUsers = new Set();
data.forEach(row => {
    uniqueUsers.add(`${row.user_name} (${row.user_id})`);
});

data.forEach((row, index) => {
    const tr = document.createElement('tr');
    
    // Determine the role text based on the role value
    let roleText = '';
    if (row.role === 1) {
        roleText = 'QC';
    } else if (row.role === 2) {
        roleText = 'Validator';
    } else {
        roleText = 'Unknown'; // Default text for other role values
    }

    // Create the options for the dropdown from unique users
    let userOptions = '';
    uniqueUsers.forEach(user => {
        userOptions += `<option value="${user}">${user}</option>`;
    });

    tr.innerHTML = `
    <td id="sector_${index}" class="editable" data-original="${row.sector_name}" data-uid="${row.sectortable_uid}">${row.sector_name}</td>
    
    <td id="user_${index}" class="editable" data-original="${row.user_name} ${row.user_id}">
        <select disabled>
            ${userOptions}
        </select>
    </td>
    
    <td id="role_${index}" class="editable" data-original="${row.role}">${roleText}</td>
    
    <td>
        <button onclick="editRow(this)">Edit</button>
        <button onclick="deleteRow(this)" class="hidden">Delete</button>
        <button onclick="saveRow(this)" class="hidden">Save</button>
        <button onclick="cancelEdit(this)" class="hidden">Cancel</button>
    </td>
`;


    tableBody.appendChild(tr);
});

        
        

        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Filter function for the table
// function filterTable() {
//     var filter = document.getElementById("usernameFilter").value.toLowerCase();
//     var rows = document.getElementById("dataTable").getElementsByTagName("tr");

//     for (var i = 1; i < rows.length; i++) {
//         var cell = rows[i].getElementsByTagName("td")[0]; // Username column
//         if (cell) {
//             var textValue = cell.textContent || cell.innerText;
//             rows[i].style.display = textValue.toLowerCase().indexOf(filter) > -1 ? "" : "none";
//         }
//     }
// }



// Edit row function
function editRow(btn) {
    const row = btn.closest("tr");

    // Make cells editable
    row.querySelectorAll(".editable").forEach(cell => {
        cell.contentEditable = "true";
    });

    // Enable the dropdown when editing
    const dropdown = row.querySelector('td[id^="user_"] select');
    if (dropdown) {
        dropdown.disabled = false;
    }

    // Show save, delete, cancel buttons and hide edit button
    toggleButtons(btn, ["inline", "inline", "inline", "none"]);
}

// Save the row (update the data in the database)
async function saveRow(btn) {
    const row = btn.closest("tr");

    // Access the username, sector name, and phone number
    const username = row.querySelector('td[id^="user_"] select').value; // Get the selected dropdown value

    // Access the UID from the sector column (the column with the sector name)
    const sectortableUid = row.querySelector('td[id^="sector_"]').getAttribute('data-uid');

    // Log the accessed values
    console.log("Username:", username);
    console.log("sectortableUid", sectortableUid);

    

    // Send a POST request to update the data
    try {
        const response = await fetch('/update_values', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sectortableUid: sectortableUid,
                username: username,
            })
        });

        const data = await response.json();

        // Handle the response from the server
        if (data.message === 'Record updated successfully') {

            alert("Record updated successfully")
            window.location.reload(true)

        } else {
            alert('Error updating row');
        }
    } catch (error) {
        console.error('Error:', error);
    }
      // Restore the default view
      toggleButtons(btn, ["none", "none", "none", "inline"]);
    
}




// Cancel edit and revert changes
function cancelEdit(btn) {
    const row = btn.closest("tr");

    // Revert content to original values
    row.querySelectorAll(".editable").forEach(cell => {
        // const originalValue = cell.getAttribute("data-original"); // Get the original value
        // cell.textContent = originalValue; // Revert to original value
        cell.contentEditable = "false"; // Make cell non-editable
    });

    // Disable the dropdown when canceling
    const dropdown = row.querySelector('td[id^="user_"] select');
    if (dropdown) {
        dropdown.disabled = true;
    }

    // Restore the default view
    toggleButtons(btn, ["none", "none", "none", "inline"]);
}


// Delete row function

// Function to delete a row
async function deleteRow(button) {

    const isConfirmed = confirm("Are you sure you want to delete this row?");
    if (!isConfirmed) {
            // Restore the default view
    toggleButtons(button, ["none", "none", "none", "inline"]);
        return; // If the user cancels, exit the function
    }
    
    // Get the row that contains the button
    var row = button.closest('tr');
    
    // Get the sectortable_uid from the hidden column (the fourth <td> with the 'hidden' class)
    const sectortable_uid_to_delete = row.querySelector('td[id^="sector_"]').getAttribute('data-uid');  // Accessing data-uid
  
    // Log the UID to verify it's being correctly retrieved
    console.log("sectortable_uid_to_delete: ", sectortable_uid_to_delete);
    
    if (!sectortable_uid_to_delete) {
      console.error("Error: sectortable_uid is not found.");
      return;
    }
  
    // Send a POST request with the sectortable_uid to the backend
    try {
      const response = await fetch('/del_values', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'sectortable_uid': sectortable_uid_to_delete })
      });
      
      const data = await response.json();
      
      console.log("Response from server:", data);  // Log server response
      
      if (data.message === 'Record updated successfully') {
        // Remove the row from the table after successful deletion
        row.parentNode.removeChild(row);
      } else {
        alert('Error deleting row');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  


// Utility function to toggle button visibility
function toggleButtons(button, states) {
    const buttons = button.parentElement.querySelectorAll("button");
    buttons[0].style.display = states[3]; // Edit button
    buttons[1].style.display = states[0]; // Delete button
    buttons[2].style.display = states[1]; // Save button
    buttons[3].style.display = states[2]; // Cancel button
}
