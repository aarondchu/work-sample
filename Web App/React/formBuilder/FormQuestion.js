import * as React from "react";
import { DropDownListFormBuilder } from "./DropDownListFormBuilder";
import { Input } from "../common/form";
export const FormQuestion = (props) => {
    console.log("Form Question", props);
    const buildQuestion = (fieldName, idx) => {
        let field = props.field[fieldName];
        console.log("Field", field, "Name", fieldName);
        switch (field.inputType) {
            case "input":
                //type, name, className, placeholder, value, onchange, label, error
                return (React.createElement(React.Fragment, { key: idx },
                    React.createElement(Input, { label: field.form.label, name: fieldName, type: field.form.type, placeholder: "Enter Answer Here", value: props.form[fieldName], onChange: props.onChange })));
            case "dropdown":
                let optionSelected = props.form[fieldName] || null;
                return (React.createElement(React.Fragment, { key: idx },
                    React.createElement(DropDownListFormBuilder, { name: fieldName, label: field.form.label, selectedValue: props.form[fieldName], options: field.form.options, onChange: props.onChange, field: fieldName }),
                    props.form[fieldName] && field.form.options[Number(props.form[fieldName])].followup ?
                        field.form.options[props.form[fieldName]].followup.map((follow, index) => buildQuestion(follow, index)) : ""));
            case "radio":
                return (React.createElement(React.Fragment, { key: idx },
                    React.createElement("div", { className: "custom-controls-stacked" },
                        React.createElement("label", { htmlFor: "" }, field.form.label),
                        field.form.options.map((option, idx) => React.createElement(React.Fragment, { key: idx },
                            React.createElement("label", { className: "custom-control custom-radio" },
                                React.createElement("input", { name: fieldName, type: "radio", className: "custom-control-input", checked: props.form[fieldName].length > 0 && props.form[fieldName] == option.value, onChange: (e) => props.onChange(fieldName, `${option.value}`) }),
                                React.createElement("span", { className: "custom-control-label" }, option.text))))),
                    props.form[fieldName] && field.form.options[Number(props.form[fieldName])].followup ?
                        field.form.options[props.form[fieldName]].followup.map((follow, index) => buildQuestion(follow, index)) : ""));
            case "checkbox":
                return (React.createElement(React.Fragment, { key: idx },
                    React.createElement("div", { className: "custom-controls-stacked" },
                        React.createElement("label", { htmlFor: "" }, field.form.label),
                        field.form.options.map((option, idx) => React.createElement(React.Fragment, { key: idx },
                            React.createElement("label", { className: "custom-control custom-checkbox" },
                                React.createElement("input", { name: idx, type: "checkbox", className: "custom-control-input", checked: props.form[fieldName].includes(option.value), onChange: (e) => props.onCheckboxChange(fieldName, option.value) }),
                                React.createElement("span", { className: "custom-control-label" }, option.text)))))));
            default:
                return "";
        }
    };
    return (React.createElement(React.Fragment, null, buildQuestion(Object.keys(props.field)[0], 0)));
};
//# sourceMappingURL=FormQuestion.js.map