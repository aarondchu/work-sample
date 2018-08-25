import * as React from "react";
import { DropDownList, Button } from "../common/form";
import { IField, IEditingField } from "./formBuilderPage";
import { ITextValue } from "../common/form/ITextValue";
import { FieldPreviewBox } from "./FieldPreviewBox";
import { DropDownListFormBuilder, IFormBuilderOptions } from "./DropDownListFormBuilder";
import { ButtonFormBuilder } from "./ButtonFormBuilder";
import { FieldForm } from "./FieldForm";

interface IFormBuilderFormProps {
	options: ITextValue[],
	onFieldTypeChange: (field: string, fieldValue: string) => void,
	editingField: IEditingField,
	addFieldForm: any
	field: string,
	onChange: (fieldName: string, fieldValue: string, field: string) => void,
	onColDropDownChange: (field: string, fieldValue: string) => void,
	inputTypeOptions: ITextValue[],
	dataColumnOptions: ITextValue[],
	onInputTypeChange: (field: string, fieldValue: string) => void,
	onOptionsChange: (index: number, value: string, field: string) => void,
	onEditFieldClick: (idx: number, field: string) => void,
	onSaveFieldClick: (field: string) => void,
	onConditionalQuestionClick: (idx: number, field: string) => void,
	removeOption: (idx: number, field: string) => void,
	onAddOptionsClick: (field: string) => void,
	onCancel: (idx: number, field: string) => void
	onCancelConditional: (idx: number, field: string) => void,
	onSaveConditional: (field: string) => void,
	onEditConditional: (fidx: number, field: string) => void,
	optIndex?: number
}

export const FormBuilderForm = (props: IFormBuilderFormProps) => {
	const validateForm = () => {
		if (props.addFieldForm[props.field].form.label.length == 0) {
			return true;
		} else if (props.addFieldForm[props.field].form.options != undefined) {
			if (props.addFieldForm[props.field].form.options.length == 0 || props.addFieldForm[props.field].form.options.some(opt => opt.text.length == 0)) {
				return true;
			}
			else return false;
		}
		else return false;
	}
	return (
		<div className="card bg-light" id="fieldForm">
			<div className="card-body">
				<div className="form">
					<DropDownListFormBuilder
						name={props.field}
						label="Choose your field type"
						selectedValue={props.addFieldForm[props.field].inputType}
						options={props.options}
						onChange={props.onFieldTypeChange}
						field={props.field}
					/>
					<FieldForm
						options={props.options}
						onFieldTypeChange={props.onFieldTypeChange}
						onEditFieldClick={props.onEditFieldClick}
						onSaveFieldClick={props.onSaveFieldClick}
						editingField={props.editingField}
						field={props.field}
						addFieldForm={props.addFieldForm}
						onChange={props.onChange}
						dataColumnOptions={props.dataColumnOptions}
						onColDropDownChange={props.onColDropDownChange}
						inputTypeOptions={props.inputTypeOptions}
						onAddOptionsClick={props.onAddOptionsClick}
						onConditionalQuestionClick={props.onConditionalQuestionClick}
						onInputTypeChange={props.onInputTypeChange}
						onOptionsChange={props.onOptionsChange}
						removeOption={props.removeOption}
						onCancel={props.onCancel}
						onCancelConditional={props.onCancelConditional}
						onSaveConditional={props.onSaveConditional}
						onEditConditional={props.onEditConditional}
					/>
					{props.editingField.inEditMode ?
						<ButtonFormBuilder
							label="Save Edit"
							className="btn btn-primary mx-1"
							onClick={() => props.onEditFieldClick(0, props.field)}
							field={props.field}
							disabled={validateForm()}
						/> :
						<ButtonFormBuilder
							label="Save Field"
							className="btn btn-primary mx-1"
							onClick={() => props.onSaveFieldClick(props.field)}
							field={props.field}
							disabled={validateForm()}
						/>
					}
					<button
						type="button"
						className="btn btn-danger mx-1"
						onClick={() => {
							console.log("Cancel Button", props.field);
							props.onCancel(props.optIndex != null ? props.optIndex : 0, props.field);
						}}
					>Cancel
					</button>

				</div>
				<div className="card bg-secondary text-white" style={{ marginTop: "15px" }}>
					<div className="card-body">
						<h3>Preview</h3>
						<div className="card text-dark" >
							<div className="card-body">
								<FieldPreviewBox
									addFieldForm={props.addFieldForm}
									field={props.field}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}