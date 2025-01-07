document.getElementById('uniqueprojects').addEventListener('click', function() {
    window.location.href = '/uniqueprojects';
});

window.onload = function() {
    fetch('/get_employee_data_panel')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            populateTable(data.emp_data);
            adjustButtonsVisibility(data.session_data);
        });
};

function populateTable(data) {
    const tableBody = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    data.forEach(employee => {
        // Only populate the row if TypeOfAccount is "Employee"
        if (employee.TypeOfAccount === "Employee") {
            console.log(data)
            const row = document.createElement('tr');



            const idCell = document.createElement('td');
            idCell.textContent = employee.ID;
            row.appendChild(idCell);

            const mailCell = document.createElement('td');
            const mailInput = document.createElement('input');
            mailInput.type = 'text';
            mailInput.value = employee.MailID;
            mailInput.disabled = true;
            mailCell.appendChild(mailInput);
            row.appendChild(mailCell);

            const phoneCell = document.createElement('td');
            const phoneInput = document.createElement('input');
            phoneInput.type = 'text';
            phoneInput.value = employee.PhoneNo;
            phoneInput.disabled = true;
            phoneCell.appendChild(phoneInput);
            row.appendChild(phoneCell);

            const projectCell = document.createElement('td');
            const projectInput = document.createElement('input');
            projectInput.type = 'text';
            projectInput.value = employee.Project;
            projectInput.disabled = true;
            projectCell.appendChild(projectInput);
            row.appendChild(projectCell);

            // Hidden Name Cell
            const nameCell = document.createElement('td');
            nameCell.textContent = employee.Name;
            nameCell.style.display = 'none'; // Hide the cell
            row.appendChild(nameCell);

            
            const actionCell = document.createElement('td');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.id = 'editButton';
            editBtn.addEventListener('click', function() {
                enableEditing(row);
            });
            actionCell.appendChild(editBtn);

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.id = 'saveButton';
            saveBtn.style.display = 'none';
            saveBtn.addEventListener('click', function() {
                saveData(row);
            });
            actionCell.appendChild(saveBtn);


            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.id = 'deleteButton';
            deleteBtn.style.display = 'none';
            deleteBtn.addEventListener('click', function() {
                deleteData(row);
            });
            actionCell.appendChild(deleteBtn);


            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.id = 'cancelButton';
            cancelBtn.style.display = 'none';
            cancelBtn.addEventListener('click', function() {
                cancelEdit(row);
            });
            actionCell.appendChild(cancelBtn);

            row.appendChild(actionCell);
            tableBody.appendChild(row);
        }
    });
}


function enableEditing(row) {
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => input.disabled = false);
    console.log('this is the row',inputs)
    const editBtn = row.querySelector('button:nth-child(1)');
    const saveBtn = row.querySelector('button:nth-child(2)');
    const cancelBtn = row.querySelector('button:nth-child(3)');
    const deleteBtn = row.querySelector('button:nth-child(4)');

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'inline-block';

}

function saveData(row) {
    const email = row.children[1].querySelector('input').value;
    const phone = row.children[2].querySelector('input').value;
    const project = row.children[3].querySelector('input').value;
    const name = row.children[4].textContent;

    const updatedData = {
        Name: name,
        Project: project,
        email: email,
        phone: phone
    };

    console.log("this is the data", updatedData)
    fetch('/update_employee_details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'success') {
            floatingMessageBox('Data updated successfully');
        } else if (data.message === 'Pending Items'){
            floatingMessageBox('Please ask the employee to relieve all items from his inventory');
        } else {
            floatingMessageBox('Failed to update data');
        }

        // Disable inputs after saving
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => input.disabled = true);

        const editBtn = row.querySelector('button:nth-child(1)');
        const saveBtn = row.querySelector('button:nth-child(2)');
        const deleteBtn = row.querySelector('button:nth-child(3)');

        const cancelBtn = row.querySelector('button:nth-child(4)');
    

        editBtn.style.display = 'inline';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        deleteBtn.style.display = 'none';

    });
}

function cancelEdit(row) {
    const editBtn = row.querySelector('#editButton');
    const saveBtn = row.querySelector('#saveButton');
    const cancelBtn = row.querySelector('#cancelButton');
    const deleteBtn = row.querySelector('#deleteButton');

    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    deleteBtn.style.display = 'none';

    const inputs = row.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.disabled = true;
    });
}



    // Search bar logic
    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#employeeTable tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });


    function deleteData(row) {

        const name = row.children[4].textContent;
    
        const updatedData = {
            Name: name,
        };
    
        console.log("this is the data", updatedData)
        fetch('/delete_employee_details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'success') {
                floatingMessageBox('Data deleted successfully');
            } else if (data.message === 'Pending Items'){
                floatingMessageBox('Please ask the employee to relieve all items from his inventory');
            } else if (data.message === 'Transaction Process'){
                floatingMessageBox('The employee has an ongoing pending transaction');
            }else {
                floatingMessageBox('Failed to update data');
            }
    
            // Disable inputs after saving
            const inputs = row.querySelectorAll('input');
            inputs.forEach(input => input.disabled = true);
    
            const editBtn = row.querySelector('button:nth-child(1)');
            const saveBtn = row.querySelector('button:nth-child(2)');
            const cancelBtn = row.querySelector('button:nth-child(3)');
            const deleteBtn = row.querySelector('button:nth-child(4)');
    
    
            editBtn.style.display = 'inline';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            deleteBtn.style.display = 'none';

        });
    }

