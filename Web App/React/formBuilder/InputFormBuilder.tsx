import * as React from "react";

interface IInputFormBuilderProps {
	type: string;
	name: string;
	label: string;
	placeholder?: string;
	value: any;
	className?: string;
	onChange: (fieldName: string, value: string, field: string) => void;
	error?: string;
	field: string;
}

export const InputFormBuilder: React.StatelessComponent<IInputFormBuilderProps> = (props) => {
	const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		props.onChange(e.target.name, e.target.value, props.field);
	}
	return (
		<div className="form-group">
			<label htmlFor={props.name}>{props.label}</label>
			<div className="field">
				<input type={props.type} required
					name={props.name}
					className={
						props.error ?
							(props.className ?
								props.className + "form-control is-invalid" :
								"form-control is-invalid") :
							(props.className ?
								props.className + " form-control" :
								"form-control")
					}
					placeholder={props.placeholder}
					value={props.value}
					onChange={onChangeInput}
				/>
				<div className="invalid-feedback small">{props.error}</div>
			</div>

		</div>
	);

}

