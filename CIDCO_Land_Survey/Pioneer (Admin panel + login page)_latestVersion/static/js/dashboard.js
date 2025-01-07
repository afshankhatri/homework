window.onload = function() {
    clearFilter(); // Automatically call clearFilter when the page loads
}
// Frontend code

let selectedNode = null;
let selectedSector = null;

// Handle node button click
function handleNodeClick(node) {
    selectedNode = node;
    console.log("Selected Node:", selectedNode);
    updateButtonState('node-button', node);
}

// Handle sector button click
function handleSectorClick(sector) {
    selectedSector = sector;
    console.log("Selected Sector:", selectedSector);
    updateButtonState('sector-button', sector);
}

// Update active button state
function updateButtonState(buttonClass, value) {
    const buttons = document.querySelectorAll(`.${buttonClass}`);
    buttons.forEach(button => {
        if (button.value === value) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}
        
// Apply filter
function applyFilter() {
    console.log("Applying Filter...");
    console.log("Selected Node:", selectedNode);
    console.log("Selected Sector:", selectedSector);

    fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            node_name: selectedNode,
            sector_no: selectedSector
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Filter Response:", data);
        updateMetricsTable(data);
    })
    .catch(error => console.error("Error applying filter:", error));
}

// Clear filter
function clearFilter() {
    console.log("Clearing Filter...");
    selectedNode = null;
    selectedSector = null;
    updateButtonState('node-button', null);
    updateButtonState('sector-button', null);

    fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        console.log("Clear Filter Response:", data);
        updateMetricsTable(data);
    })
    .catch(error => console.error("Error clearing filter:", error));
}

let chartInstance;
        // Update metrics table
        function updateMetricsTable(data) {
            document.getElementById('totalForms').textContent = data.total_forms || 0;
            document.getElementById('formsCompleted').textContent = data.forms_completed || 0;
            document.getElementById('formsIncomplete').textContent = data.forms_incomplete || 0;
            document.getElementById('pendingQC').textContent = data.pending_qc || 0;
            document.getElementById('pendingValidator').textContent = data.pending_validator || 0;
            updateChart(data);
        }

function updateChart(data) {
    const chartData = {
        labels: [
            'Total Forms', 
            'Forms Completed', 
            'Forms Incomplete', 
            'Pending QC', 
            'Pending Validator'
        ],
        datasets: [{
            label: 'Metrics',
            data: [
                data.total_forms || 0, 
                data.forms_completed || 0, 
                data.forms_incomplete || 0, 
                data.pending_qc || 0, 
                data.pending_validator || 0
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 2
        }]
    };

    const ctx = document.getElementById('barChart').getContext('2d');

    if (chartInstance) {
        // If the chart already exists, update its data
        chartInstance.data = chartData;
        chartInstance.update();
    } else {
        // Create a new chart instance
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}