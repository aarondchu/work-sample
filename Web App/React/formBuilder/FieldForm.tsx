import * as React from "react";
import { DropDownListFormBuilder, IFormBuilderOptions } from "./DropDownListFormBuilder";
import { DropDownList } from "../common/form/dropdownlist"
import { InputFormBuilder } from "./InputFormBuilder";
import { ITextValue } from "../common/form/ITextValue";
import { FormBuilderForm } from "./FormBuilderForm";
import { IEditingField } from "./formBuilderPage";
import { ButtonFormBuilder } from "./ButtonFormBuilder";
import { Field } from "./Field";

interface IFieldFormProps {
	addFieldForm: any
	field: string,
	onChange: (fieldName: string, fieldValue: string, field: string) => void,
	onColDropDownChange: (field: string, fieldValue: string) => void,
	inputTypeOptions: ITextValue[],
	dataColumnOptions: ITextValue[],
	onInputTypeChange: (field: string, fieldValue: string) => void,
	options: ITextValue[],
	editingField: IEditingField,
	onOptionsChange: (index: number, value: string, field: string) => void,
	onFieldTypeChange: (field: string, fieldValue: string) => void,
	onEditFieldClick: (fidx: number, field: string) => void,
	onSaveFieldClick: (field: string) => void,
	onConditionalQuestionClick: (idx: number, field: string) => void,
	removeOption: (idx: number, field: string) => void,
	onAddOptionsClick: (field: string) => void,
	onCancel: (idx: number, field: string) => void,
	onCancelConditional: (idx: number, field: string) => void,
	onEditConditional: (idx: number, field: string) => void,
	onSaveConditional: (field: string) => void
}

export const FieldForm = (props: IFieldFormProps) => {
	const buildFollowUp = (followups: string[], optIndex: number) => {
		return (
			<React.Fragment>
				{followups.map((followup, idx) => {
					if (props.addFieldForm[followup].displayForm)
						return (
							<FormBuilderForm
								key={idx}
								options={props.options}
								onFieldTypeChange={props.onFieldTypeChange}
								onEditFieldClick={props.onEditConditional}
								onSaveFieldClick={props.onSaveConditional}
								editingField={props.editingField}
								field={followup}
								addFieldForm={props.addFieldForm}
								onChange={props.onChange}
								inputTypeOptions={props.inputTypeOptions}
								dataColumnOptions={props.inputTypeOptions}
								onColDropDownChange={props.onColDropDownChange}
								onAddOptionsClick={props.onAddOptionsClick}
								onConditionalQuestionClick={props.onConditionalQuestionClick}
								onInputTypeChange={props.onInputTypeChange}
								onOptionsChange={props.onOptionsChange}
								removeOption={props.removeOption}
								onCancel={props.onCancelConditional}
								onCancelConditional={props.onCancelConditional}
								onSaveConditional={props.onSaveConditional}
								onEditConditional={props.onEditConditional}
								optIndex={optIndex}
							/>
						)
					else return (
						<div className="card bg-secondary" key={idx}>
							<div className="card-body">
								<div className="card">
									<div className="card-body">
										<Field
											form={props.addFieldForm}
											field={followup}
											onDelete={props.onCancelConditional}
											idx={optIndex}
											setEdit={props.onEditConditional}
										/>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</React.Fragment>
		)
	}
	const buildFieldForm = () => {
		switch (props.addFieldForm[props.field].inputType) {
			case "input":
				//type, name, className, placeholder, value, onchange, label, error
				return (
					<React.Fragment>
						<InputFormBuilder
							type="text"
							name="label"
							label="Question"
							placeholder="Enter Field Question Here"
							value={props.addFieldForm[props.field].form.label}
							onChange={props.onChange}
							field={props.field}
						/>
						<DropDownListFormBuilder
							name={props.field}
							label="Input Type"
							selectedValue={props.addFieldForm[props.field].form.type}
							options={props.inputTypeOptions}
							onChange={props.onInputTypeChange}
							field={props.field}
						/>
						<DropDownListFormBuilder
							name={props.field}
							label="Target Database Column"
							options={props.dataColumnOptions}
							selectedValue={props.addFieldForm[props.field].form.dbColumn}
							onChange={props.onColDropDownChange}
							field={props.field}
						/>

					</React.Fragment>
				)
			case "dropdown":
				//name, label, selectedValue, options, onChange, error
				return (
					<React.Fragment>
						<InputFormBuilder
							type="text"
							name="label"
							label="Question"
							placeholder="Enter Field Question Here"
							value={props.addFieldForm[props.field].form.label}
							onChange={props.onChange}
							field={props.field}
						/>
						{props.addFieldForm[props.field].form.options.map((option, idx) =>
							<div className="card bg-light" key={idx} >
								<div className="card-body">
									<div className="form-group">
										<label htmlFor="">Dropdown Option Text</label>
										<div className="field">
											<input type="text" required
												name={option.value}
												className="form-control"
												placeholder="Enter Dropdown Option Text Here"
												value={option.text}
												onChange={(e) => props.onOptionsChange(idx, e.target.value, props.field)}
											/>
										</div>
										{option.followup.length > 0 ?
											buildFollowUp(option.followup, idx) : ""}
										<button
											type="button"
											className="btn btn-primary mx-1"
											onClick={() => props.onConditionalQuestionClick(idx, props.field)}
										>Add A Followup Question To This Option</button>
										<ButtonFormBuilder
											label="Delete Option"
											className="btn btn-danger mx-1"
											onClick={() => props.removeOption(idx, props.field)}
											field={props.field}
										/>
									</div>
								</div>
							</div>
						)}
						<ButtonFormBuilder
							label="Add Dropdown Option"
							className="btn btn-secondary mx-1"
							onClick={() => props.onAddOptionsClick(props.field)}
							field={props.field}
						/>
					</React.Fragment>
				);
			case "radio":
				return (
					<React.Fragment>
						<InputFormBuilder
							type="text"
							name="label"
							label="Question"
							placeholder="Enter Field Question Here"
							value={props.addFieldForm[props.field].form.label}
							onChange={props.onChange}
							field={props.field}
						/>
						{props.addFieldForm[props.field].form.options.map((option, idx) =>
							<div className="card bg-light" key={idx} >
								<div className="card-body">
									<div className="form-group">
										<label htmlFor="">Radio Button Text</label>
										<div className="field">
											<input type="text" required
												name={option.value}
												className="form-control"
												placeholder="Enter Radio Button Text Here"
												value={option.text}
												onChange={(e) => props.onOptionsChange(idx, e.target.value, props.field)}
											/>
										</div>
										{option.followup.length > 0 ?
											buildFollowUp(option.followup, idx) : ""}
										<button
											type="button"
											className="btn btn-primary mx-1"
											onClick={() => props.onConditionalQuestionClick(idx, props.field)}
										>Add A Followup Question To This Option</button>
										<ButtonFormBuilder
											label="Delete Option"
											className="btn btn-danger mx-1"
											onClick={() => props.removeOption(idx, props.field)}
											field={props.field}
										/>
									</div>
								</div>
							</div>
						)}
						<ButtonFormBuilder
							label="Add Radio Button Option"
							className="btn btn-secondary mx-1"
							onClick={() => props.onAddOptionsClick(props.field)}
							field={props.field}
						/>
					</React.Fragment>
				);
			case "checkbox":
				return (
					<React.Fragment>
						<InputFormBuilder
							type="text"
							name="label"
							label="Question"
							placeholder="Enter Field Question Here"
							value={props.addFieldForm[props.field].form.label}
							onChange={props.onChange}
							field={props.field}
						/>
						{props.addFieldForm[props.field].form.options.map((option, idx) =>
							<div key={idx} className="form-group">
								<label htmlFor="">Checkbox Text</label>
								<div className="field">
									<input type="text" required
										name={option.value}
										className="form-control"
										placeholder="Enter Checkbox Text Here"
										value={option.text}
										onChange={(e) => props.onOptionsChange(idx, e.target.value, props.field)}
									/>
								</div>
								<ButtonFormBuilder
									label="Delete Option"
									className="btn btn-danger mx-1"
									onClick={() => props.removeOption(idx, props.field)}
									field={props.field}
								/>
							</div>
						)}
						<ButtonFormBuilder
							label="Add Checkbox Option"
							className="btn btn-secondary mx-1"
							onClick={() => props.onAddOptionsClick(props.field)}
							field={props.field}
						/>
					</React.Fragment>
				);
			default:
				return "";
		}
	}
	return (
		<React.Fragment>
			{buildFieldForm()}
		</React.Fragment>
	)
}