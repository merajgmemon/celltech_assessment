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