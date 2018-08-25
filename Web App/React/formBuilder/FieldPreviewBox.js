import * as React from "react";
import { DropDownListFormBuilder } from "./DropDownListFormBuilder";
export const FieldPreviewBox = (props) => {
    const buildPreview = () => {
        switch (props.addFieldForm[props.field].inputType) {
            case "input":
                //type, name, className, placeholder, value, onchange, label, error
                return (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", { htmlFor: "" }, props.addFieldForm[props.field].form.label),
                        React.createElement("div", { className: "field" },
                            React.createElement("input", { type: props.addFieldForm[props.field].form.type, required: true, readOnly: true, name: "", className: "form-control", placeholder: "Example Input Field", value: "", onChange: () => "" })))));
            case "dropdown":
                return (React.createElement(DropDownListFormBuilder, { name: "", label: props.addFieldForm[props.field].form.label, selectedValue: "", options: props.addFieldForm[props.field].form.options, onChange: () => "", field: "" }));
            case "radio":
                return (React.createElement("div", { className: "custom-controls-stacked" },
                    React.createElement("label", { htmlFor: "" }, props.addFieldForm[props.field].form.label),
                    props.addFieldForm[props.field].form.options.map((option, idx) => React.createElement(React.Fragment, { key: idx },
                        React.createElement("label", { className: "custom-control custom-radio" },
                            React.createElement("input", { name: props.field, type: "radio", className: "custom-control-input" }),
                            React.createElement("span", { className: "custom-control-label" }, option.text)),
                        option.followup ? option.followup.map((field, fieldIdx) => {
                            //if (props.addFieldForm[field])
                            return (React.createElement("div", { className: "card bg-light", key: fieldIdx },
                                React.createElement("div", { className: "card-body" },
                                    React.createElement(FieldPreviewBox, { addFieldForm: props.addFieldForm, field: field }))));
                            //else return ""
                        }) : ""))));
            case "checkbox":
                return (React.createElement("div", { className: "custom-controls-stacked" },
                    React.createElement("label", { htmlFor: "" }, props.addFieldForm[props.field].form.label),
                    props.addFieldForm[props.field].form.options.map((option, idx) => React.createElement("label", { key: idx, className: "custom-control custom-checkbox" },
                        React.createElement("input", { type: "checkbox", className: "custom-control-input" }),
                        React.createElement("span", { className: "custom-control-label" }, option.text)))));
            default:
                return "";
        }
    };
    return (React.createElement(React.Fragment, null, buildPreview()));
};
//# sourceMappingURL=FieldPreviewBox.js.map