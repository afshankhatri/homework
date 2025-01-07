let inventoryData;
let initiatedData;
let selectedItems = [];
let currentSource = 'All';
var session_data;

// Fetch and process data on window load
window.onload = function() {
  fetchDataAndInitialize();
};

function fetchDataAndInitialize() {
  fetch('/cart_items')
    .then(response => response.json())
    .then(result => {
      console.log("result: ",result)
      const combinedData = result.combined_data;
      if (Array.isArray(combinedData) && combinedData.length === 5 ) {
        populateSenderAndSource(combinedData[3]);
        inventoryData = combinedData[0];
        initiatedData = combinedData[1];
        populateDropdowns(combinedData[1]);
        adjustButtonsVisibility(combinedData[3]);
        session_data = combinedData[3];
        displaySelectTable();
        toggleSelectedItemsHeader();
        showSelectTab();
        populateSourceDropdown(combinedData[4]);
        // Add event listener for source dropdown change
        document.getElementById('Source').addEventListener('change', handleSourceChange);

      } else {
        console.error('Combined data is not valid:', combinedData);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}


function populateSourceDropdown(senderProjects) {
  const sourceDropdown = document.getElementById('Source');
  
  // Add "All" option to the dropdown
  const allOption = document.createElement('option');
  allOption.value = 'All';
  allOption.textContent = 'All';
  sourceDropdown.appendChild(allOption);
  
  senderProjects.forEach(project => {
    const option = document.createElement('option');
    option.value = project;
    option.textContent = project;
    sourceDropdown.appendChild(option);
  });
}

function handleSourceChange() {
  currentSource = document.getElementById('Source').value;
  selectedItems = []; // Clear selected items when source changes
  displaySelectTable(currentSource);
  displayItemsSelectedTable(); // Refresh the selected items table
  toggleSelectedItemsHeader(); // Update the no items selected header
}

function populateSenderAndSource(details) {
  // Set the text content of 'Sender' element
  document.getElementById('Sender').textContent = details.ID;
  
  // Set the text content of 'Source' element
  document.getElementById('Source').textContent = details.ID;
}
function populateDropdowns(nameProjectDict) {
  const receiverDropdown = document.getElementById('Receiver');
  const destinationDropdown = document.getElementById('Destination');

  // Create a Set to store unique projects
  const uniqueProjects = new Set(Object.keys(nameProjectDict));

  // Populate the Destination dropdown with unique projects
  uniqueProjects.forEach(project => {
    const option = document.createElement('option');
    option.value = project;
    option.textContent = project;
    destinationDropdown.appendChild(option);
  });

  destinationDropdown.addEventListener('change', function() {
    const selectedProject = this.value;
    senderid = session_data.Name;
    sendername = session_data.ID;

    populateReceiverDropdown(selectedProject, nameProjectDict, receiverDropdown, senderid, sendername);
  });
}

function populateReceiverDropdown(selectedProject, nameProjectDict, receiverDropdown, senderId, senderName) {
  // Clear previous options in Receiver dropdown
  receiverDropdown.innerHTML = '';

  // Get the list of employees associated with the selected project
  const employeeList = nameProjectDict[selectedProject];

  // Add the sender to the Receiver dropdown
  const senderOption = document.createElement('option');
  senderOption.value = senderId; // Set the value as SenderID
  senderOption.textContent = senderName; // Display the Sender Name
  receiverDropdown.appendChild(senderOption);

  // Add the employees to the Receiver dropdown
  if (employeeList) {
    employeeList.forEach(employee => {
      const option = document.createElement('option');
      option.value = employee[1]; // Set the value as EmployeeID
      option.textContent = employee[0]; // Display the Employee Name
      receiverDropdown.appendChild(option);
    });
  }
}


function toggleSelectedItemsHeader() {
  const noItemsHeader = document.getElementById('no-items-selected');
  const table = document.getElementById('maintable');
  const tbody = table ? table.querySelector('tbody') : null;

  if (!tbody || tbody.children.length === 0) {
    noItemsHeader.style.display = 'block';
    noItemsHeader.textContent = 'No items selected';
  } else {
    noItemsHeader.style.display = 'none';
  }
}

function showItemsSelectedTab() {
  clearTabs();
  document.getElementById('itemsSelected').style.display = 'block';
  document.getElementById('selectableTab').style.display = 'none';
  document.getElementById('selected-items').style.backgroundColor = '#404040';
  document.getElementById('choose-items').style.backgroundColor = '#262626';
  displayItemsSelectedTable();
  toggleSelectedItemsHeader();
}

function showSelectTab() {
  clearTabs();
  document.getElementById('selectableTab').style.display = 'block';
  document.getElementById('itemsSelected').style.display = 'none';
  document.getElementById('selected-items').style.backgroundColor = '#262626';
  document.getElementById('choose-items').style.backgroundColor = '#404040';
  displaySelectTable(currentSource);
}

function clearTabs() {
  document.getElementById('itemsSelected').style.display = 'none';
  document.getElementById('selectableTab').style.display = 'none';
}

function calculateSelectableData(sourceProject) {
  return inventoryData
    .filter(inventoryItem => !sourceProject || sourceProject === 'All' || inventoryItem.Project === sourceProject)
    .filter(inventoryItem => !initiatedData.hasOwnProperty(inventoryItem.ProductID))
    .map(inventoryItem => ({
      ...inventoryItem,
      disabled: isSelected(inventoryItem.ProductID)
    }));
}


function handleCheckboxChange(checkbox, itemId, item) {
  const selectedSource = document.getElementById('Source').value;
  if (checkbox.checked && selectedSource === 'All') {
    floatingMessageBox('Please select a Source first.');
    checkbox.checked = false;
    return;
  }

  if (checkbox.checked) {
    selectedItems.push({ ...item, condition: '', remark: '' });
  } else {
    selectedItems = selectedItems.filter(selectedItem => selectedItem.ProductID !== itemId);
  }
  displayItemsSelectedTable();
  toggleSelectedItemsHeader();
}


function handleConditionChange(itemId, condition) {
  const item = selectedItems.find(item => item.ProductID === itemId);
  if (item) item.condition = condition;
}

function handleRemarkChange(itemId, remark) {
  const item = selectedItems.find(item => item.ProductID === itemId);
  if (item) item.remark = remark;
}

function displayItemsSelectedTable() {
  const tab = document.getElementById('itemsSelected');
  const table = createTableIfNotExists('maintable', ['Serial No', 'Category', 'Name', 'Make', 'Model', 'ProductID', 'Condition', 'Remark'], tab);
  table.innerHTML = createTableHeader(['Serial No', 'Category', 'Name', 'Make', 'Model', 'ProductID', 'Condition', 'Remark']);
  selectedItems.forEach((item, index) => {
    appendSelectedItem(item, table, index);
  });
}

function updateSelectableData() {
  const tab = document.getElementById('selectableTab');
  const checkboxes = tab.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox, index) => {
    const itemId = selectableData[index].ProductID;
    checkbox.checked = isSelected(itemId);
  });
}

function displaySelectTable(sourceProject = null) {
  const dataToDisplay = calculateSelectableData(sourceProject);
  const tab = document.getElementById('selectableTab');
  const table = createTable(['Serial', 'Select Item', 'Category', 'Name', 'Make', 'Model', 'ProductID']);
  const tbody = table.querySelector('tbody');

  dataToDisplay.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><input type="checkbox" name="selectItem" value="${item.ProductID}" ${item.disabled ? 'checked' : ''}></td>
      <td>${item.Category}</td>
      <td>${item.Name}</td>
      <td>${item.Make}</td>
      <td>${item.Model}</td>
      <td>${item.ProductSerial}</td>
    `;
    row.querySelector('input[type="checkbox"]').addEventListener('change', function() {
      handleCheckboxChange(this, item.ProductID, item);
    });
    tbody.appendChild(row);
  });

  tab.innerHTML = '';
  tab.appendChild(table);
}

function isSelected(itemId) {
  return selectedItems.some(item => item.ProductID === itemId);
}

function appendSelectedItem(item, table, index) {
  const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${item.Category}</td>
    <td>${item.Name}</td>
    <td>${item.Make}</td>
    <td>${item.Model}</td>
    <td>${item.ProductSerial}</td>
    <td><select><option value="">Select Condition</option><option value="Good">Good</option><option value="Not OK">Not OK</option><option value="Damaged">Damaged</option></select></td>
    <td><input type="text" placeholder="Enter remark"></td>
    <td style="display: none;">${item.ProductID}</td> <!-- Hidden TD -->

  `;
  const conditionSelect = row.querySelector('select');
  const remarkInput = row.querySelector('input[type="text"]');

  conditionSelect.value = item.condition;
  remarkInput.value = item.remark;

  conditionSelect.addEventListener('change', function() {
    handleConditionChange(item.ProductID, this.value);
  });

  remarkInput.addEventListener('input', function() {
    handleRemarkChange(item.ProductID, this.value);
  });

  tbody.appendChild(row);
}

function createTableIfNotExists(id, headers, parent) {
  let table = document.getElementById(id);
  if (!table) {
    table = createTable(headers);
    table.id = id;
    parent.appendChild(table);
  }
  return table;
}

function createTable(headers) {
  const table = document.createElement('table');
  table.innerHTML = createTableHeader(headers);
  table.appendChild(document.createElement('tbody'));
  return table;
}

function createTableHeader(headers) {
  return `<thead><tr>${headers.map(header => `<th>${header}</th>` ).join('')}</tr></thead>`;
}

