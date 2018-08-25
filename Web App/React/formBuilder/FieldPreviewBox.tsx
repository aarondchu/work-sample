import * as React from "react";
import { IField } from "./formBuilderPage";
import { DropDownListFormBuilder } from "./DropDownListFormBuilder";
import { Field } from "./Field";

interface IFieldPreviewBoxProps {
	addFieldForm: any,
	field: string
}
export const FieldPreviewBox = (props: IFieldPreviewBoxProps) => {
	const buildPreview = () => {
		switch (props.addFieldForm[props.field].inputType) {
			case "input":
				//type, name, className, placeholder, value, onchange, label, error
				return (
					<React.Fragment>
						<div className="form-group">
							<label htmlFor="">{props.addFieldForm[props.field].form.label}</label>
							<div className="field">
								<input type={props.addFieldForm[props.field].form.type} required readOnly
									name=""
									className="form-control"
									placeholder="Example Input Field"
									value=""
									onChange={() => ""}
								/>
							</div>
						</div>
					</React.Fragment>
				)
			case "dropdown":
				return (
					<DropDownListFormBuilder
						name=""
						label={props.addFieldForm[props.field].form.label}
						selectedValue=""
						options={props.addFieldForm[props.field].form.options}
						onChange={() => ""}
						field=""
					/>
				);
			case "radio":
				return (
					<div className="custom-controls-stacked">
						<label htmlFor="">{props.addFieldForm[props.field].form.label}</label>
						{props.addFieldForm[props.field].form.options.map((option, idx) =>
							<React.Fragment key={idx} >
								<label className="custom-control custom-radio">
									<input name={props.field} type="radio" className="custom-control-input" />
									<span className="custom-control-label">{option.text}</span>
								</label>
								{option.followup ? option.followup.map((field, fieldIdx) => {
									//if (props.addFieldForm[field])
									return (
										<div className="card bg-light" key={fieldIdx}>
											<div className="card-body">
												<FieldPreviewBox
													addFieldForm={props.addFieldForm}
													field={field}
												/>
											</div>
										</div>
									)
									//else return ""
								}
								) : ""}

							</React.Fragment>
						)}
					</div>
				);
			case "checkbox":
				return (
					<div className="custom-controls-stacked">
						<label htmlFor="">{props.addFieldForm[props.field].form.label}</label>
						{props.addFieldForm[props.field].form.options.map((option, idx) =>
							<label key={idx} className="custom-control custom-checkbox">
								<input type="checkbox" className="custom-control-input" />
								<span className="custom-control-label">{option.text}</span>
							</label>
						)}
					</div>
				);
			default:
				return "";
		}
	}
	return (
		<React.Fragment>
			{buildPreview()}
		</React.Fragment >
	)
}