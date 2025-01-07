// Declare the data variable at the global scope
var data;
var receiverid;
var senderid;
window.onload = function () {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "/get_form_data", true);
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            // parsedData = JSON.parse();
            data = JSON.parse(xhr2.responseText);
            console.log("this is the data : ",data)
            console.log("We have reached");
            receiverid = data[0].Receiver
            senderid = data[0].Sender

            console.log("sender data",senderid)

            if (data && Array.isArray(data) && data.length > 0) {
                var firstFormData = data[0];
                var initiationDateTime = firstFormData['InitiationDate'];
                var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';
                var ewayreason = firstFormData['ewayreason']
                var completionDateTime = firstFormData['CompletionDate']
                var completionDate = completionDateTime ? completionDateTime.split(' ')[0] : 'Loading Initiation Date ...';

                // if (data.length > 1) {
                //     for (i = 0; i < data.length; i++) {
                //         let allComp = data[i]
                //         var completionDateTime = allComp['CompletionDate'];
                //         if (completionDateTime != 0) {
                //             completionDate = completionDateTime.toString().split(' ')[0]
                //             break;
                //         }
                //         // break;
                //         console.log("CD: ", completionDateTime.toString().split(' ')[0])
                //     }
                // }

                document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
                document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';
                document.getElementById("Sender").textContent = firstFormData['Sendername'] || 'Loading From Person ...';
                document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
                document.getElementById("Receiver").textContent = firstFormData['Receivername'] || 'Loading To Person ...';
                document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
                document.getElementById("InitiationDate").textContent = initiationDate;
                document.getElementById("CompletionDate").textContent = completionDate;

                document.getElementById("ewaybillreasondatatd").textContent = ewayreason;
                    
                if (ewayreason=="-"){
                    document.getElementById("ewaybillreason").style.display = "none";

                }
                var table = document.getElementById("mainTable").getElementsByTagName('tbody')[0];
                data.forEach(function (row, index) {
                    if (row['CompletionDate'] != "-") {
                        var newRow = table.insertRow();
                        newRow.insertCell(0).textContent = index + 1;

                        // Status cell
                        // Status cell
                        var statusCell = newRow.insertCell(1);
                        var statusLabel = document.createElement('label');
                        statusLabel.textContent = (row['CompletionDate'] == "-" | row['CompletionDate'] == 0) ? 'Rejected' : 'Accepted';
                        statusCell.appendChild(statusLabel);

                        // Remaining data cells


                        newRow.insertCell(2).textContent = row['Category'];
                        newRow.insertCell(3).textContent = row['Name'];
                        newRow.insertCell(4).textContent = row['Make'];
                        newRow.insertCell(5).textContent = row['Model'];
                        newRow.insertCell(6).textContent = row['ProductSerial'];
                        newRow.insertCell(7).textContent = row['SenderCondition'];
                        newRow.insertCell(8).textContent = row['SenderRemarks'];
                        newRow.insertCell(9).textContent = row['ReceiverCondition'];
                        newRow.insertCell(10).textContent = row['ReceiverRemark'];
                        let newCell = newRow.insertCell(11);
                        newCell.textContent = row['ProductID'];
                        newCell.style.display = 'none'; // This will hide the cell
                        
                    }
                });

            }
            else {
                console.error("No form data or invalid data format received");
            }
        }
    };
    xhr2.send();
};

var submitButton = document.getElementById("approvalButton");
submitButton.addEventListener("click", function () {
    logRowValues();
});

function logRowValues() {
    var formObject = [];
    var formNo = document.getElementById("formNo").textContent.trim();
    //var toPersonValue = document.getElementById("Receiver").textContent.trim();
    var fromProjectValue = document.getElementById("Source").textContent.trim();
    var toProjectValue = document.getElementById("Destination").textContent.trim();
    var toReceiver = document.getElementById("Receiver").textContent.trim();
    var fromSender = document.getElementById("Sender").textContent.trim();
    var completionDate = document.getElementById("CompletionDate").textContent.trim();

    var newObject = {
        FormNo: formNo,
        receiverid: receiverid,
        Project: toProjectValue,
        completiondate : completionDate
    };
    formObject.push(newObject);


    var tableBody = document.querySelector("#mainTable tbody");
    var rows = tableBody.querySelectorAll('tr');
    rows.forEach(function (row) {
        var cells = row.querySelectorAll('td');
        var rowData = {
            Category: cells[2].innerText,
            Name: cells[3].innerText,
            Make: cells[4].innerText,
            Model: cells[5].innerText,
            ProductID: cells[11].innerText,
            SenderCondition: cells[7].innerText,

            ReceiverCondition: cells[9].innerText,
            Reached: cells[1].innerText,
        };
        rowData.Owner = (rowData.Reached === 'Accepted') ? receiverid : senderid;
        rowData.Project = (rowData.Reached === 'Accepted') ? toProjectValue : fromProjectValue;
        rowData.empreceivername = toReceiver;
        rowData.empsendname = fromSender;
        // rowData.Condition = (rowData.Reached === 'Accepted') ? cells[9].innerText : data.SenderCondition;
        formObject.push(rowData);
    });

    console.log("This is the formObject Data for approvereceive", formObject);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/approve_receive_request", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Success:', xhr.responseText);
                floatingMessageBox("Approval to Receive items has been given.", 'green', 'approvetable');
            } else {
                console.error('Error:', xhr.status);
                floatingMessageBox(xhr.status, 'red');
            }
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(formObject));
}

// console.log("NewObject: ",newObject)

var disapproveButton = document.getElementById("disapproveButton");

disapproveButton.addEventListener("click", function (event) {

    var remarksContainer = document.getElementById("remarksContainer");
    remarksContainer.style.display = "flex";

    // Enable and make the input box required
    var remarksInput = document.getElementById("disapproveremarks");
    remarksInput.required = true;

    // Modify the event listener to handle form submission
    var approvebtn = document.getElementById('approvalButton'); // Assuming this is your approve button ID

    approvebtn.disabled = true; // Use the disabled property to disable the button
    approvebtn.style.backgroundColor = "#808080"; 

    // Get the remarks input element and its value
    var remarksValue = remarksInput.value.trim();

    if (remarksValue === "") {
        // If the remarks input is empty, show an error message and prevent form submission
        floatingMessageBox('Please provide a reason for disapproval.');
        event.preventDefault(); // Prevent the form from submitting
        return; // Exit the function
    }

    var formNo = document.getElementById("formNo").textContent.trim();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/disapprove_receive_request", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
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
    var data = JSON.stringify({ "formNo": formNo, "remarks": remarksValue });
    xhr.send(data);
});
