// Add event listeners to select elements to check for default option
var selectElements = document.querySelectorAll('select[required]');
selectElements.forEach(function(selectElement) {
    selectElement.addEventListener('change', function() {
        if (selectElement.value !== "") {
            // Enable the submit button when all required fields are selected
            submitButton.disabled = false;
        } else {
            // Disable the submit button if any required field is not selected
            submitButton.disabled = true;
        }
    });
});


document.getElementById("submitButton").addEventListener("click", function(event) {
    // Prevent the default form submission
    event.preventDefault();

    var selectElements = document.querySelectorAll('select[required]');
    var errorMessage = "";

    // Check if any required select element is empty
    selectElements.forEach(function(selectElement) {
        if (selectElement.value === "") {
            errorMessage = "Please select a value for all required fields.";
        }
    });

    // Get sender and receiver details
    var fromPerson = document.getElementById("Sender").textContent.trim();
    var toPerson = document.getElementById("Receiver").value;
    var fromProject = document.getElementById("Source").textContent.trim();
    var toProject = document.getElementById("Destination").value;
    //console.log('fromperson toperson fromproject toproject', fromPerson, toPerson, fromProject, toProject);

    // Check if From Person and To Person, and From Project and To Project are the same
    if (fromPerson === toPerson && fromProject === toProject) {
        errorMessage = "Source, Destination, Sender and Receiver should not be the same";
    }

    // Check if there are no selected items in the first tab's table
    if (errorMessage === "" && selectedItems.length === 0) {
        errorMessage = "Please select at least 1 item before initiating the transaction.";
    }

    // Check if any condition dropdown in the maintable has the default option selected
    var conditionDropdowns = document.querySelectorAll('#maintable select');
    conditionDropdowns.forEach(function(dropdown) {
        if (dropdown.value === "") {
            errorMessage = "Please select a condition in the Selected Items tab for each product.";
        }
    });

    // If there is any error, show the floating message box with the error message
    if (errorMessage !== "") {
        floatingMessageBox(errorMessage);
    } else {
        document.getElementById("submitButton").disabled = true; // Disable the button
        logRowValues(); // Call the function to log row values
    }
});



function logRowValues() {
    var formObject = []; // Initialize formObject as an array
    var senderid = document.getElementById('Sender').textContent = session_data.Name;
    var sendername = document.getElementById('Sender').textContent = session_data.ID;
    //console.log("this is the sender id hurrrayyyy", senderid )
    // Object to store values from other form elements
    var selectedOption = document.getElementById('Receiver').selectedOptions[0];

    var employeeName = selectedOption.textContent;

    var otherFormValues = {

    Source: document.getElementById("Source").value.trim(),
    Destination: document.getElementById("Destination").value,
    Sendername: sendername,
    Senderid : senderid,
    Receiverid: document.getElementById("Receiver").value.trim(),
    Receivername: employeeName,

    };

formObject.push(otherFormValues); // Append otherFormValues to formObject array
console.log('formobject hahaha', formObject)
var selectedTab = document.getElementById('itemsSelected');
var selectedTable = document.getElementById('maintable'); // Accessing the table by id

//console.log("selectedTable: ", selectedTable); // Log the value of selectedTable

if (selectedTable) {
var tbody = selectedTable.querySelector('tbody');
var rows = tbody.querySelectorAll('tr');
//console.log("Number of rows: ", rows.length); // Log the number of rows found

rows.forEach(function(row, index) {
    var cells = row.querySelectorAll('td');
    //console.log("Row " + index + " cells: ", cells); // Log the cells of each row

    var rowData = {
      Category: cells[1].innerText,
      Name: cells[2].innerText,
      Make: cells[3].innerText,
      Model: cells[4].innerText,

        SenderCondition: cells[6].querySelector('select').value,
        SenderRemarks: cells[7].querySelector('input[type="text"]').value,
        ProductSerial: cells[5].innerText,
        ProductID: cells[8].innerText,


    };
    //console.log("Row data: ", rowData); // Log the rowData
    formObject.push(rowData); // Append rowData to formObject array
});
}



console.log(formObject); // Check the collected data in formObject

var xhr = new XMLHttpRequest();
xhr.open("POST", "send_approval_request", true);

xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            //console.log("Ye hai bhai: ", data)
            // Check if the response indicates success
            if (data.message === 'Excel file updated successfully') {
                // Update the h4 tag with the success message
                floatingMessageBox("Handover process has been successfully initiated.",'green','homepage');

            } else {
                floatingMessageBox(data.message,'red');

                console.error('Error:', data.message);
            }
        } else {
            floatingMessageBox(xhr.status,'red');

            console.error('Error:', xhr.status);
        }
    }
};

xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify(formObject));
 }