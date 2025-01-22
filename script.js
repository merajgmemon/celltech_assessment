var forms = JSON.parse(localStorage.getItem("forms") || "[]");
// Function to display forms in the list
function displayForms() {
    var formList = document.getElementById("formList");
    formList.innerHTML = "";
    forms = JSON.parse(localStorage.getItem("forms") || "[]");
    forms.forEach(function (form, index) {
        var li = document.createElement("li");
        li.innerHTML = "\n        ".concat(form.formName, " | ").concat(form.fields.length, " fields | ").concat(form.responses.length, " Data\n        <button onclick=\"editForm(").concat(index, ")\">Edit</button>\n        <button onclick=\"deleteForm(").concat(index, ")\">Delete</button>\n        <button onclick=\"viewFillForm(").concat(index, ")\">View/Fill Form</button>\n        <button onclick=\"viewFormData(").concat(index, ")\">View Form Data</button>\n        ");
        formList.appendChild(li);
    });
}
// Function to handle creating a form
function createForm() {
    var formName = document.getElementById("formName").value.trim();
    if (!formName) {
        alert("Form name is required!");
        return;
    }
    var newForm = {
        formName: formName,
        fields: [],
        responses: []
    };
    forms.push(newForm);
    localStorage.setItem("forms", JSON.stringify(forms));
    displayForms();
    document.getElementById("formName").value = ""; // Clear input
}
// Function to edit an existing form
function editForm(index) {
    var form = forms[index];
    var formFieldsContainer = document.getElementById("formFieldsContainer");
    formFieldsContainer.innerHTML = "";
    // Display the form fields for editing
    form.fields.forEach(function (field, fieldIndex) {
        var _a;
        var fieldDiv = document.createElement("div");
        fieldDiv.className = "form-div";
        fieldDiv.innerHTML = "\n        <label class=\"control-label\">Label: </label>\n        <input type=\"text\" value=\"".concat(field.label, "\" onchange=\"updateFieldLabel(").concat(index, ", ").concat(fieldIndex, ", event)\" />\n\n        <label class=\"control-type\">Type: </label>\n        <select onchange=\"updateFieldType(").concat(index, ", ").concat(fieldIndex, ", event)\">\n          <option value=\"single-text\" ").concat(field.type === "single-text" ? "selected" : "", ">Single Line Text</option>\n          <option value=\"multi-text\" ").concat(field.type === "multi-text" ? "selected" : "", ">Multi Line Text</option>\n          <option value=\"checkbox\" ").concat(field.type === "checkbox" ? "selected" : "", ">Checkbox</option>\n          <option value=\"radio\" ").concat(field.type === "radio" ? "selected" : "", ">Radio</option>\n          <option value=\"dropdown\" ").concat(field.type === "dropdown" ? "selected" : "", ">Dropdown</option>\n        </select>\n\n        ").concat(["checkbox", "radio", "dropdown"].indexOf(field.type) !== -1 ? "<label class=\"control-label\">Options: </label><textarea placeholder=\"Options (comma-separated)\" onchange=\"updateFieldOptions(".concat(index, ", ").concat(fieldIndex, ", event)\">").concat(((_a = field.options) === null || _a === void 0 ? void 0 : _a.join(",")) || "", "</textarea>") : "", "\n\n        <button onclick=\"removeField(").concat(index, ", ").concat(fieldIndex, ")\">Remove Field</button>\n      ");
        formFieldsContainer.appendChild(fieldDiv);
    });
    // Add a new field to the form
    var addFieldButton = document.createElement("button");
    addFieldButton.textContent = "Add New Field";
    addFieldButton.onclick = function () { return addField(index); };
    formFieldsContainer.appendChild(addFieldButton);
    var noteAutoSave = document.createElement("span");
    noteAutoSave.className = "ml-10p";
    noteAutoSave.textContent = "Note: All Changes are Auto Saved.";
    formFieldsContainer.appendChild(noteAutoSave);
    // Open the modal to edit the form
    var modal = document.getElementById("formViewModal");
    modal.style.display = "flex";
    document.getElementById("modalTitle").innerText = "Edit/View Form";
    displayForms();
}
// Function to update the label of a field
function updateFieldLabel(formIndex, fieldIndex, event) {
    var newLabel = event.target.value;
    forms[formIndex].fields[fieldIndex].label = newLabel;
    localStorage.setItem("forms", JSON.stringify(forms));
}
// Function to update the type of a field
function updateFieldType(formIndex, fieldIndex, event) {
    var newType = event.target.value;
    forms[formIndex].fields[fieldIndex].type = newType;
    if (["checkbox", "radio", "dropdown"].indexOf(newType) !== -1) {
        forms[formIndex].fields[fieldIndex].options = [];
    }
    else {
        delete forms[formIndex].fields[fieldIndex].options;
    }
    localStorage.setItem("forms", JSON.stringify(forms));
    editForm(formIndex); // Re-render form fields after updating the type
}
// Function to update the options of a field
function updateFieldOptions(formIndex, fieldIndex, event) {
    var newOptions = event.target.value.split(",").map(function (option) { return option.trim(); });
    forms[formIndex].fields[fieldIndex].options = newOptions;
    localStorage.setItem("forms", JSON.stringify(forms));
}
// Function to remove a field from the form
function removeField(formIndex, fieldIndex) {
    var confirm = window.confirm("Are you sure, you wang to Remove Field?");
    if (confirm) {
        forms[formIndex].fields.splice(fieldIndex, 1);
        localStorage.setItem("forms", JSON.stringify(forms));
        editForm(formIndex); // Re-render form fields after deletion
    }
}
// Function to add a new field to the form
function addField(formIndex) {
    var newField = {
        label: "New Field",
        type: "single-text"
    };
    forms[formIndex].fields.push(newField);
    localStorage.setItem("forms", JSON.stringify(forms));
    editForm(formIndex); // Re-render form fields after adding a new one
}
// Function to delete a form
function deleteForm(index) {
    var confirm = window.confirm("Are you sure, you wang to Delete?");
    if (confirm) {
        forms.splice(index, 1);
        localStorage.setItem("forms", JSON.stringify(forms));
        displayForms();
    }
}
// Function to close the form view modal
document.getElementById("closeModal").onclick = function () {
    var modal = document.getElementById("formViewModal");
    modal.style.display = "none";
};
// Function to view and fill a form
function viewFillForm(index) {
    var form = forms[index];
    var formFieldsContainer = document.getElementById("formFieldsContainer");
    formFieldsContainer.innerHTML = "";
    form.fields.forEach(function (field, fieldIndex) {
        var _a, _b;
        var fieldInput;
        if (field.type === "single-text" || field.type === "multi-text") {
            fieldInput = document.createElement(field.type === "multi-text" ? "textarea" : "input");
            fieldInput.type = "text";
            fieldInput.name = field.label;
        }
        else if (field.type === "checkbox" || field.type === "radio") {
            fieldInput = document.createElement("div");
            (_a = field.options) === null || _a === void 0 ? void 0 : _a.forEach(function (option) {
                var inputOption = document.createElement("input");
                inputOption.type = field.type;
                inputOption.name = field.label;
                inputOption.value = option;
                inputOption.setAttribute("data-index", fieldIndex.toString()); // Fix: Set data-index here
                var label = document.createElement("label");
                label.textContent = option;
                label.appendChild(inputOption);
                fieldInput.appendChild(label);
            });
        }
        else if (field.type === "dropdown") {
            fieldInput = document.createElement("select");
            fieldInput.name = field.label;
            (_b = field.options) === null || _b === void 0 ? void 0 : _b.forEach(function (option) {
                var optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                fieldInput.appendChild(optionElement);
            });
        }
        if (fieldInput) {
            fieldInput.setAttribute("data-index", fieldIndex.toString()); // Fix: Ensure this is set
            formFieldsContainer.appendChild(fieldInput);
        }
        var labelElement = document.createElement("label");
        labelElement.textContent = field.label;
        labelElement.className = "";
        var fieldDiv = document.createElement("div");
        fieldDiv.className = "form-div";
        fieldDiv.appendChild(labelElement);
        fieldDiv.appendChild(fieldInput);
        formFieldsContainer.appendChild(fieldDiv);
    });
    var saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.onclick = function () { return saveFormData(index); };
    formFieldsContainer.appendChild(saveButton);
    var modal = document.getElementById("formViewModal");
    modal.style.display = "flex";
    document.getElementById("modalTitle").innerText = "View/Fill Form";
}
// Function to save form data
function saveFormData(index) {
    var form = forms[index];
    var response = {};
    // Select all form inputs inside the form view modal
    var inputs = document.querySelectorAll("#formFieldsContainer input, #formFieldsContainer select, #formFieldsContainer textarea");
    inputs.forEach(function (input) {
        var fieldIndex = parseInt(input.getAttribute("data-index"));
        var fieldLabel = form.fields[fieldIndex].label;
        if (input instanceof HTMLInputElement) {
            if (input.type === "checkbox") {
                // Handle checkboxes as an array of selected values
                if (input.checked) {
                    if (!response[fieldLabel]) {
                        response[fieldLabel] = [];
                    }
                    response[fieldLabel].push(input.value);
                }
            }
            else if (input.type === "radio") {
                // Handle radio button
                if (input.checked) {
                    response[fieldLabel] = input.value;
                }
            }
            else {
                // Handle single-text and multi-text
                response[fieldLabel] = input.value;
            }
        }
        else if (input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
            response[fieldLabel] = input.value;
        }
    });
    // Ensure empty checkboxes store an empty array
    form.fields.forEach(function (field) {
        if (field.type === "checkbox" && !response[field.label]) {
            response[field.label] = [];
        }
    });
    form.responses.push(response);
    localStorage.setItem("forms", JSON.stringify(forms));
    alert("Form data saved successfully!");
    document.getElementById("formViewModal").style.display = "none";
    displayForms();
}
// Function to view submitted form data
function viewFormData(index) {
    var form = forms[index];
    var modalContent = document.getElementById("formFieldsContainer");
    modalContent.innerHTML = "";
    if (!form.responses || form.responses.length === 0) {
        modalContent.innerHTML = "<p>No data available.</p>";
    }
    else {
        var table_1 = document.createElement("table");
        var headerRow_1 = document.createElement("tr");
        // Create table headers dynamically based on field labels
        form.fields.forEach(function (field) {
            var th = document.createElement("th");
            th.textContent = field.label;
            headerRow_1.appendChild(th);
        });
        table_1.appendChild(headerRow_1);
        // Populate the table rows with form response data
        form.responses.forEach(function (response) {
            var row = document.createElement("tr");
            form.fields.forEach(function (field) {
                var td = document.createElement("td");
                var fieldValue = response[field.label];
                // Convert array values (checkboxes) to a comma-separated string
                if (Array.isArray(fieldValue)) {
                    td.textContent = fieldValue.join(", ");
                }
                else {
                    td.textContent = fieldValue || "N/A";
                }
                row.appendChild(td);
            });
            table_1.appendChild(row);
        });
        modalContent.appendChild(table_1);
    }
    var modal = document.getElementById("formViewModal");
    modal.style.display = "flex";
    document.getElementById("modalTitle").innerText = "View Form Data";
}
// Event listener for creating a new form
document.getElementById("createFormButton").addEventListener("click", createForm);
// Initial render of forms list
displayForms();
