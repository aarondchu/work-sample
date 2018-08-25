import * as React from "react";
;
const formatWrapperClass = (props) => {
    const wrapperClass = 'form-group';
    return props.error ? `${wrapperClass} has-error` : wrapperClass;
};
const onChangeInput = (props) => (e) => {
    props.onChange(e.target.id, e.target.value);
};
export const DropDownListFormBuilder = (props) => {
    var options = props.options.map((option) => {
        return (React.createElement("option", { key: option.value, value: option.value }, option.text));
    });
    return (React.createElement("div", { className: formatWrapperClass(props) },
        React.createElement("label", { htmlFor: props.name }, props.label),
        React.createElement("div", { className: "field" },
            React.createElement("select", { value: props.selectedValue, onChange: onChangeInput(props), id: props.name, className: "form-control" }, options))));
};
//# sourceMappingURL=DropDownListFormBuilder.js.map