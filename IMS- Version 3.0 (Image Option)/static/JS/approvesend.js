// Get the disapprove button
var disapproveButton = document.getElementById("disapproveButton");

// Add event listener to the disapprove button
disapproveButton.addEventListener("click", function(event) {
    // Show the remarks input box and label
    var remarksContainer = document.getElementById("remarksContainer");
    remarksContainer.style.display = "flex";

    // Enable and make the input box required
    var remarksInput = document.getElementById("disapproveremarks");
    remarksInput.required = true;

    // Display the floating message box
    floatingMessageBox('Please provide reason for disapproval');

    // Disable the approve button
    document.getElementById('approvalButton').disabled = true; // Disable the button
    document.getElementById('ewaybillbutton').disabled = true; // Disable the button
    document.getElementById('ewaybill').disabled = true; // Disable the button

    // If already clicked, don't prevent default (for form submission)
    if (disapproveButton.dataset.clicked) {
        return;
    }

    // Add a dataset property to track if the button was clicked
    disapproveButton.dataset.clicked = true;

    // Modify the event listener to handle form submission
    disapproveButton.addEventListener("click", function(event) {
        // Get the remarks input element and its value
        var remarksValue = remarksInput.value.trim();

        if (remarksValue === "") {
            // If the remarks input is empty, show an error message and prevent form submission
            floatingMessageBox('Please provide a reason for disapproval.');
            event.preventDefault(); // Prevent the form from submitting
            return; // Exit the function
        }

        document.getElementById('approvalButton').disabled = true; // Disable the button
        document.getElementById('disapproveButton').disabled = true; // Disable the button
        document.getElementById('ewaybillbutton').disabled = true; // Disable the button

        var formNo = document.getElementById("formNo").textContent.trim();
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/disapprove_send_request", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Request was successful
                    console.log("Form No sent successfully!");
                    console.log(formNo)
                    floatingMessageBox("Form Transaction has been disapproved", 'green', 'approvetable');
                } else {
                    // There was an error
                    console.error("Error:", xhr.statusText);
                }
            }
        };
        var data = JSON.stringify({"formNo": formNo, "remarks": remarksValue});
        xhr.send(data);
    });
});
var submitButton = document.getElementById("approvalButton");

// Add event listener to the submit button
submitButton.addEventListener("click", function(event) {
    // Get the input element and its value
    const ewaybillInput = document.getElementById('ewaybill');
    const ewaybillValue = ewaybillInput.value.trim();

    // Get the input element and its value
    const emptyewaybill = document.getElementById('emptyewaybill');
    const emptyewaybillValue = emptyewaybill.value.trim();


    // Retrieve source and destination values from HTML labels
    var sourceValue = document.getElementById("Source").textContent.trim();
    var destinationValue = document.getElementById("Destination").textContent.trim();

    // Check if the source and destination are the different and e-way bill is empty
    if (sourceValue !== destinationValue && ewaybillValue.trim() === "") {
        floatingMessageBox('Source and Destination are the different. E-way bill is compulsory.');
        event.preventDefault(); // Prevent the form from submitting
    } else if (ewaybillValue.trim() !== "" && (ewaybillValue.trim().length !== 12 || /\s/.test(ewaybillValue))) {
        floatingMessageBox('Please enter exactly 12 digits for the e-way bill number');
        event.preventDefault(); // Prevent the form from submitting
    }     // Check if the source and destination are the same and e-way bill is empty
    else if (sourceValue === destinationValue && emptyewaybillValue.trim() === "" && ewaybillValue.trim() === "") {
        floatingMessageBox('Please provide reason for no ewaybill');
               // Show the nobillremarksContainer
               document.getElementById('nobillremarksContainer').style.display = 'block';
        event.preventDefault(); // Prevent the form from submitting

    }else {
        console.log("we have reached here guysssssss for different ewaybill")

        logRowValues(); // Call the function to log row values
        // Disable the buttons 
        document.getElementById('disapproveButton').disabled = true;
        document.getElementById('approvalButton').disabled = true;
        document.getElementById('ewaybillbutton').disabled = true; // Disable the button
    }
       
});

var tableBody = document.querySelector("#mainTable tbody");

function logRowValues() {
    formObject = [];
    // Get the value from the input box
    var ewaybillValue = document.getElementById("ewaybill").value;
    var formNo = document.getElementById("formNo").textContent.trim();

    // Get the input element and its value
    var emptyewaybill = document.getElementById('emptyewaybill');
    var emptyewaybillValue = emptyewaybill.value.trim();


    // Add the input box value to the formObject
    formObject.push({ EwayBill: ewaybillValue }, { FormNo: formNo });
    if (emptyewaybillValue.trim() === ""){
        emptyewaybillValue = "-"
    }

    formObject.push({ ewayreason: emptyewaybillValue });
    console.log("This is the formObject Data", formObject); // Check the collected data in formObject

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/approve_send_request", true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Success:', xhr.responseText);
                if (xhr.responseText === "Approval has been successfully given") {
                    floatingMessageBox("Approval has been successfully given.\n The sender may proceed to send the items.", 'green', 'approvetable');
                } else if (xhr.responseText === "Eway Bill Exists") {
                    floatingMessageBox('Ewaybill already exists');
                    document.getElementById('approvalButton').disabled = false; // Disable the button
                    document.getElementById('disapproveButton').disabled = false; // Disable the button
                    document.getElementById('ewaybillbutton').disabled = false; // Disable the button

                } else {
                    console.error('Error:', xhr.responseText);
                    alert('An unexpected error occurred: ' + xhr.responseText);
                }
            } else {
                console.error('Error:', xhr.status);
                alert('An error occurred while processing the request. Status code: ' + xhr.status);
            }
        }
    };

    xhr.setRequestHeader("Content-Type", "application/json"); // Set request header
    xhr.send(JSON.stringify(formObject));
}

window.onload = function() {
    if (!sessionStorage.getItem('refreshed')) {
        // Refresh the page
        sessionStorage.setItem('refreshed', 'true');
        window.location.reload();
    }
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "/get_form_data", true);
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            console.log('aiugds')
            // parsedData = JSON.parse();
            var data = JSON.parse(xhr2.responseText);
            var table = document.getElementById("mainTable");
            console.log("We have reached")
            console.log(data)

            // Check if AskReceiveApproval is "yes" in the first dictionary
            if (data.length > 0 && data[0]['ApprovalToSend'] === 'yes') {
                // Remove elements from the page
            }

            if (data && Array.isArray(data) && data.length > 0) {
                var firstFormData = data[0]; // Get the first dictionary from the list
                // Update labels with values from the first dictionary
                var initiationDateTime = firstFormData['InitiationDate'];
                // Extract just the date part
                var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';
                document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
                document.getElementById("Sender").textContent = firstFormData['Sendername'] || 'Loading From Person ...';
                document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
                document.getElementById("Receiver").textContent = firstFormData['Receivername'] || 'Loading To Person ...';
                document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
                document.getElementById("InitiationDate").textContent = initiationDate;        
            } else {
                console.error("No form data or invalid data format received");
            }

            data.forEach(function(row, index) {

                var newRow = table.insertRow();

                var serialNoCell = newRow.insertCell(0);
                serialNoCell.textContent = index + 1; // Generate dynamic serial number starting from 1

                var productCategoryCell = newRow.insertCell(1);
                productCategoryCell.textContent = row['Category'];

                var ProductNoCell = newRow.insertCell(2);
                ProductNoCell.textContent = row['Name'];

                var productNameCell = newRow.insertCell(3);
                productNameCell.textContent = row['Make'];

                var productNameCell = newRow.insertCell(4);
                productNameCell.textContent = row['Model'];

                var ModelCell = newRow.insertCell(5);
                ModelCell.textContent = row['ProductSerial'];
                
                var SenderconditionCell = newRow.insertCell(6);
                SenderconditionCell.textContent = row['SenderCondition'];

                var SenderremarksCell = newRow.insertCell(7);
                SenderremarksCell.textContent = row['SenderRemarks'];
                
            });
        }
    };
    xhr2.send();
};

document.getElementById('back-button').addEventListener('click', function() {
    window.location.href = '/approvetable';
});
