window.onload = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/additem_projectowner", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("this is the data", xhr.responseText);

            var data = JSON.parse(xhr.responseText);
            adjustButtonsVisibility(data.session_data)
            populateDropdowns(data);
        }
    };
    xhr.send();
};


function populateDropdowns(data) {
    var categorySelect = document.getElementById("category");
    var projectSelect = document.getElementById("project");
    var ownerSelect = document.getElementById("owner");

    // Sort the categories and projects alphabetically
    var sortedCategories = data.categories.sort();  // Sort categories alphabetically
    var sortedProjects = Object.keys(data.project_emp_dict).sort();  // Sort projects alphabetically

    // Populate categories dropdown
    sortedCategories.forEach(function(category) {
        var option = document.createElement("option");
        option.value = category;
        option.text = category;
        categorySelect.add(option);
    });

    // Populate projects dropdown
    sortedProjects.forEach(function(project) {
        var option = document.createElement("option");
        option.value = project;
        option.text = project;
        projectSelect.add(option);
    });

    // Add event listener to project dropdown to update owners
    projectSelect.addEventListener('change', function() {
        updateOwnersDropdown(this.value, data.project_emp_dict);
    });
}

function updateOwnersDropdown(selectedProject, projectEmpDict) {
    var ownerSelect = document.getElementById("owner");
    ownerSelect.innerHTML = ""; // Clear existing options

    if (selectedProject && projectEmpDict[selectedProject]) {
        // Sort owners (employees and managers) alphabetically before populating the dropdown
        var sortedOwners = projectEmpDict[selectedProject].sort();

        sortedOwners.forEach(function(emp) {
            var option = document.createElement("option");
            option.value = emp;  // Employee ID
            option.text = emp;   // Employee Name
            ownerSelect.add(option);
        });
    } else {
        var option = document.createElement("option");
        option.text = "No owners available";
        ownerSelect.add(option);
    }
}




function addItem() {
    var category = document.getElementById("category").value;
    var name = document.getElementById("name").value;
    var make = document.getElementById("make").value;
    var model = document.getElementById("model").value;
    var productId = document.getElementById("product-id").value;
    var project = document.getElementById("project").value;
    var owner = document.getElementById("owner").value;

    if (!category || !name || !make || !model || !productId || !project || !owner) {
        floatingMessageBox('Please fill all details', 'red');
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/additem", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message === 'Item added successfully') {
                        floatingMessageBox('Item added successfully', 'green', 'homepage');
                    } 
                } catch (e) {
                    floatingMessageBox('An error occurred while processing the response', 'red');
                }
            } else if (xhr.status === 400) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message === 'Product ID already exists') {
                        floatingMessageBox('Product ID already exists', 'red');
                    }
                } catch (e) {
                    floatingMessageBox('An error occurred while processing the response', 'red');
                }
            } else {
                floatingMessageBox('An error occurred with the request: ' + xhr.statusText, 'red');
            }
        }
    };

    xhr.onerror = function () {
        floatingMessageBox('Request failed. Please check your network connection.', 'red');
    };

    var data = JSON.stringify({
        category: category,
        name: name,
        make: make,
        model: model,
        productId: productId,
        owner: owner,
        project: project
    });

    console.log('this is the data to be sent', data);
    xhr.send(data);
}
