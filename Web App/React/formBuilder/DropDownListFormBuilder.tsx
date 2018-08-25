import * as React from "react";
import { ITextValue } from "../common/form/ITextValue";

export interface IFormBuilderOptions {
	text: string,
	value: string,
	followup: any
}

interface IDropDownListFormBuilderProps {
	name: string;
	label: string;
	selectedValue: any;
	options: ITextValue[];
	onChange: (key: string, value: string) => void;
	error?: string;
	field: string;
};


const formatWrapperClass = (props: IDropDownListFormBuilderProps) => {
	const wrapperClass = 'form-group';
	return props.error ? `${wrapperClass} has-error` : wrapperClass;
}

const onChangeInput = (props: IDropDownListFormBuilderProps) => (e: React.ChangeEvent<HTMLSelectElement>) => {
	props.onChange(e.target.id, e.target.value);
}

export const DropDownListFormBuilder: React.StatelessComponent<IDropDownListFormBuilderProps> = (props) => {

	var options = props.options.map((option) => {
		return (
			<option key={option.value} value={option.value}>{option.text}</option>
		);
	})

	return (
		<div className={formatWrapperClass(props)}>
			<label htmlFor={props.name}>{props.label}</label>
			<div className="field">
				<select value={props.selectedValue} onChange={onChangeInput(props)} id={props.name} className="form-control">{options}</select>
			</div>
		</div>
	);

}