

// Open modal for image
function openModal(image) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = 'flex';
    modalImg.src = image.src;
}

// Close image modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}


// copy the  main prt from editByQC.js file 


function fetchPlotDetails() {
    fetch('/get_outputform_data')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log("This is the data");
                console.log(data);

                // Populate the fields with fetched data
                document.getElementById("surveyformdata_uid").textContent = data.surveyformdata_uid || "No data";
                document.getElementById("entry_date_created").textContent = data.entry_date_created || "No data";
                document.getElementById("user_name").textContent = data.user_name || "No data";
            
                document.getElementById("node_name").textContent = data.node_name || "No data";
                document.getElementById("sector_no").textContent = data.sector_no || "No data";
                document.getElementById("block_name").value = data.block_name || "No data";
                document.getElementById("plot_name").textContent = data.plot_name || "No data";
                document.getElementById("plot_status").textContent = data.plot_status || "No data";
                document.getElementById("surveyor_remarks").textContent = data.surveyor_remarks || "No data";
                document.getElementById("allotment_date").textContent = data.allotment_date || "No data";
                document.getElementById("original_allottee").textContent = data.original_allottee || "No data";
              
                // document.getElementById("area").textContent = data.area || "No data";
                document.getElementById("use_of_plot").textContent = data.use_of_plot || "No data";
                document.getElementById("rate").textContent = data.rate || "No data";
                // document.getElementById("ownerNtransferDate").textContent = data.ownerNtransferDate || "No data";
           
              
                // Handle photos
                document.getElementById("front_photo").src = data.front_photo ?
                    `static/uploads/${data.front_photo}` : "static/uploads/default.png";
                document.getElementById("left_photo").src = data.left_photo ?
                    `static/uploads/${data.left_photo}` : "static/uploads/default.png";
                document.getElementById("back_photo").src = data.back_photo ?
                    `static/uploads/${data.back_photo}` : "static/uploads/default.png";
                document.getElementById("right_photo").src = data.right_photo ?
                    `static/uploads/${data.right_photo}` : "static/uploads/default.png";
                document.getElementById("plot_sketch").src = data.plot_sketch ?
                    `static/uploads/${data.plot_sketch}` : "static/uploads/default.png";
                
                // Optionally update alt text to handle missing photos
                document.getElementById("front_photo").alt = data.front_photo ? data.front_photo : "No Photo for front";
                document.getElementById("left_photo").alt = data.left_photo ? data.left_photo : "No Photo for left";
                document.getElementById("back_photo").alt = data.back_photo ? data.back_photo : "No Photo for back";
                document.getElementById("right_photo").alt = data.right_photo ? data.right_photo : "No Photo for right";
                document.getElementById("plot_sketch").alt = data.plot_sketch ? data.plot_sketch : "No Photo for sketch";

                // Get the transfer details
                const transferDetails = data.ownerNtransferDate;

if (!transferDetails) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td colspan="3" style="text-align: center;">No Data</td>
    `;
    tableBody.appendChild(row);
} else {
    // // Add table headers
    transferTable.innerHTML = `
        <thead>
            <tr>
                <th>Transfer Owner</th>
                <th>Owner Name</th>
                <th>Transfer Date</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

//    Parse the data into an array of objects
            const parsedData = transferDetails.split(', ').map((entry, index) => {
                const [ownerName, transferDate] = entry.split('|');
                return {
                    owner: `Transfer Owner Name ${index + 1}`,
                    ownerName,
                    transferDate
                };
            });

            // Get the table body element
            const tableBody = document.querySelector("#transferTable tbody");
            const table = document.querySelector("#transferTable");

            // Populate the table dynamically
            parsedData.forEach(({ owner, ownerName, transferDate }) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${owner}</td>
                    <td>${ownerName}</td>
                    <td>${transferDate}</td>
                `;

                tableBody.appendChild(row);
            });
}




            // area details of plot

            const area = data.area;
            console.log(area);

            const parsedAreaData = area.split(',').map((entry, index) => {
                const [dimensions, area] = entry.split('=');
                const[side1,side2] = dimensions.split('x')
                return {
                    row: `Area ${index + 1}`,
                    side1,side2,
                    area
                };
            });

            const AreatableBody = document.querySelector("#dimensionsTable tbody");

            parsedAreaData.forEach(({ row, side1, side2, area }) => {
                const rowElement = document.createElement("tr");
            
                rowElement.innerHTML = `
                    <td>${row}</td>
                    <td>${side1}</td>
                    <td>${side2}</td>
                    <td>${area}</td>
                `;
            
                AreatableBody.appendChild(rowElement);
            });
        }})}

// Call the function to populate data on page load
window.onload = function() {
    fetchPlotDetails();  // Fetch data as soon as the page loads
    
};