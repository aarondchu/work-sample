import * as React from "react";
import { FieldPreviewBox } from "./FieldPreviewBox";
import { IField } from "./formBuilderPage";

interface IFieldProps {
	idx: number,
	field: string,
	onDelete: (idx: number, field: string) => void,
	setEdit: (idx: number, field: string) => void,
	form: any
}

export const Field = (props: IFieldProps) => {
	return (
		<div>
			<FieldPreviewBox
				addFieldForm={props.form}
				field={props.field}
			/>

			<button
				type="button"
				className="btn btn-secondary mx-1"
				onClick={() => props.setEdit(props.idx, props.field)}>Edit
						</button>
			<button
				type="button"
				className="btn btn-danger mx-1"
				onClick={() => props.onDelete(props.idx, props.field)}>Delete
						</button>
		</div>
	)
}