window.onload = function () {
  fetch('/userEdit_values_admin_panel')
    .then((response) => response.json())
    .then((data) => {
      console.log('Data fetched successfully.');
      console.log(data);

      // Populate the table with dynamic data
      const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];
      const names = data.name;
      const user_id = data.user_id;
      const role = data.role;
      const uids = data.userinfo_uid;
      // const sector = data.user_sector_uids;
      // console.log(sector)

      // Role mapping
      const roleMapping = {
        0: 'Surveyor',
        1: 'QC',
        2: 'Validator',
        4: 'Client',
      };

      names.forEach((namee, index) => {
        const row = userTable.insertRow();

        // Insert the serial number
        const srNoCell = row.insertCell(0);
        srNoCell.textContent = index + 1;


        const phone_noCell = row.insertCell(1);
        phone_noCell.innerHTML = `
          <span class="data">${user_id[index]}</span>
          <input type="text" class="edit-input" value="${user_id[index]}" style="display:none;">
        `;


        // Insert the node name with the uid as a data attribute
        const nodeCell = row.insertCell(2);
        nodeCell.innerHTML = `
          <span class="data" data-uid="${uids[index]}">${namee}</span>
          <input type="text" class="edit-input" value="${namee}" style="display:none;">
        `;

        // Insert the phone_no


        // Insert the role
        const roleCell = row.insertCell(3);
        // const currentRole = roleMapping[role[index]] || 'Unknown';
        roleCell.innerHTML = `
        <select class="role-dropdown" disabled data-original-value="${role[index]}">
          <option value="0" ${role[index] == 0 ? 'selected' : ''}>Surveyor</option>
          <option value="1" ${role[index] == 1 ? 'selected' : ''}>QC</option>
          <option value="2" ${role[index] == 2 ? 'selected' : ''}>Validator</option>
          <option value="4" ${role[index] == 4 ? 'selected' : ''}>Client</option>
        </select>
      `;


      // const sectorCell = row.insertCell(4); // Adjust index based on table structure

      // // Create the sector dropdown dynamically
      // let sectorDropdownHTML = `<select class="sector-dropdown" disabled data-original-value="${sector[index]}">`;
      
      // // Populate the dropdown with dynamic values from the `sector` array
      // sector.forEach((sectorValue) => {
      //   const isSelected = sector[index] == sectorValue ? 'selected' : '';
      //   sectorDropdownHTML += `<option value="${sectorValue}" ${isSelected}>${sectorValue}</option>`;
      // });
      
      // sectorDropdownHTML += `</select>`;
      
      // // Insert the dropdown into the cell
      // sectorCell.innerHTML = sectorDropdownHTML;



        // Insert the actions cell (Edit/Delete/Update/Cancel)
        const actionsCell = row.insertCell(4);
        actionsCell.innerHTML = `
          <button class="editBtn" onclick="editRow(this)">Edit</button>
          <button class="updateBtn" onclick="updateRow(this)" style="display:none;">Update</button>
          <button class="cancelBtn" onclick="cancelRow(this)" style="display:none;">Cancel</button>
          <button class="deleteBtn" onclick="deleteRow(this)" style="display:none;>Delete</button>
        `;
      });
    })


    .catch((error) => {
      console.error('Error fetching data:', error);
    });
};

// Function to enable editing of the row
function editRow(button) {
  var row = button.parentNode.parentNode;
  var inputs = row.querySelectorAll('input');
  var dataSpans = row.querySelectorAll('.data');
  var dropdown = row.querySelector('.role-dropdown'); // Select the dropdown element

  // Show the inputs and hide the text (span) elements
  inputs.forEach(input => input.style.display = 'inline-block');
  dataSpans.forEach(span => span.style.display = 'none');

  // Enable the dropdown for editing
  if (dropdown) {
      dropdown.disabled = false; // Enable the dropdown
      dropdown.style.display = 'inline-block'; // Ensure it is visible
  }

  // Hide Edit button, show Update and Cancel buttons
  row.querySelector('.editBtn').style.display = 'none';
  row.querySelector('.updateBtn').style.display = 'inline-block';
  row.querySelector('.cancelBtn').style.display = 'inline-block';
}



function updateRow(button) {
  var row = button.parentNode.parentNode;
  var inputs = row.querySelectorAll('input');
  var dataSpans = row.querySelectorAll('.data');
  var dropdown = row.querySelector('.role-dropdown'); // Select the dropdown element

  // Collect the updated values from the inputs
  var updatedData = {};

  // Retrieve the UID from the data attribute in the first span element
  const uid = dataSpans[1].getAttribute('data-uid');
  updatedData['uid'] = uid; // Add UID to the updated data object

  console.log(updatedData.uid)
  // Collect the input field values
  inputs.forEach((input, index) => {
    updatedData[`column${index + 1}`] = input.value.trim();
  });



  const selectedText = dropdown.options[dropdown.selectedIndex].text;
  console.log("selectedText value is this",selectedText)
  // updatedData['roleValue'] = selectedValue; // Add dropdown value (e.g., 4)
  updatedData['roleText'] = selectedText; // Add dropdown text (e.g., Client)

    

  console.log("Updated Data:", updatedData);

  // Send the updated data to the Flask route using fetch
  fetch('/update_userEdit_values', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData), // Send the data as JSON
  })

    .then(response => response.json())
    .then(data => {
      if (data.success) {
        
        alert("Values updated successfully")
        window.location.reload(true);
      } else {
        alert('Failed to update data');
      }
    })

    .catch(error => {
      console.error('Error updating data:', error);
      alert('An error occurred while updating the data.');
    });
}




function cancelRow(button) {
  var row = button.parentNode.parentNode;
  var inputs = row.querySelectorAll('input');
  var dataSpans = row.querySelectorAll('.data');
  var dropdown = row.querySelector('.role-dropdown'); // Select the dropdown element

  // Hide the input fields and show the original text (span) elements
  inputs.forEach(input => input.style.display = 'none');
  dataSpans.forEach(span => span.style.display = 'inline-block');

  // Reset the dropdown to its original value and disable it
  if (dropdown) {
      var originalValue = dropdown.getAttribute('data-original-value'); // Get the original value from a custom attribute
      if (originalValue) {
          dropdown.value = originalValue; // Reset the dropdown to the original value
      }
      dropdown.disabled = true; // Disable the dropdown
  }

  // Hide Cancel and Update buttons, show Edit button
  row.querySelector('.cancelBtn').style.display = 'none';
  row.querySelector('.updateBtn').style.display = 'none';
  row.querySelector('.editBtn').style.display = 'inline-block';
}



// Function to delete a row
function deleteRow(button) {
  confirm('are you sure you want to delete the node ?')


  // Get the row that contains the button
  var row = button.parentNode.parentNode;
  
  // Get the UID from the data attribute of the node name (assuming it's in a span with class 'data')
  var uid_to_delete = row.querySelector('.data').getAttribute('data-uid');
  
  // Send a POST request with the UID to the backend
  fetch('/delete_user_values', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'uid': uid_to_delete })
  })
  .then(response => response.json())
  .then(data => {
      console.log("i am here ",uid_to_delete);  // You can log or display the server's response
      
  })
  .catch(error => console.error('Error:', error));
}

