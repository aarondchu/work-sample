import * as React from "react";
import { DropDownListFormBuilder } from "./DropDownListFormBuilder";
import { InputFormBuilder } from "./InputFormBuilder";
import { FormBuilderForm } from "./FormBuilderForm";
import { ButtonFormBuilder } from "./ButtonFormBuilder";
import { Field } from "./Field";
export const FieldForm = (props) => {
    const buildFollowUp = (followups, optIndex) => {
        return (React.createElement(React.Fragment, null, followups.map((followup, idx) => {
            if (props.addFieldForm[followup].displayForm)
                return (React.createElement(FormBuilderForm, { key: idx, options: props.options, onFieldTypeChange: props.onFieldTypeChange, onEditFieldClick: props.onEditConditional, onSaveFieldClick: props.onSaveConditional, editingField: props.editingField, field: followup, addFieldForm: props.addFieldForm, onChange: props.onChange, inputTypeOptions: props.inputTypeOptions, dataColumnOptions: props.inputTypeOptions, onColDropDownChange: props.onColDropDownChange, onAddOptionsClick: props.onAddOptionsClick, onConditionalQuestionClick: props.onConditionalQuestionClick, onInputTypeChange: props.onInputTypeChange, onOptionsChange: props.onOptionsChange, removeOption: props.removeOption, onCancel: props.onCancelConditional, onCancelConditional: props.onCancelConditional, onSaveConditional: props.onSaveConditional, onEditConditional: props.onEditConditional, optIndex: optIndex }));
            else
                return (React.createElement("div", { className: "card bg-secondary", key: idx },
                    React.createElement("div", { className: "card-body" },
                        React.createElement("div", { className: "card" },
                            React.createElement("div", { className: "card-body" },
                                React.createElement(Field, { form: props.addFieldForm, field: followup, onDelete: props.onCancelConditional, idx: optIndex, setEdit: props.onEditConditional }))))));
        })));
    };
    const buildFieldForm = () => {
        switch (props.addFieldForm[props.field].inputType) {
            case "input":
                //type, name, className, placeholder, value, onchange, label, error
                return (React.createElement(React.Fragment, null,
                    React.createElement(InputFormBuilder, { type: "text", name: "label", label: "Question", placeholder: "Enter Field Question Here", value: props.addFieldForm[props.field].form.label, onChange: props.onChange, field: props.field }),
                    React.createElement(DropDownListFormBuilder, { name: props.field, label: "Input Type", selectedValue: props.addFieldForm[props.field].form.type, options: props.inputTypeOptions, onChange: props.onInputTypeChange, field: props.field }),
                    React.createElement(DropDownListFormBuilder, { name: props.field, label: "Target Database Column", options: props.dataColumnOptions, selectedValue: props.addFieldForm[props.field].form.dbColumn, onChange: props.onColDropDownChange, field: props.field })));
            case "dropdown":
                //name, label, selectedValue, options, onChange, error
                return (React.createElement(React.Fragment, null,
                    React.createElement(InputFormBuilder, { type: "text", name: "label", label: "Question", placeholder: "Enter Field Question Here", value: props.addFieldForm[props.field].form.label, onChange: props.onChange, field: props.field }),
                    props.addFieldForm[props.field].form.options.map((option, idx) => React.createElement("div", { className: "card bg-light", key: idx },
                        React.createElement("div", { className: "card-body" },
                            React.createElement("div", { className: "form-group" },
                                React.createElement("label", { htmlFor: "" }, "Dropdown Option Text"),
                                React.createElement("div", { className: "field" },
                                    React.createElement("input", { type: "text", required: true, name: option.value, className: "form-control", placeholder: "Enter Dropdown Option Text Here", value: option.text, onChange: (e) => props.onOptionsChange(idx, e.target.value, props.field) })),
                                option.followup.length > 0 ?
                                    buildFollowUp(option.followup, idx) : "",
                                React.createElement("button", { type: "button", className: "btn btn-primary mx-1", onClick: () => props.onConditionalQuestionClick(idx, props.field) }, "Add A Followup Question To This Option"),
                                React.createElement(ButtonFormBuilder, { label: "Delete Option", className: "btn btn-danger mx-1", onClick: () => props.removeOption(idx, props.field), field: props.field }))))),
                    React.createElement(ButtonFormBuilder, { label: "Add Dropdown Option", className: "btn btn-secondary mx-1", onClick: () => props.onAddOptionsClick(props.field), field: props.field })));
            case "radio":
                return (React.createElement(React.Fragment, null,
                    React.createElement(InputFormBuilder, { type: "text", name: "label", label: "Question", placeholder: "Enter Field Question Here", value: props.addFieldForm[props.field].form.label, onChange: props.onChange, field: props.field }),
                    props.addFieldForm[props.field].form.options.map((option, idx) => React.createElement("div", { className: "card bg-light", key: idx },
                        React.createElement("div", { className: "card-body" },
                            React.createElement("div", { className: "form-group" },
                                React.createElement("label", { htmlFor: "" }, "Radio Button Text"),
                                React.createElement("div", { className: "field" },
                                    React.createElement("input", { type: "text", required: true, name: option.value, className: "form-control", placeholder: "Enter Radio Button Text Here", value: option.text, onChange: (e) => props.onOptionsChange(idx, e.target.value, props.field) })),
                                option.followup.length > 0 ?
                                    buildFollowUp(option.followup, idx) : "",
                                React.createElement("button", { type: "button", className: "btn btn-primary mx-1", onClick: () => props.onConditionalQuestionClick(idx, props.field) }, "Add A Followup Question To This Option"),
                                React.createElement(ButtonFormBuilder, { label: "Delete Option", className: "btn btn-danger mx-1", onClick: () => props.removeOption(idx, props.field), field: props.field }))))),
                    React.createElement(ButtonFormBuilder, { label: "Add Radio Button Option", className: "btn btn-secondary mx-1", onClick: () => props.onAddOptionsClick(props.field), field: props.field })));
            case "checkbox":
                return (React.createElement(React.Fragment, null,
                    React.createElement(InputFormBuilder, { type: "text", name: "label", label: "Question", placeholder: "Enter Field Question Here", value: props.addFieldForm[props.field].form.label, onChange: props.onChange, field: props.field }),
                    props.addFieldForm[props.field].form.options.map((option, idx) => React.createElement("div", { key: idx, className: "form-group" },
                        React.createElement("label", { htmlFor: "" }, "Checkbox Text"),
                        React.createElement("div", { className: "field" },
                            React.createElement("input", { type: "text", required: true, name: option.value, className: "form-control", placeholder: "Enter Checkbox Text Here", value: option.text, onChange: (e) => props.onOptionsChange(idx, e.target.value, props.field) })),
                        React.createElement(ButtonFormBuilder, { label: "Delete Option", className: "btn btn-danger mx-1", onClick: () => props.removeOption(idx, props.field), field: props.field }))),
                    React.createElement(ButtonFormBuilder, { label: "Add Checkbox Option", className: "btn btn-secondary mx-1", onClick: () => props.onAddOptionsClick(props.field), field: props.field })));
            default:
                return "";
        }
    };
    return (React.createElement(React.Fragment, null, buildFieldForm()));
};
//# sourceMappingURL=FieldForm.js.map