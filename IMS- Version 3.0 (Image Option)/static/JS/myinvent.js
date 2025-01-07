let tableData = [];

// Function to fetch data from Flask route using XMLHttpRequest
function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/my_invent_dashboard', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                var filteredData = responseData.filtered_data;
                var sessionData = responseData.session_data;

                console.log(filteredData);
                console.log(sessionData);

                displayData(filteredData);
                populateFilters(filteredData);
                attachFilterListeners();
                attachSearchListener();
                adjustButtonsVisibility(sessionData);

            } else {
                console.error('Error fetching data:', xhr.statusText);
            }
        }
    };
    xhr.send();
}


// Function to get unique values for each column
function getUniqueValues(data, column) {
    return [...new Set(data.map(item => item[column]))];
}

// Function to populate filters with unique values and sort them in ascending order
function populateFilters(data) {
    const filters = {
        'filter-category': 'Category',
        'filter-name': 'Name',
        'filter-make': 'Make',
        'filter-model': 'Model',
        'filter-condition': 'Condition',
        'filter-project': 'Project',
        'filter-empname': 'empname',
        'filter-handoverdate' : 'Handover_Date'
    };

    for (const [filterId, column] of Object.entries(filters)) {
        const select = document.getElementById(filterId);
        if (select) {
            select.innerHTML = '<option value="All">All</option>'; // Reset options
            let uniqueValues = getUniqueValues(data, column);

            // Sort unique values in ascending order
            uniqueValues.sort();

            uniqueValues.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.text = value;
                select.appendChild(option);
            });
        }
    }
}


// Function to initialize DataTables
function initializeDataTable() {
    $('#data-table').DataTable({
        lengthChange: false,  // Remove "Show entries" dropdown
        info: false,          // Remove "Showing X to Y of Z entries" label
        paging: false,        // Remove pagination
        searching: false,     // Remove the default search box
        ordering: false,      // Disable column ordering
        autoWidth: false,     // Disable automatic column width calculation
        responsive: true      // Enable responsive design
    });
}

// Function to display data in the table
function displayData(data) {
    const tableBody = document.querySelector('#data-table tbody');


    // Define the desired column sequence
    const desiredColumns = ['SerialNo', 'Category', 'ProductSerial', 'Name', 'Make', 'Model', 'Condition', 'Project', 'empname', 'Handover_Date'];

    // Populate table with data and generate SerialNo dynamically
    data.forEach((row, index) => {
        const tr = document.createElement('tr');

        // Populate columns
        desiredColumns.forEach(column => {
            const td = document.createElement('td');
            if (column === 'SerialNo') {
                td.textContent = index + 1; // Serial number based on the index
            } else {
                td.textContent = row[column] || ''; // If data for the column is not available, display an empty string
            }
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });

    // Initialize DataTables with custom options
    initializeDataTable();

}

// Function to filter the table and update serial numbers
function filterTable() {
    const filters = {
        'filter-category': 'Category',
        'filter-name': 'Name',
        'filter-make': 'Make',
        'filter-model': 'Model',
        'filter-condition': 'Condition',
        'filter-project': 'Project',
        'filter-empname': 'empname',
        'filter-handoverdate': 'Handover_Date'
    };

    const tableBody = document.querySelector('#data-table tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    let visibleRows = 0;

    rows.forEach(row => {
        let showRow = true;  // Assume the row should be visible

        // Iterate through each filter and apply the filtering logic
        for (const [filterId, column] of Object.entries(filters)) {
            const filterValue = document.getElementById(filterId).value.trim().toLowerCase();
            const cellValue = row.cells[columnIndex(column)].textContent.trim().toLowerCase();

            // If filterValue is not 'All' and the value in the column doesn't match the filter, hide the row
            if (filterValue !== 'all' && filterValue !== cellValue) {
                showRow = false;
                break;
            }
        }

        // Show or hide the row based on whether it passed all filter checks
        if (showRow) {
            row.style.display = ''; // Show the row
            row.cells[0].textContent = ++visibleRows; // Update the serial number
        } else {
            row.style.display = 'none'; // Hide the row
        }
    });

    // Update the dropdowns after filtering
    updateDropdowns(filters);
}



// Function to update dropdowns based on visible rows and sort them
function updateDropdowns(activeFilters) {
    const filters = {
        'filter-category': 'Category',
        'filter-name': 'Name',
        'filter-make': 'Make',
        'filter-model': 'Model',
        'filter-condition': 'Condition',
        'filter-project': 'Project',
        'filter-empname': 'empname',
        'filter-handoverdate' : 'Handover_Date'
    };

    for (const [filterId, column] of Object.entries(filters)) {
        const select = document.getElementById(filterId);
        const uniqueValues = new Set(['All']);

        // If the user has selected a value, store it to set it back later
        const currentValue = select.value;

        const visibleRows = Array.from(document.querySelectorAll('#data-table tbody tr'))
            .filter(row => row.style.display !== 'none');

        visibleRows.forEach(row => {
            const cellValue = row.cells[columnIndex(column)].textContent;
            uniqueValues.add(cellValue);
        });

        // Sort unique values in ascending order
        const sortedUniqueValues = [...uniqueValues].sort();

        // Populate dropdown with unique values
        select.innerHTML = '';
        sortedUniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.text = value;
            select.appendChild(option);
        });

        // Ensure the current selection is retained
        if (activeFilters && activeFilters[filterId] === column) {
            // If the active filter is selected, set it back
            select.value = currentValue;
        }
    }
}


// Helper function to get column index based on column name
function columnIndex(columnName) {
    const columns = ['SerialNo', 'Category', 'ProductSerial', 'Name', 'Make', 'Model', 'Condition', 'Project', 'empname', 'Handover_Date'];
    return columns.indexOf(columnName);
}


// Function to attach filter listeners to dropdowns
function attachFilterListeners() {
    const filterIds = [
        'filter-category', 'filter-name', 'filter-make', 'filter-model',
        'filter-condition', 'filter-project', 'filter-empname', 'filter-handoverdate'
    ];

    filterIds.forEach(filterId => {
        const select = document.getElementById(filterId);

        // Remove any existing event listener (if previously attached)
        select.removeEventListener('change', handleFilterChange);

        // Add a new event listener for change
        select.addEventListener('change', handleFilterChange);
    });
}

// Function to handle filter change event
function handleFilterChange() {
    const select = this;
    
    // Clear selection if "All" is chosen
    if (select.value === 'all') {
        select.selectedIndex = 0; // Reset to the first option
    }

    // Call the filterTable function to filter based on new selection
    filterTable();
}



// Function to update dropdowns based on visible rows and sort them
function updateDropdowns(activeFilters) {
    const filters = {
        'filter-category': 'Category',
        'filter-name': 'Name',
        'filter-make': 'Make',
        'filter-model': 'Model',
        'filter-condition': 'Condition',
        'filter-project': 'Project',
        'filter-empname': 'empname',
        'filter-handoverdate' : 'Handover_Date'
    };

    for (const [filterId, column] of Object.entries(filters)) {
        const select = document.getElementById(filterId);
        const uniqueValues = new Set(['All']);  // Initialize with 'All' option

        // If the user has selected a value, store it to set it back later
        const currentValue = select.value;

        // Collect values from visible rows
        const visibleRows = Array.from(document.querySelectorAll('#data-table tbody tr'))
            .filter(row => row.style.display !== 'none');

        visibleRows.forEach(row => {
            const cellValue = row.cells[columnIndex(column)].textContent;
            uniqueValues.add(cellValue);
        });

        // Sort unique values in ascending order
        const sortedUniqueValues = [...uniqueValues].sort();

        // Populate dropdown with sorted unique values
        select.innerHTML = '';  // Clear the existing options
        sortedUniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.text = value;
            select.appendChild(option);
        });

        // Ensure the current selection is retained
        if (activeFilters && activeFilters[filterId] === column) {
            // If the active filter is selected, set it back
            select.value = currentValue;
        }
    }
}

// Function to attach search listener to search bar and update serial numbers dynamically
function attachSearchListener() {
    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        var visibleRows = 0;

        $("#data-table tbody tr").filter(function() {
            var isVisible = $(this).text().toLowerCase().indexOf(value) > -1;
            $(this).toggle(isVisible);

            // If the row is visible, update the serial number
            if (isVisible) {
                $(this).find('td:first').text(++visibleRows); // Update serial number in the first column
            }
        });
    });
}


// Call the fetchData function when the page loads
window.onload = fetchData;