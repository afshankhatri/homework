// Declare the data variable at the global scope
var data;

window.onload = function () {
  var xhr2 = new XMLHttpRequest();
  xhr2.open("GET", "/get_form_data", true);
  xhr2.onreadystatechange = function () {
    console.log(xhr2.responseText)
    if (xhr2.readyState == 4 && xhr2.status == 200) {
      // parsedData = JSON.parse();
      data = JSON.parse(xhr2.responseText);
      var table = document.getElementById("mainTable");
      console.log("We have reached");
      console.log(data);

      if (data && Array.isArray(data) && data.length > 0) {
        var firstFormData = data[0]; // Get the first dictionary from the list

        var initiationDateTime = firstFormData["InitiationDate"];

        // Extract just the date part
        var initiationDate = initiationDateTime
          ? initiationDateTime.split(" ")[0]
          : "Loading Initiation Date ...";

        var CompletionDate = firstFormData["CompletionDate"];
        if (data.length > 1) {
          for (i = 0; i < data.length; i++) {
            let allComp = data[i];
            var CompletionDateTime = allComp["CompletionDate"];
            if (CompletionDateTime != 0) {
              CompletionDate = CompletionDateTime.toString().split(" ")[0];
              break;
            }
            // break;
            console.log("CD: ", CompletionDateTime);
          }
          if (CompletionDateTime == "0") {
            CompletionDate = "N/A";
          }
        }

        // Set default values for stages
        var stage1 = "Completed";
        var stage2 = "Pending";
        var stage3 = "Pending";
        var stage4 = "Pending";

        function stages(firstFormData) {
          // Check conditions and update stages accordingly
          if (
            firstFormData["ApprovalToSend"] === 1 &&
            firstFormData["CompletionDate"] === "-" &&
            firstFormData["ApprovalToReceive"] === "-"
          ) {
            stage2 = "Completed";
            return;
          } else if (firstFormData["ApprovalToSend"] === 0) {
            stage1 = "Completed";
            stage2 = "Disapproved";
            // If disapproved, set stage3 and stage4 to disapproved too
            stage3 = "Disapproved";
            stage4 = "Disapproved";
            return;
          }

          console.log(data.length);
          // Check completion dates of all other dictionaries in the list
          if (
            firstFormData["ApprovalToSend"] === 1 &&
            firstFormData["CompletionDate"] !== "-" &&
            firstFormData["ApprovalToReceive"] === "-"
          ) {
            console.log(data.length);
            if (data.length > 1) {
              for (var i = 0; i < data.length - 1; i++) {
                var formData = data[i];
                let formDataAhead = data[i + 1];
                var completionDateCheck = formData["CompletionDate"];
                let completionDateAhead = formDataAhead["CompletionDate"];

                if (completionDateCheck !== completionDateAhead) {
                  stage4 = "Pending";
                  stage3 = "Partially Approved";
                  stage2 = "Completed";
                  stage1 = "Completed";
                  return;
                } else if (
                  completionDateCheck == 0 &&
                  completionDateAhead == 0
                ) {
                  stage2 = "Completed";
                  stage3 = "Disapproved";
                  stage4 = "Disapproved";
                } else {
                  stage2 = "Completed";
                  stage3 = "Completed";
                }
              }
            } else {
              if (CompletionDate != 0 && CompletionDate != "-") {
                stage2 = "Completed";
                stage3 = "Completed";
                return;
              } else if (CompletionDate == 0) {
                stage2 = "Completed";
                stage3 = "Disapproved";
                stage4 = "Disapproved";
                return;
              }
            }
          }

          if (data.length > 1) {
            for (var i = 0; i < data.length - 1; i++) {
              var formData = data[i];
              var ApprovalToReceiveCheck = formData["ApprovalToReceive"];
              if (ApprovalToReceiveCheck === 1) {
                stage2 = "Completed";
                stage3 = "Completed";
                stage4 = "Completed";
                return;
                break;
              } else if (ApprovalToReceiveCheck === 0) {
                stage2 = "Completed";
                stage3 = "Completed";
                stage4 = "Disapproved";
              } else {
                stage4 = "Pending";
              }
            }
          } else {
            if (firstFormData["ApprovalToReceive"] === 1) {
              stage2 = "Completed";
              stage3 = "Completed";
              stage4 = "Completed";
              return;
            } else if (firstFormData["ApprovalToReceive"] === 0) {
              stage2 = "Completed";
              stage3 = "Completed";
              stage4 = "Disapproved";
              return;
            }
          }
        }
        stages(firstFormData);
        // var statusCell = newRow.insertCell(1);
        // var statusLabel = document.createElement('label');
        // statusLabel.textContent = (row['CompletionDate'] == "-" | row['CompletionDate'] == 0) ? 'Rejected' : 'Accepted';
        // statusCell.appendChild(statusLabel);
        // Update HTML elements with the computed stages
        var ewayreason = firstFormData['ewayreason']

        document.getElementById("ewaybillreasondatatd").textContent = ewayreason;
                    
        if (ewayreason=="-"){
            document.getElementById("ewaybillreason").style.display = "none";

        }
        document.getElementById("formNo").textContent =
          firstFormData["FormID"] || "Loading Form ID ...";
        document.getElementById("ewaybillno").textContent =
          firstFormData["EwayBillNo"] || "Loading Eway Bill No ...";
        document.getElementById("Sender").textContent =
          firstFormData["Sendername"] || "Loading From Person ...";
        document.getElementById("Source").textContent =
          firstFormData["Source"] || "Loading From Project ...";
        document.getElementById("Receiver").textContent =
          firstFormData["Receivername"] || "Loading To Person ...";
        document.getElementById("Destination").textContent =
          firstFormData["Destination"] || "Loading To Project ...";
        document.getElementById("InitiationDate").textContent = initiationDate;
        document.getElementById("CompletionDate").textContent = CompletionDate;

        // Update stage elements with computed stage values
        document.getElementById("Stage1").textContent = stage1;
        document.getElementById("Stage2").textContent = stage2;
        document.getElementById("Stage3").textContent = stage3;
        document.getElementById("Stage4").textContent = stage4;
      } else {
        console.error("No form data or invalid data format received");
      }

      // Check if AskReceiveApproval is "1" in the first dictionary
      if (data.length > 0 && data[0]["ApprovalToReceive"] === 1) {
        var approvalButton = document.getElementById("approvalButton");
        var approvalText = document.createTextNode(
          "You have already approved this form transaction to receive items"
        );
        approvalButton.parentNode.replaceChild(approvalText, approvalButton);
      }

      data.forEach(function (row, index) {
        var newRow = table.insertRow();

        var serialNoCell = newRow.insertCell(0);
        serialNoCell.textContent = index + 1; // Generate dynamic serial number starting from 1

        var statusCell = newRow.insertCell(1);
        var statusLabel = document.createElement("label");
        // statusLabel.textContent = (row['CompletionDate'] == "-" | row['CompletionDate'] == 0) ? 'Rejected' : 'Accepted';

        if (row["ApprovalToSend"] == "-") {
          // stage1 completed
          statusLabel.textContent = "Waiting For Approval to Send";
        } else if (
          row["InitiationDate"] != 0 &&
          row["InitiationDate"] != "-" &&
          row["ApprovalToSend"] == 1 &&
          row["Status"] != "Rejected" &&
          row["CompletionDate"] == "-"
        ) {
          // stage2 completed
          statusLabel.textContent = "Waiting For Receival";
        } else if (
          row["ApprovalToSend"] == 1 &&
          row["Status"] != "Rejected" &&
          row["CompletionDate"] != 0 &&
          row["CompletionDate"] != "-"
        ) {
          // stage3
          statusLabel.textContent = "Waiting For Approval to Receive";
        } else if (row["ApprovalToSend"] == 1 && row["Status"] == "Rejected") {
          // stage 3 Reject
          statusLabel.textContent = "Rejected";
        } else {
          // stage4
          statusLabel.textContent = "RUN NAHI HORA MEI";
        }

        statusCell.appendChild(statusLabel);

        var productCategoryCell = newRow.insertCell(2);
        productCategoryCell.textContent = row["Category"];

        var ProductNoCell = newRow.insertCell(3);
        ProductNoCell.textContent = row["Name"];

        var productNameCell = newRow.insertCell(4);
        productNameCell.textContent = row["Make"];

        var productNameCell = newRow.insertCell(5);
        productNameCell.textContent = row["Model"];

        var ModelCell = newRow.insertCell(6);
        ModelCell.textContent = row["ProductSerial"];

        var SenderconditionCell = newRow.insertCell(7);
        SenderconditionCell.textContent = row["SenderCondition"];

        var SenderremarksCell = newRow.insertCell(8);
        SenderremarksCell.textContent = row["SenderRemarks"];

        var ReceiverconditionCell = newRow.insertCell(9);
        ReceiverconditionCell.textContent = row["ReceiverCondition"];

        var ReceiverremarksCell = newRow.insertCell(10);
        ReceiverremarksCell.textContent = row["ReceiverRemark"];
      });
    }
  };
  xhr2.send();
};
