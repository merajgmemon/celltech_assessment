interface FormField {
    label: string;
    type: string;
    options?: string[];
    value?: string | boolean;
}

interface Form {
    formName: string;
    fields: FormField[];
    // responses?: Record<string, string>[];
    responses: Record<string, string | string[]>[];
}

let forms: Form[] = JSON.parse(localStorage.getItem("forms") || "[]");

// Function to display forms in the list
function displayForms() {
    const formList = document.getElementById("formList")!;
    formList.innerHTML = "";

    forms = JSON.parse(localStorage.getItem("forms") || "[]");

    forms.forEach((form, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
        ${form.formName} | ${form.fields.length} fields | ${form.responses.length} Data
        <button onclick="editForm(${index})">Edit</button>
        <button onclick="deleteForm(${index})">Delete</button>
        <button onclick="viewFillForm(${index})">View/Fill Form</button>
        <button onclick="viewFormData(${index})">View Form Data</button>
        `;
        formList.appendChild(li);
    });
}

// Function to handle creating a form
function createForm() {
    const formName = (document.getElementById("formName") as HTMLInputElement).value.trim();

    if (!formName) {
        alert("Form name is required!");
        return;
    }

    const newForm: Form = {
        formName,
        fields: [],
        responses: []
    };

    forms.push(newForm);
    localStorage.setItem("forms", JSON.stringify(forms));
    displayForms();
    (document.getElementById("formName") as HTMLInputElement).value = ""; // Clear input
}

// Function to edit an existing form
function editForm(index: number) {
    const form = forms[index];
    const formFieldsContainer = document.getElementById("formFieldsContainer")!;
    formFieldsContainer.innerHTML = "";

    // Display the form fields for editing
    form.fields.forEach((field, fieldIndex) => {
        const fieldDiv = document.createElement("div");
        fieldDiv.className = "form-div";
        fieldDiv.innerHTML = `
        <label class="control-label">Label: </label>
        <input type="text" value="${field.label}" onchange="updateFieldLabel(${index}, ${fieldIndex}, event)" />

        <label class="control-type">Type: </label>
        <select onchange="updateFieldType(${index}, ${fieldIndex}, event)">
          <option value="single-text" ${field.type === "single-text" ? "selected" : ""}>Single Line Text</option>
          <option value="multi-text" ${field.type === "multi-text" ? "selected" : ""}>Multi Line Text</option>
          <option value="checkbox" ${field.type === "checkbox" ? "selected" : ""}>Checkbox</option>
          <option value="radio" ${field.type === "radio" ? "selected" : ""}>Radio</option>
          <option value="dropdown" ${field.type === "dropdown" ? "selected" : ""}>Dropdown</option>
        </select>

        ${["checkbox", "radio", "dropdown"].indexOf(field.type) !== -1 ? `<label class="control-label">Options: </label><textarea placeholder="Options (comma-separated)" onchange="updateFieldOptions(${index}, ${fieldIndex}, event)">${field.options?.join(",") || ""}</textarea>` : ""}

        <button onclick="removeField(${index}, ${fieldIndex})">Remove Field</button>
      `;
        formFieldsContainer.appendChild(fieldDiv);
    });

    // Add a new field to the form
    const addFieldButton = document.createElement("button");
    addFieldButton.textContent = "Add New Field";
    addFieldButton.onclick = () => addField(index);
    formFieldsContainer.appendChild(addFieldButton);

    const noteAutoSave = document.createElement("span");
    noteAutoSave.className = "ml-10p";
    noteAutoSave.textContent = "Note: All Changes are Auto Saved.";
    formFieldsContainer.appendChild(noteAutoSave);

    // Open the modal to edit the form
    const modal = document.getElementById("formViewModal")!;
    modal.style.display = "flex";
    document.getElementById("modalTitle")!.innerText = "Edit/View Form";
    displayForms();
}

// Function to update the label of a field
function updateFieldLabel(formIndex: number, fieldIndex: number, event: Event) {
    const newLabel = (event.target as HTMLInputElement).value;
    forms[formIndex].fields[fieldIndex].label = newLabel;
    localStorage.setItem("forms", JSON.stringify(forms));
}

// Function to update the type of a field
function updateFieldType(formIndex: number, fieldIndex: number, event: Event) {
    const newType = (event.target as HTMLSelectElement).value;
    forms[formIndex].fields[fieldIndex].type = newType;
    if (["checkbox", "radio", "dropdown"].indexOf(newType) !== -1) {
        forms[formIndex].fields[fieldIndex].options = [];
    } else {
        delete forms[formIndex].fields[fieldIndex].options;
    }
    localStorage.setItem("forms", JSON.stringify(forms));
    editForm(formIndex); // Re-render form fields after updating the type
}

// Function to update the options of a field
function updateFieldOptions(formIndex: number, fieldIndex: number, event: Event) {
    const newOptions = (event.target as HTMLTextAreaElement).value.split(",").map(option => option.trim());
    forms[formIndex].fields[fieldIndex].options = newOptions;
    localStorage.setItem("forms", JSON.stringify(forms));
}

// Function to remove a field from the form
function removeField(formIndex: number, fieldIndex: number) {
    let confirm: boolean = window.confirm("Are you sure, you wang to Remove Field?")
    if (confirm) {
        forms[formIndex].fields.splice(fieldIndex, 1);
        localStorage.setItem("forms", JSON.stringify(forms));
        editForm(formIndex); // Re-render form fields after deletion
    }
}

// Function to add a new field to the form
function addField(formIndex: number) {
    const newField: FormField = {
        label: "New Field",
        type: "single-text"
    };
    forms[formIndex].fields.push(newField);
    localStorage.setItem("forms", JSON.stringify(forms));
    editForm(formIndex); // Re-render form fields after adding a new one
}

// Function to delete a form
function deleteForm(index: number) {
    let confirm: boolean = window.confirm("Are you sure, you wang to Delete?")
    if (confirm) {
        forms.splice(index, 1);
        localStorage.setItem("forms", JSON.stringify(forms));
        displayForms();
    }
}

// Function to close the form view modal
document.getElementById("closeModal")!.onclick = () => {
    const modal = document.getElementById("formViewModal")!;
    modal.style.display = "none";
};

// Function to view and fill a form
function viewFillForm(index: number) {
    const form = forms[index];
    const formFieldsContainer = document.getElementById("formFieldsContainer")!;
    formFieldsContainer.innerHTML = "";

    form.fields.forEach((field, fieldIndex) => {
        let fieldInput: any;

        if (field.type === "single-text" || field.type === "multi-text") {
            fieldInput = document.createElement(field.type === "multi-text" ? "textarea" : "input");
            (fieldInput as HTMLInputElement).type = "text";
            fieldInput.name = field.label;
        } else if (field.type === "checkbox" || field.type === "radio") {
            fieldInput = document.createElement("div");
            field.options?.forEach(option => {
                const inputOption = document.createElement("input");
                inputOption.type = field.type;
                inputOption.name = field.label;
                inputOption.value = option;
                inputOption.setAttribute("data-index", fieldIndex.toString());  // Fix: Set data-index here

                const label = document.createElement("label");
                label.textContent = option;
                label.appendChild(inputOption);

                fieldInput.appendChild(label);
            });
        } else if (field.type === "dropdown") {
            fieldInput = document.createElement("select");
            fieldInput.name = field.label;
            field.options?.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option;
                optionElement.textContent = option;
                fieldInput.appendChild(optionElement);
            });
        }

        if (fieldInput) {
            fieldInput.setAttribute("data-index", fieldIndex.toString());  // Fix: Ensure this is set
            formFieldsContainer.appendChild(fieldInput);
        }

        const labelElement = document.createElement("label");
        labelElement.textContent = field.label;
        labelElement.className = "";

        const fieldDiv = document.createElement("div");
        fieldDiv.className = "form-div";
        fieldDiv.appendChild(labelElement);
        fieldDiv.appendChild(fieldInput!);

        formFieldsContainer.appendChild(fieldDiv);
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.onclick = () => saveFormData(index);
    formFieldsContainer.appendChild(saveButton);

    const modal = document.getElementById("formViewModal")!;
    modal.style.display = "flex";
    document.getElementById("modalTitle")!.innerText = "View/Fill Form";
}

// Function to save form data
function saveFormData(index: number) {
    const form = forms[index];
    const response: Record<string, string | string[]> = {};

    // Select all form inputs inside the form view modal
    const inputs = document.querySelectorAll("#formFieldsContainer input, #formFieldsContainer select, #formFieldsContainer textarea");

    inputs.forEach(input => {
        const fieldIndex = parseInt(input.getAttribute("data-index")!);
        const fieldLabel = form.fields[fieldIndex].label;

        if (input instanceof HTMLInputElement) {
            if (input.type === "checkbox") {
                // Handle checkboxes as an array of selected values
                if (input.checked) {
                    if (!response[fieldLabel]) {
                        response[fieldLabel] = [];
                    }
                    (response[fieldLabel] as string[]).push(input.value);
                }
            } else if (input.type === "radio") {
                // Handle radio button
                if (input.checked) {
                    response[fieldLabel] = input.value;
                }
            } else {
                // Handle single-text and multi-text
                response[fieldLabel] = input.value;
            }
        } else if (input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
            response[fieldLabel] = input.value;
        }
    });

    // Ensure empty checkboxes store an empty array
    form.fields.forEach(field => {
        if (field.type === "checkbox" && !response[field.label]) {
            response[field.label] = [];
        }
    });

    form.responses!.push(response);
    localStorage.setItem("forms", JSON.stringify(forms));
    alert("Form data saved successfully!");
    document.getElementById("formViewModal")!.style.display = "none";
    displayForms();
}

// Function to view submitted form data
function viewFormData(index: number) {
    const form = forms[index];
    const modalContent = document.getElementById("formFieldsContainer")!;
    modalContent.innerHTML = "";

    if (!form.responses || form.responses.length === 0) {
        modalContent.innerHTML = "<p>No data available.</p>";
    } else {
        const table = document.createElement("table");
        const headerRow = document.createElement("tr");

        // Create table headers dynamically based on field labels
        form.fields.forEach(field => {
            const th = document.createElement("th");
            th.textContent = field.label;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Populate the table rows with form response data
        form.responses.forEach(response => {
            const row = document.createElement("tr");
            form.fields.forEach(field => {
                const td = document.createElement("td");
                const fieldValue = response[field.label];

                // Convert array values (checkboxes) to a comma-separated string
                if (Array.isArray(fieldValue)) {
                    td.textContent = fieldValue.join(", ");
                } else {
                    td.textContent = fieldValue || "N/A";
                }

                row.appendChild(td);
            });
            table.appendChild(row);
        });

        modalContent.appendChild(table);
    }

    const modal = document.getElementById("formViewModal")!;
    modal.style.display = "flex";
    document.getElementById("modalTitle")!.innerText = "View Form Data";
}

// Event listener for creating a new form
document.getElementById("createFormButton")!.addEventListener("click", createForm);

// Initial render of forms list
displayForms();
