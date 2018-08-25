import * as React from "react";
export const InputFormBuilder = (props) => {
    const onChangeInput = (e) => {
        props.onChange(e.target.name, e.target.value, props.field);
    };
    return (React.createElement("div", { className: "form-group" },
        React.createElement("label", { htmlFor: props.name }, props.label),
        React.createElement("div", { className: "field" },
            React.createElement("input", { type: props.type, required: true, name: props.name, className: props.error ?
                    (props.className ?
                        props.className + "form-control is-invalid" :
                        "form-control is-invalid") :
                    (props.className ?
                        props.className + " form-control" :
                        "form-control"), placeholder: props.placeholder, value: props.value, onChange: onChangeInput }),
            React.createElement("div", { className: "invalid-feedback small" }, props.error))));
};
//# sourceMappingURL=InputFormBuilder.js.map