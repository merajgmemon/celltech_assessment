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