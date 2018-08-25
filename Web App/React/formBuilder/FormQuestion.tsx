import * as React from "react";
import { IField } from "./formBuilderPage";
import { DropDownListFormBuilder } from "./DropDownListFormBuilder";
import { Field } from "./Field";
import { Input } from "../common/form";

interface IFormQuestionProps {
	form: any,
	field: any,
	onChange: (fieldName: string, fieldValue: string) => void,
	onCheckboxChange: (fieldName: string, fieldValue: string) => void,
}
export const FormQuestion = (props: IFormQuestionProps) => {
	console.log("Form Question", props);
	const buildQuestion = (fieldName: string, idx: number) => {
		let field = props.field[fieldName];
		console.log("Field", field, "Name", fieldName);
		switch (field.inputType) {
			case "input":
				//type, name, className, placeholder, value, onchange, label, error
				return (
					<React.Fragment key={idx}>
						<Input
							label={field.form.label}
							name={fieldName}
							type={field.form.type}
							placeholder="Enter Answer Here"
							value={props.form[fieldName]}
							onChange={props.onChange}
						/>
					</React.Fragment>
				)
			case "dropdown":
				let optionSelected = props.form[fieldName] || null;

				return (
					<React.Fragment key={idx}>
						<DropDownListFormBuilder
							name={fieldName}
							label={field.form.label}
							selectedValue={props.form[fieldName]}
							options={field.form.options}
							onChange={props.onChange}
							field={fieldName}
						/>
						{props.form[fieldName] && field.form.options[Number(props.form[fieldName])].followup ?
							field.form.options[props.form[fieldName]].followup.map((follow, index) =>
								buildQuestion(follow, index)
							) : ""}
					</React.Fragment>
				);
			case "radio":
				return (
					<React.Fragment key={idx}>
						<div className="custom-controls-stacked">
							<label htmlFor="">{field.form.label}</label>
							{field.form.options.map((option, idx) =>
								<React.Fragment key={idx} >
									<label className="custom-control custom-radio">
										<input
											name={fieldName}
											type="radio"
											className="custom-control-input"
											checked={props.form[fieldName].length > 0 && props.form[fieldName] == option.value}
											onChange={(e) => props.onChange(fieldName, `${option.value}`)}
										/>
										<span className="custom-control-label">{option.text}</span>
									</label>
								</React.Fragment>
							)}

						</div>
						{props.form[fieldName] && field.form.options[Number(props.form[fieldName])].followup ?
							field.form.options[props.form[fieldName]].followup.map((follow, index) =>
								buildQuestion(follow, index)
							) : ""}
					</React.Fragment>
				);
			case "checkbox":
				return (
					<React.Fragment key={idx}>
						<div className="custom-controls-stacked">
							<label htmlFor="">{field.form.label}</label>
							{field.form.options.map((option, idx) =>
								<React.Fragment key={idx} >
									<label className="custom-control custom-checkbox">
										<input
											name={idx}
											type="checkbox"
											className="custom-control-input"
											checked={props.form[fieldName].includes(option.value)}
											onChange={(e) => props.onCheckboxChange(fieldName, option.value)}
										/>
										<span className="custom-control-label">{option.text}</span>
									</label>
								</React.Fragment>
							)}
						</div>
					</React.Fragment>
				);
			default:
				return "";
		}
	}
	return (
		<React.Fragment>
			{buildQuestion(Object.keys(props.field)[0], 0)}
		</React.Fragment >
	)
}