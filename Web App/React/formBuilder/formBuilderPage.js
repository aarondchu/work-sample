import * as React from "react";
import { FormBuilderForm } from "./FormBuilderForm";
import { InputFormBuilder } from "./InputFormBuilder";
import { ButtonFormBuilder } from "./ButtonFormBuilder";
import { Field } from "./Field";
import { FormBuilderApi } from "./formBuilderApi";
import * as dragula from 'react-dragula';
export default class FormBuilderPage extends React.Component {
    constructor(props) {
        super(props);
        this.onFieldTypeChange = (field, fieldValue) => {
            let form;
            switch (fieldValue) {
                case "input":
                    form = { type: "text", name: "", className: "", placeholder: "", value: "", label: this.state.addFieldForm[this.state.currentField].form.label, error: "" };
                    break;
                case "dropdown":
                    form = { name: "", label: this.state.addFieldForm[this.state.currentField].form.label, selectedValue: "", options: [], error: "" };
                    break;
                case "radio":
                    form = { label: this.state.addFieldForm[this.state.currentField].form.label, options: [], error: "" };
                    break;
                case "checkbox":
                    form = { label: this.state.addFieldForm[this.state.currentField].form.label, options: [], error: "" };
                    break;
                default:
                    break;
            }
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { inputType: fieldValue, form: form }) }) }));
        };
        this.onColDropDownChange = (field, fieldValue) => {
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { form: Object.assign({}, this.state.addFieldForm[field].form, { dbColumn: fieldValue }) }) }) }));
        };
        this.onInputTypeChange = (field, fieldValue) => {
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { form: Object.assign({}, this.state.addFieldForm[field].form, { type: fieldValue }) }) }) }));
        };
        this.onChange = (fieldName, fieldValue, field) => {
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { form: Object.assign({}, this.state.addFieldForm[field].form, { [fieldName]: fieldValue }) }) }) }));
        };
        this.onTitleChange = (fieldName, fieldValue) => {
            this.setState(Object.assign({}, this.state, { formTitle: fieldValue }));
        };
        this.onOptionsChange = (index, value, field) => {
            let newOptions = this.state.addFieldForm[field].form.options.map((opt, idx) => {
                if (idx == index) {
                    let newOption = JSON.parse(JSON.stringify(opt));
                    newOption = Object.assign({}, opt, { text: value, value: index });
                    return newOption;
                }
                else
                    return opt;
            });
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { form: Object.assign({}, this.state.addFieldForm[field].form, { options: newOptions }) }) }) }));
        };
        this.onAddOptionsClick = (field) => {
            let newOptions = [...this.state.addFieldForm[field].form.options];
            newOptions.push({ text: "", value: "", followup: [] });
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { form: Object.assign({}, this.state.addFieldForm[field].form, { options: newOptions }) }) }) }));
        };
        this.onConditionalQuestionClick = (idx, field) => {
            let followup = `${field}_${idx}_${this.state.addFieldForm[field].form.options[idx].followup.length}`;
            let newOptions = this.state.addFieldForm[field].form.options.map((opt, index) => {
                if (index == idx) {
                    let newOption = JSON.parse(JSON.stringify(opt));
                    newOption.followup.push(followup);
                    return newOption;
                }
                else
                    return opt;
            });
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { form: Object.assign({}, this.state.addFieldForm[field].form, { options: newOptions }) }), [followup]: {
                        inputType: "input",
                        form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
                        displayForm: true,
                        parentQuestion: field
                    } }) }));
        };
        this.removeOption = (idx, field) => {
            let newFieldForm = JSON.parse(JSON.stringify(this.state.addFieldForm));
            let newOptions = [...newFieldForm[field].form.options];
            if (newOptions[idx].followup) {
                newOptions[idx].followup.map(item => delete newFieldForm[item]);
            }
            newOptions.splice(idx, 1);
            newFieldForm[field].form.options = newOptions;
            this.setState(Object.assign({}, this.state, { addFieldForm: newFieldForm }));
        };
        this.onPublishFormClick = () => {
            let newFields = [];
            for (let i = 0; i < document.getElementById("dragulaContainer").children.length; i++) {
                let newIndex = document.getElementById("dragulaContainer").children.item(i).id;
                let newField = JSON.parse(JSON.stringify(this.state.formFields[newIndex]));
                newFields.push(newField);
            }
            FormBuilderApi.postForm({ ScholarshipId: this.state.scholarshipId, Form: JSON.stringify({ title: this.state.formTitle, fields: newFields }) })
                .then(res => {
                if (res.item) {
                    localStorage.removeItem(`formTemp${this.state.scholarshipId}`);
                    this.props.history.push(`/admin/forms/${this.state.scholarshipId}`);
                }
                else
                    throw new Error("Unable to publish form");
            })
                .catch(err => console.log("Error: ", err.message));
        };
        this.onDeleteFieldClick = (idx, field) => {
            let newFields = this.state.formFields.filter((currField, index) => index != idx);
            this.setState(Object.assign({}, this.state, { formFields: newFields }), () => console.log("Deleted Field", this.state));
        };
        this.onCancelConditional = (idx, field) => {
            let parent = this.state.addFieldForm[field].parentQuestion;
            let newOptions = this.state.addFieldForm[parent].form.options.map((opt, index) => {
                if (index == idx) {
                    let newOption = JSON.parse(JSON.stringify(opt));
                    newOption.followup = newOption.followup.filter(currField => currField != field);
                    return newOption;
                }
                else
                    return opt;
            });
            let newFieldForm = JSON.parse(JSON.stringify(this.state.addFieldForm));
            delete newFieldForm[field];
            newFieldForm[parent].form.options = newOptions;
            this.setState(Object.assign({}, this.state, { addFieldForm: newFieldForm }));
        };
        this.onCancelAddEditClick = (idx, field) => {
            this.setState(Object.assign({}, this.state, { editingField: { editIndex: 0, inEditMode: false }, addFieldForm: Object.assign({}, this.state.addFieldForm, { [this.getNextFieldName(this.state.formFields)]: {
                        inputType: "input",
                        form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
                        displayForm: false
                    } }), currentField: `${this.getNextFieldName(this.state.formFields)}` }));
        };
        this.onEditFieldClick = (idx, field) => {
            let newFields = this.state.formFields.map((field, index) => {
                if (index == this.state.editingField.editIndex) {
                    return JSON.parse(JSON.stringify(this.state.addFieldForm));
                }
                else
                    return field;
            });
            this.setState(Object.assign({}, this.state, { addFieldForm: {
                    [this.getNextFieldName(newFields)]: {
                        inputType: "input",
                        form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
                        displayForm: false
                    }
                }, editingField: {
                    inEditMode: false,
                    editIndex: 0
                }, formFields: newFields, currentField: `${this.getNextFieldName(newFields)}` }), () => {
                this.saveToLocalStorage();
            });
        };
        this.getNextFieldName = (field) => {
            if (field.length <= 0)
                return 0;
            let highestField = 0;
            field.map((field, index) => {
                if (Number(Object.keys(field)[0]) > highestField)
                    highestField = Number(Object.keys(field)[0]);
            });
            return highestField + 1;
        };
        this.setUpForm = (info) => {
            let newForm = JSON.parse(info.form);
            let newFields = newForm ? newForm.fields : "";
            let newTitle = newForm ? newForm.title : "";
            this.setState(Object.assign({}, this.state, { formFields: newFields, formTitle: newTitle, formId: info.id, addFieldForm: {
                    [this.getNextFieldName(newFields)]: {
                        inputType: "input",
                        form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
                        displayForm: false,
                        parentQuestion: null
                    }
                }, currentField: `${this.getNextFieldName(newFields)}` }));
        };
        this.setupDragula = (element) => {
            dragula([element], {
                moves: (el, source, handle, sibling) => {
                    return handle.classList.contains("handle");
                }
            });
        };
        this.changePosition = (oldIndex, newIndex, fields) => {
            let field = JSON.parse(JSON.stringify(fields[oldIndex]));
            let newFields = fields.filter((currField, index) => index != oldIndex);
            newFields.splice(newIndex, 0, field);
            return newFields;
        };
        this.onSaveConditional = (field) => {
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { displayForm: false }) }) }));
        };
        this.onEditConditional = (idx, field) => {
            this.setState(Object.assign({}, this.state, { addFieldForm: Object.assign({}, this.state.addFieldForm, { [field]: Object.assign({}, this.state.addFieldForm[field], { displayForm: false }) }) }));
        };
        this.onSaveFieldClick = (field) => {
            let newFields = [...this.state.formFields];
            newFields.push(Object.assign({}, this.state.addFieldForm));
            this.setState(Object.assign({}, this.state, { addFieldForm: {
                    [this.getNextFieldName(newFields)]: {
                        inputType: "input",
                        form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
                        displayForm: false
                    }
                }, editingField: {
                    inEditMode: false,
                    editIndex: 0
                }, formFields: newFields, currentField: `${this.getNextFieldName(newFields)}` }), () => {
                this.saveToLocalStorage();
            });
        };
        this.onSetEditState = (idx, field) => {
            let newFormField = JSON.parse(JSON.stringify(this.state.formFields[idx]));
            newFormField[field].displayForm = true;
            this.setState(Object.assign({}, this.state, { editingField: Object.assign({}, this.state.editingField, { editIndex: idx, inEditMode: true }), addFieldForm: newFormField, currentField: `${Object.keys(newFormField)[0]}` }), () => {
                window.scrollTo(0, document.getElementById("fieldForm").offsetTop);
            });
        };
        this.saveToLocalStorage = () => {
            localStorage.setItem(`formTemp${this.state.scholarshipId}`, JSON.stringify({ title: this.state.formTitle, fields: this.state.formFields }));
        };
        this.state = {
            options: [{
                    value: "input",
                    text: "Input"
                }, {
                    value: "dropdown",
                    text: "Dropdown"
                }, {
                    value: "radio",
                    text: "Radio button"
                }, {
                    value: "checkbox",
                    text: "Checkbox"
                }],
            inputTypeOptions: [{
                    value: "text",
                    text: "Text"
                }, {
                    value: "number",
                    text: "Number"
                }, {
                    value: "email",
                    text: "Email"
                }, {
                    value: "date",
                    text: "Date"
                }],
            dataColumnOptions: [{
                    value: "",
                    text: "Select a column from database"
                }, {
                    value: "firstName",
                    text: "First Name"
                }, {
                    value: "lastName",
                    text: "Last Name"
                }, {
                    value: "middleName",
                    text: "Middle Name"
                }, {
                    value: "email",
                    text: "E-Mail"
                }, {
                    value: "gender",
                    text: "Gender"
                }],
            addFieldForm: {},
            formTitle: "",
            formFields: [],
            editingField: {
                inEditMode: false,
                editIndex: 0,
            },
            currentField: "",
            formId: 0,
            scholarshipId: props.match.params.id
        };
    }
    componentDidMount() {
        FormBuilderApi.getForm(this.state.scholarshipId)
            .then(res => {
            let info = JSON.parse(JSON.stringify(res.item));
            let formString = "";
            if (localStorage.getItem(`formTemp${this.state.scholarshipId}`))
                info.form = localStorage.getItem(`formTemp${this.state.scholarshipId}`);
            this.setUpForm(info);
        })
            .catch(err => console.log("Error:", err.message));
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("h3", null, this.state.formTitle),
            React.createElement("div", { className: "card" },
                React.createElement("div", { className: "card-body" },
                    React.createElement("form", null,
                        React.createElement(InputFormBuilder, { type: "text", name: "formTitle", label: "Form TItle:", placeholder: "Enter Form Title Here", value: this.state.formTitle, onChange: this.onTitleChange, field: "" }),
                        this.state.formFields.length > 0 ?
                            React.createElement("div", { className: "card bg-secondary", style: { marginBottom: "15px" } },
                                React.createElement("div", { className: "card-body", id: "dragulaContainer", ref: this.setupDragula }, this.state.formFields.map((form, idx) => {
                                    return (React.createElement("div", { className: "card dragula", key: idx, id: idx.toString() },
                                        React.createElement("span", { className: "handle ion ion-ios-move d-inline-block bg-primary text-white p-2" }),
                                        React.createElement("div", { className: "card-body" },
                                            React.createElement(Field, { key: idx, idx: idx, form: this.state.formFields[idx], onDelete: this.onDeleteFieldClick, setEdit: this.onSetEditState, field: `${Object.keys(form)[0]}` }))));
                                }))) : "",
                        React.createElement(ButtonFormBuilder, { label: "Add a Form Field", className: "btn btn-secondary mx-1", onClick: () => this.setState(Object.assign({}, this.state, { addFieldForm: { [this.state.currentField]: Object.assign({}, this.state.addFieldForm[this.state.currentField], { displayForm: true }) } }), () => {
                                window.scrollTo(0, document.getElementById("fieldForm").offsetTop);
                            }), field: "" }),
                        React.createElement("button", { type: "button", className: "btn btn-primary mx-1", onClick: this.onPublishFormClick, disabled: this.state.addFieldForm[this.state.currentField] && this.state.addFieldForm[this.state.currentField].displayForm && this.state.formFields.length > 0 }, "Publish Form")),
                    this.state.addFieldForm[this.state.currentField] && this.state.addFieldForm[this.state.currentField].displayForm ?
                        React.createElement(FormBuilderForm, { options: this.state.options, onFieldTypeChange: this.onFieldTypeChange, onEditFieldClick: this.onEditFieldClick, onSaveFieldClick: this.onSaveFieldClick, editingField: this.state.editingField, field: this.state.currentField, addFieldForm: this.state.addFieldForm, onChange: this.onChange, inputTypeOptions: this.state.inputTypeOptions, dataColumnOptions: this.state.dataColumnOptions, onColDropDownChange: this.onColDropDownChange, onAddOptionsClick: this.onAddOptionsClick, onConditionalQuestionClick: this.onConditionalQuestionClick, onInputTypeChange: this.onInputTypeChange, onOptionsChange: this.onOptionsChange, removeOption: this.removeOption, onCancel: this.onCancelAddEditClick, onCancelConditional: this.onCancelConditional, onSaveConditional: this.onSaveConditional, onEditConditional: this.onEditConditional })
                        : ""))));
    }
}
//# sourceMappingURL=formBuilderPage.js.map