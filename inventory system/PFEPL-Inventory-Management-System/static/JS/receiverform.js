// Function to log row values and send them to the server
function logRowValues() {
    var formObject = [];
    var formNoLabel = document.getElementById('formNo');
    var formNoValue = formNoLabel.innerText;

    var formNoData = {
        FormID: formNoValue
    };
    formObject.push(formNoData);

    var tableBody = document.querySelector('#mainTable');
    var rows = tableBody.querySelectorAll('tr');
    rows.forEach(function(row, index) {
        if (index !== 0) {
            var cells = row.querySelectorAll('td');
            var checkbox = cells[0].querySelector('input[type="checkbox"]');
            var conditionSelect = cells[9].querySelector('select[name="conditionReceiver"]');
            var selectedCondition = conditionSelect ? conditionSelect.value : '';

            var receiverRemarksInput = cells[10].querySelector('input[type="text"]');
            var receiverRemarks = receiverRemarksInput ? receiverRemarksInput.value : '';


            var category = cells[2].innerText;
            var productname = cells[3].innerText;
            var make = cells[4].innerText;
            var model = cells[5].innerText;
            var serialNo = cells[11].innerText;

            var rowData = {
                SerialNo: serialNo,
                ReceiverCondition: selectedCondition,
                ReceiverRemark: receiverRemarks,
                Reached: checkbox.checked,
                productname: productname,
                Category:category,
                Make : make,
                Model : model
            };

            formObject.push(rowData);
        }
    });

    console.log("This is the formObject Data", formObject);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/receive_approval_request", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Success:', xhr.responseText);
                floatingMessageBox("\nYou may contact your manager to approve the form.", 'green', 'receivertable');
            } else {
                console.error('Error:', xhr.status);
                floatingMessageBox("Failed to send approval request. Please try again later.", 'red');
            }
        }
    };

    xhr.onerror = function() {
        console.error('Network Error');
        floatingMessageBox("Network error. Please check your connection and try again.", 'red');
    };

    xhr.send(JSON.stringify(formObject));
}

// Function to initialize the table and event listeners
function initializeTable(data) {
    var table = document.getElementById("mainTable");

    data.forEach(function(row, index) {
        var newRow = table.insertRow();

        var reachedCell = newRow.insertCell(0);
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox_${index}`;
        reachedCell.appendChild(checkbox);

        var serialNoCell = newRow.insertCell(1);
        serialNoCell.textContent = index + 1;

        var productCategoryCell = newRow.insertCell(2);
        productCategoryCell.textContent = row['Category'];

        var productNameCell = newRow.insertCell(3);
        productNameCell.textContent = row['Name'];

        var makeCell = newRow.insertCell(4);
        makeCell.textContent = row['Make'];

        var modelCell = newRow.insertCell(5);
        modelCell.textContent = row['Model'];

        var productNoCell = newRow.insertCell(6);
        productNoCell.textContent = row['ProductSerial'];

        var conditionCell = newRow.insertCell(7);
        conditionCell.textContent = row['SenderCondition'];

        var remarksCell = newRow.insertCell(8);
        remarksCell.textContent = row['SenderRemarks'];

        var conditionReceiverCell = newRow.insertCell(9);
        conditionReceiverCell.innerHTML = `
            <select id="conditionReceiver_${index}" name="conditionReceiver" disabled>
                <option value="">Select</option>
                <option value="Good">Good</option>
                <option value="Not Ok">Not Ok</option>
                <option value="Damaged">Damaged</option>
            </select>
        `;

        var remarksReceiverCell = newRow.insertCell(10);
        remarksReceiverCell.innerHTML = `
            <input id="remarksReceiver_${index}" type="text" name="remarksReceiver">
        `;


        var productid = newRow.insertCell(11);
        productid.textContent = row['ProductID'];

        // Hide the cell
        productid.style.display = 'none';

        checkbox.addEventListener('change', function() {
            var isChecked = checkbox.checked;
            var selectElement = document.getElementById(`conditionReceiver_${index}`);
            var inputElement = document.getElementById(`remarksReceiver_${index}`);
            if (selectElement && inputElement) {
                if (isChecked) {
                    selectElement.removeAttribute('disabled');
                } else {
                    selectElement.setAttribute('disabled', 'disabled');
                }
            } else {
                console.error('Select or input element not found.');
            }
        });
    });
}

// Function to load and populate form data
function loadFormData() {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "/get_form_data", true);
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            try {
                // var parsedData = JSON.parse();
                var data = JSON.parse(xhr2.responseText);
                console.log(data);

                if (data && Array.isArray(data) && data.length > 0) {
                    var firstFormData = data[0];
                    var initiationDateTime = firstFormData['InitiationDate'];
                    var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';
                    var ewayreason = firstFormData['ewayreason']
                    console.log(ewayreason)
                    document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
                    document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';
                    document.getElementById("Sender").textContent = firstFormData['Sendername'] || 'Loading From Person ...';
                    document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
                    document.getElementById("Receiver").textContent = firstFormData['Receivername'] || 'Loading To Person ...';
                    document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
                    document.getElementById("InitiationDate").textContent = initiationDate;
                    document.getElementById("ewaybillreasondatatd").textContent = ewayreason;
                    
                    if (ewayreason=="-"){
                        document.getElementById("ewaybillreason").style.display = "none";

                    }



                    initializeTable(data);
                } else {
                    console.error("No form data or invalid data format received");
                    floatingMessageBox("Failed to load form data. Please try again later.", 'red');
                }
            } catch (e) {
                console.error('Error parsing JSON response:', e);
                floatingMessageBox("Failed to load form data. Please try again later.", 'red');
            }
        }
    };
    xhr2.onerror = function() {
        console.error('Network Error');
        floatingMessageBox("Network error. Please check your connection and try again.", 'red');
    };
    xhr2.send();
}

// Event listener for the approval button
var askApprovalButton = document.getElementById("ask-approval-button");
askApprovalButton.addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('[id^="checkbox_"]');
    var atLeastOneChecked = false;
    var allConditionsSelected = true;
    var allUncheckedRemarksFilled = true;

    checkboxes.forEach(function(checkbox, index) {
        var selectElement = document.getElementById(`conditionReceiver_${index}`);
        var inputElement = document.getElementById(`remarksReceiver_${index}`);
        if (checkbox.checked) {
            atLeastOneChecked = true;
            if (selectElement && selectElement.value === "") {
                floatingMessageBox("Please select a condition for the selected items", 'red');
                allConditionsSelected = false;
                return;
            }
        } else {
            if (inputElement && inputElement.value.trim() === "") {
                floatingMessageBox("Please fill in the receiver's remark for unchecked items", 'red');
                allUncheckedRemarksFilled = false;
                return;
            }
        }
    });

    if (!atLeastOneChecked) {
        floatingMessageBox("Please select at least one item", 'red');
    } else if (atLeastOneChecked && allConditionsSelected && allUncheckedRemarksFilled) {
        logRowValues();
    }
});

// Load form data on window load
window.onload = loadFormData;

var disapproveButton = document.getElementById("disapproveButton");

disapproveButton.addEventListener("click", function (event) {

    var remarksContainer = document.getElementById("remarksContainer");
    remarksContainer.style.display = "flex";

    // Enable and make the input box required
    var remarksInput = document.getElementById("disapproveremarks");
    remarksInput.required = true;
    

    // Modify the event listener to handle form submission
    var approvebtn = document.getElementById('ask-approval-button'); // Assuming this is your approve button ID

    approvebtn.disabled = true; // Use the disabled property to disable the button
    approvebtn.style.backgroundColor = "#808080"; 

    // Get the remarks input element and its value
    var remarksValue = remarksInput.value.trim();
    console.log(remarksValue);
    if (remarksValue === "") {
        // If the remarks input is empty, show an error message and prevent form submission
        floatingMessageBox('Please provide a reason for disapproval.');
        event.preventDefault(); // Prevent the form from submitting
        return; // Exit the function
    }


    var formNo = document.getElementById("formNo").textContent.trim();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/disapprove_receive_approval_request", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Request was successful
                console.log("Form No sent successfully!");
                console.log(formNo)
                floatingMessageBox("Form Transaction has been disapproved", 'green','receivertable');
            } else {
                // There was an error
                console.error("Error:", xhr.statusText);
            }
        }
    };
    var data = JSON.stringify({"formNo": formNo, "remarks": remarksValue });
    xhr.send(data);
});