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


                document.getElementById("surveyformdata_uid").value = data.surveyformdata_uid || "No data";
                document.getElementById("entry_date_created").value = data.entry_date_created || "No data";
                document.getElementById("user_name").value = data.user_name || "No data";
                document.getElementById("node_name").value = data.node_name || "No data";
                document.getElementById("sector_no").value = data.sector_no || "No data";
                document.getElementById("block_name").value = data.block_name || "No data";
                document.getElementById("plot_name").value = data.plot_name || "No data";
                document.getElementById("plot_status").value = data.plot_status || "No data";
                document.getElementById("surveyor_remarks").value = data.surveyor_remarks || "No data";
                document.getElementById("allotment_date").value = data.allotment_date || "No data";
                document.getElementById("original_allottee").value = data.original_allottee || "No data";
                // document.getElementById("area").value = data.area || "No data";
                document.getElementById("use_of_plot").value = data.use_of_plot || "No data";
                document.getElementById("FSI").value = data.FSI || "No data";
                document.getElementById("term_of_lease").value = data.term_of_lease || "No data";
                document.getElementById("rate").value = data.rate || "No data";
                
                // Handle photos
                document.getElementById("front_photo").src = data.front_photo ? 
                    `static/uploads/${data.front_photo}` : "path/to/default-image.jpg";
                document.getElementById("left_photo").src = data.left_photo ? 
                    `static/uploads/${data.left_photo}` : "path/to/default-image.jpg";
                document.getElementById("back_photo").src = data.back_photo ? 
                    `static/uploads/${data.back_photo}` : "path/to/default-image.jpg";
                document.getElementById("right_photo").src = data.right_photo ? 
                    `static/uploads/${data.right_photo}` : "path/to/default-image.jpg";
                document.getElementById("plot_sketch").src = data.plot_sketch ? 
                    `static/uploads/${data.plot_sketch}` : "path/to/default-image.jpg";
                
                // Optionally update alt text to handle missing photos
                document.getElementById("front_photo").alt = data.front_photo ? data.front_photo : "No Photo for front";
                document.getElementById("left_photo").alt = data.left_photo ? data.left_photo : "No Photo for left";
                document.getElementById("back_photo").alt = data.back_photo ? data.back_photo : "No Photo for back";
                document.getElementById("right_photo").alt = data.right_photo ? data.right_photo : "No Photo for right";
                document.getElementById("plot_sketch").alt = data.plot_sketch ? data.plot_sketch : "No Photo for sketch";

            // owener name and transfer date
            const ownerNtransferDate = data.ownerNtransferDate;

            // Parse the data into an array of objects
            const parsedData = ownerNtransferDate.split(', ').map((entry, index) => {
                const [ownerName, transferDate] = entry.split('|');
                return {
                    owner: `Transfer Owner Name ${index + 1}`,
                    ownerName,
                    transferDate
                };
            });

            // Get the table body element
            const tableBody = document.querySelector("#transferTable tbody");

            // Populate the table dynamically
            parsedData.forEach(({ owner, ownerName, transferDate ,index}) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${owner}</td>
                    <td><input type="text" value="${ownerName}" id="ownerName_${index}" /></td>
                    <td><input type="date" value="${transferDate}" id="transferDate_${index}" /></td>
                `;

                tableBody.appendChild(row);
            });

            
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

            parsedAreaData.forEach(({ row, side1, side2, area ,index}) => {
                const rowElement = document.createElement("tr");
            
                rowElement.innerHTML = `
                    <td>${row}</td>
                    <td>
                        <input type="number" id="length${index}" value="${side1}" 
                            placeholder="Enter Length" oninput="updateArea(${index})" required>
                    </td>
                    <td>
                        <input type="number" id="width${index}" value="${side2}" 
                            placeholder="Enter Width" oninput="updateArea(${index})" required>
                    </td>
                    <td id="area${index}">${area}</td>
                `;
            
                AreatableBody.appendChild(rowElement);
            });

            
           }})
       .catch(error => {
           alert("Error fetching plot details: " + error);
       });
}


window.onload = function() {
    fetchPlotDetails();  // Fetch data as soon as the page loads
};
