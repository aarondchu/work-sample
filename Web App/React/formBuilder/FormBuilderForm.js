import * as React from "react";
import { FieldPreviewBox } from "./FieldPreviewBox";
import { DropDownListFormBuilder } from "./DropDownListFormBuilder";
import { ButtonFormBuilder } from "./ButtonFormBuilder";
import { FieldForm } from "./FieldForm";
export const FormBuilderForm = (props) => {
    const validateForm = () => {
        if (props.addFieldForm[props.field].form.label.length == 0) {
            return true;
        }
        else if (props.addFieldForm[props.field].form.options != undefined) {
            if (props.addFieldForm[props.field].form.options.length == 0 || props.addFieldForm[props.field].form.options.some(opt => opt.text.length == 0)) {
                return true;
            }
            else
                return false;
        }
        else
            return false;
    };
    return (React.createElement("div", { className: "card bg-light", id: "fieldForm" },
        React.createElement("div", { className: "card-body" },
            React.createElement("div", { className: "form" },
                React.createElement(DropDownListFormBuilder, { name: props.field, label: "Choose your field type", selectedValue: props.addFieldForm[props.field].inputType, options: props.options, onChange: props.onFieldTypeChange, field: props.field }),
                React.createElement(FieldForm, { options: props.options, onFieldTypeChange: props.onFieldTypeChange, onEditFieldClick: props.onEditFieldClick, onSaveFieldClick: props.onSaveFieldClick, editingField: props.editingField, field: props.field, addFieldForm: props.addFieldForm, onChange: props.onChange, dataColumnOptions: props.dataColumnOptions, onColDropDownChange: props.onColDropDownChange, inputTypeOptions: props.inputTypeOptions, onAddOptionsClick: props.onAddOptionsClick, onConditionalQuestionClick: props.onConditionalQuestionClick, onInputTypeChange: props.onInputTypeChange, onOptionsChange: props.onOptionsChange, removeOption: props.removeOption, onCancel: props.onCancel, onCancelConditional: props.onCancelConditional, onSaveConditional: props.onSaveConditional, onEditConditional: props.onEditConditional }),
                props.editingField.inEditMode ?
                    React.createElement(ButtonFormBuilder, { label: "Save Edit", className: "btn btn-primary mx-1", onClick: () => props.onEditFieldClick(0, props.field), field: props.field, disabled: validateForm() }) :
                    React.createElement(ButtonFormBuilder, { label: "Save Field", className: "btn btn-primary mx-1", onClick: () => props.onSaveFieldClick(props.field), field: props.field, disabled: validateForm() }),
                React.createElement("button", { type: "button", className: "btn btn-danger mx-1", onClick: () => {
                        console.log("Cancel Button", props.field);
                        props.onCancel(props.optIndex != null ? props.optIndex : 0, props.field);
                    } }, "Cancel")),
            React.createElement("div", { className: "card bg-secondary text-white", style: { marginTop: "15px" } },
                React.createElement("div", { className: "card-body" },
                    React.createElement("h3", null, "Preview"),
                    React.createElement("div", { className: "card text-dark" },
                        React.createElement("div", { className: "card-body" },
                            React.createElement(FieldPreviewBox, { addFieldForm: props.addFieldForm, field: props.field }))))))));
};
//# sourceMappingURL=FormBuilderForm.js.map