import * as React from "react";
import { DropDownList, Input, Button } from "../common/form";
import { ITextValue } from "../common/form/ITextValue";
import { DropDownListFormBuilder, IFormBuilderOptions } from "./DropDownListFormBuilder";
import { FieldPreviewBox } from "./FieldPreviewBox";
import { FormBuilderForm } from "./FormBuilderForm";
import { InputFormBuilder } from "./InputFormBuilder";
import { ButtonFormBuilder } from "./ButtonFormBuilder";
import { Field } from "./Field";
import { FormBuilderApi } from "./formBuilderApi";
import { RouteComponentProps } from "react-router";
import * as dragula from 'react-dragula';

interface IFormBuilderPageState {
    options: ITextValue[],
    inputTypeOptions: ITextValue[],
    dataColumnOptions: ITextValue[],
    addFieldForm: any,
    formTitle: string,
    formFields: any[],
    editingField: IEditingField,
    currentField: string,
    scholarshipId: number,
    formId: number

}
export interface IEditingField {
    inEditMode: boolean,
    editIndex: number,
}
export interface IField {
    inputType: string,
    form: any
}
export default class FormBuilderPage extends React.Component<RouteComponentProps<any>, IFormBuilderPageState>{
    constructor(props) {
        super(props);
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
        }
    }



    onFieldTypeChange = (field: string, fieldValue: string) => {
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

        this.setState({ ...this.state, addFieldForm: { ...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], inputType: fieldValue, form: form } } });
    }

    onColDropDownChange = (field: string, fieldValue: string) => {
        this.setState({ ...this.state, addFieldForm: { ...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], form: { ...this.state.addFieldForm[field].form, dbColumn: fieldValue } } } });
    }

    onInputTypeChange = (field: string, fieldValue: string) => {
        this.setState({ ...this.state, addFieldForm: { ...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], form: { ...this.state.addFieldForm[field].form, type: fieldValue } } } });
    }

	onChange = (fieldName: string, fieldValue: string, field: string) => {
		this.setState({ ...this.state, addFieldForm: { ...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], form: { ...this.state.addFieldForm[field].form, [fieldName]: fieldValue } } } });
	}
	onTitleChange = (fieldName: string, fieldValue: string) => {
		this.setState({ ...this.state, formTitle: fieldValue });
	}
	onOptionsChange = (index: number, value: string, field: string) => {
		let newOptions = this.state.addFieldForm[field].form.options.map((opt, idx) => {
			if (idx == index) {
				let newOption = JSON.parse(JSON.stringify(opt));
				newOption = { ...opt, text: value, value: index };
				return newOption;
			}
			else return opt
		});
		this.setState({ ...this.state, addFieldForm: { ...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], form: { ...this.state.addFieldForm[field].form, options: newOptions } } } });
	}
	onAddOptionsClick = (field: string) => {
		let newOptions = [...this.state.addFieldForm[field].form.options];
		newOptions.push({ text: "", value: "", followup: [] });
		this.setState({ ...this.state, addFieldForm: { ...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], form: { ...this.state.addFieldForm[field].form, options: newOptions } } } })
	}
	onConditionalQuestionClick = (idx: number, field: string) => {
		let followup = `${field}_${idx}_${this.state.addFieldForm[field].form.options[idx].followup.length}`;
		let newOptions = this.state.addFieldForm[field].form.options.map((opt, index) => {
			if (index == idx) {
				let newOption = JSON.parse(JSON.stringify(opt));
				newOption.followup.push(followup);
				return newOption;
			}
			else return opt;
		});
		this.setState({
			...this.state, addFieldForm: {
				...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], form: { ...this.state.addFieldForm[field].form, options: newOptions } }, [followup]: {
					inputType: "input",
					form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
					displayForm: true,
					parentQuestion: field
				}
			}
		});
	}
	removeOption = (idx: number, field: string) => {
		let newFieldForm = JSON.parse(JSON.stringify(this.state.addFieldForm));
		let newOptions = [...newFieldForm[field].form.options]
		if (newOptions[idx].followup) {
			newOptions[idx].followup.map(item => delete newFieldForm[item])
		}
		newOptions.splice(idx, 1);
		newFieldForm[field].form.options = newOptions;
		this.setState({ ...this.state, addFieldForm: newFieldForm });
	}
	onPublishFormClick = () => {
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
				else throw new Error("Unable to publish form")
			})
			.catch(err => console.log("Error: ", err.message));
	}
	onDeleteFieldClick = (idx: number, field: string) => {
		let newFields = this.state.formFields.filter((currField, index) => index != idx);
		this.setState({
			...this.state, formFields: newFields,
		}, () => console.log("Deleted Field", this.state));
	}
	onCancelConditional = (idx: number, field: string) => {
		let parent = this.state.addFieldForm[field].parentQuestion;
		let newOptions = this.state.addFieldForm[parent].form.options.map((opt, index) => {
			if (index == idx) {
				let newOption = JSON.parse(JSON.stringify(opt));
				newOption.followup = newOption.followup.filter(currField => currField != field);
				return newOption;
			}
			else return opt;
		});
		let newFieldForm = JSON.parse(JSON.stringify(this.state.addFieldForm));
		delete newFieldForm[field];
		newFieldForm[parent].form.options = newOptions;
		this.setState({ ...this.state, addFieldForm: newFieldForm });
	}
	onCancelAddEditClick = (idx: number, field: string) => {
		this.setState({
			...this.state, editingField: { editIndex: 0, inEditMode: false }, addFieldForm: {
				...this.state.addFieldForm,
				[this.getNextFieldName(this.state.formFields)]: {
					inputType: "input",
					form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
					displayForm: false
				}
			},
			currentField: `${this.getNextFieldName(this.state.formFields)}`
		});
	}
	onEditFieldClick = (idx: number, field: string) => {
		let newFields = this.state.formFields.map((field, index) => {
			if (index == this.state.editingField.editIndex) {
				return JSON.parse(JSON.stringify(this.state.addFieldForm));
			}
			else return field;
		});
		this.setState({
			...this.state, addFieldForm: {
				[this.getNextFieldName(newFields)]: {
					inputType: "input",
					form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
					displayForm: false
				}
			},
			editingField: {
				inEditMode: false,
				editIndex: 0
			},
			formFields: newFields,
			currentField: `${this.getNextFieldName(newFields)}`
		}, () => {
			this.saveToLocalStorage();
		})
	}
	getNextFieldName = (field: any) => {
		if (field.length <= 0)
			return 0;
		let highestField = 0;
		field.map((field, index) => {
			if (Number(Object.keys(field)[0]) > highestField)
				highestField = Number(Object.keys(field)[0]);
		});
		return highestField + 1;
	}
	setUpForm = (info: any) => {
		let newForm = JSON.parse(info.form);
		let newFields = newForm ? newForm.fields : "";
		let newTitle = newForm ? newForm.title : "";
		this.setState({
			...this.state,
			formFields: newFields,
			formTitle: newTitle,
			formId: info.id,
			addFieldForm: {
				[this.getNextFieldName(newFields)]: {
					inputType: "input",
					form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
					displayForm: false,
					parentQuestion: null
				}
			},
			currentField: `${this.getNextFieldName(newFields)}`
		});
	}
	setupDragula = (element) => {
		dragula([element], {
			moves: (el, source, handle, sibling) => {
				return handle.classList.contains("handle");
			}
		})
	}
	changePosition = (oldIndex: number, newIndex: number, fields: any) => {
		let field = JSON.parse(JSON.stringify(fields[oldIndex]));
		let newFields = fields.filter((currField, index) => index != oldIndex);
		newFields.splice(newIndex, 0, field);
		return newFields;
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
			.catch(err => console.log("Error:", err.message))
	}
	onSaveConditional = (field: string) => {
		this.setState({ ...this.state, addFieldForm: { ...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], displayForm: false } } });
	}
	onEditConditional = (idx: number, field: string) => {
		this.setState({ ...this.state, addFieldForm: { ...this.state.addFieldForm, [field]: { ...this.state.addFieldForm[field], displayForm: false } } });
	}
	onSaveFieldClick = (field: string) => {
		let newFields = [...this.state.formFields];
		newFields.push({ ...this.state.addFieldForm });
		this.setState({
			...this.state, addFieldForm: {
				[this.getNextFieldName(newFields)]: {
					inputType: "input",
					form: { type: "text", name: "", className: "", placeholder: "", value: "", label: "", error: "" },
					displayForm: false
				}
			}, editingField: {
				inEditMode: false,
				editIndex: 0
			},
			formFields: newFields,
			currentField: `${this.getNextFieldName(newFields)}`
		}, () => {

			this.saveToLocalStorage();
		})
	}
	onSetEditState = (idx: number, field: string) => {
		let newFormField = JSON.parse(JSON.stringify(this.state.formFields[idx]));
		newFormField[field].displayForm = true;
		this.setState({ ...this.state, editingField: { ...this.state.editingField, editIndex: idx, inEditMode: true }, addFieldForm: newFormField, currentField: `${Object.keys(newFormField)[0]}` }, () => {
			window.scrollTo(0, document.getElementById("fieldForm").offsetTop)
		})
	}
	saveToLocalStorage = () => {
		localStorage.setItem(`formTemp${this.state.scholarshipId}`, JSON.stringify({ title: this.state.formTitle, fields: this.state.formFields }));
	}



    render() {

		return (
			<React.Fragment>
				<h3>{this.state.formTitle}</h3>
				<div className="card">
					<div className="card-body">
						<form>
							<InputFormBuilder
								type="text"
								name="formTitle"
								label="Form TItle:"
								placeholder="Enter Form Title Here"
								value={this.state.formTitle}
								onChange={this.onTitleChange}
								field=""
							/>
							{this.state.formFields.length > 0 ?
								<div className="card bg-secondary" style={{ marginBottom: "15px" }}>
									<div className="card-body" id="dragulaContainer" ref={this.setupDragula}>
										{this.state.formFields.map((form, idx) => {
											return (
												<div className="card dragula" key={idx} id={idx.toString()}>
													<span className="handle ion ion-ios-move d-inline-block bg-primary text-white p-2"></span>
													<div className="card-body">
														<Field
															key={idx}
															idx={idx}
															form={this.state.formFields[idx]}
															onDelete={this.onDeleteFieldClick}
															setEdit={this.onSetEditState}
															field={`${Object.keys(form)[0]}`}
														/>
													</div>
												</div>
											)
										})}
									</div>
								</div> : ""}
							<ButtonFormBuilder
								label="Add a Form Field"
								className="btn btn-secondary mx-1"
								onClick={() => this.setState({ ...this.state, addFieldForm: { [this.state.currentField]: { ...this.state.addFieldForm[this.state.currentField], displayForm: true } } }, () => {
									window.scrollTo(0, document.getElementById("fieldForm").offsetTop)
								})}
								field=""
							/>
							<button
								type="button"
								className="btn btn-primary mx-1"
								onClick={this.onPublishFormClick}
								disabled={this.state.addFieldForm[this.state.currentField] && this.state.addFieldForm[this.state.currentField].displayForm && this.state.formFields.length > 0}>
								Publish Form
					</button>
                        </form>
                        {this.state.addFieldForm[this.state.currentField] && this.state.addFieldForm[this.state.currentField].displayForm ?
                            <FormBuilderForm
                                options={this.state.options}
                                onFieldTypeChange={this.onFieldTypeChange}
                                onEditFieldClick={this.onEditFieldClick}
                                onSaveFieldClick={this.onSaveFieldClick}
                                editingField={this.state.editingField}
                                field={this.state.currentField}
                                addFieldForm={this.state.addFieldForm}
                                onChange={this.onChange}
                                inputTypeOptions={this.state.inputTypeOptions}
                                dataColumnOptions={this.state.dataColumnOptions}
                                onColDropDownChange={this.onColDropDownChange}
                                onAddOptionsClick={this.onAddOptionsClick}
                                onConditionalQuestionClick={this.onConditionalQuestionClick}
                                onInputTypeChange={this.onInputTypeChange}
                                onOptionsChange={this.onOptionsChange}
                                removeOption={this.removeOption}
                                onCancel={this.onCancelAddEditClick}
                                onCancelConditional={this.onCancelConditional}
                                onSaveConditional={this.onSaveConditional}
                                onEditConditional={this.onEditConditional}
                            />
                            : ""}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}