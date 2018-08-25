import * as React from "react";


export interface IButtonProps {
	label: string;
	className: string;
	onClick: (field: string) => void;
	disabled?: boolean;
	field: string
};

export const ButtonFormBuilder: React.StatelessComponent<IButtonProps> = (props) => {
	return (
		<button type="button"
			className={props.className}
			onClick={() => props.onClick(props.field)}
			disabled={props.disabled}
		>
			{props.label}
		</button>
	);
};