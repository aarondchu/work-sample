import * as React from "react";
import { FieldPreviewBox } from "./FieldPreviewBox";
export const Field = (props) => {
    return (React.createElement("div", null,
        React.createElement(FieldPreviewBox, { addFieldForm: props.form, field: props.field }),
        React.createElement("button", { type: "button", className: "btn btn-secondary mx-1", onClick: () => props.setEdit(props.idx, props.field) }, "Edit"),
        React.createElement("button", { type: "button", className: "btn btn-danger mx-1", onClick: () => props.onDelete(props.idx, props.field) }, "Delete")));
};
//# sourceMappingURL=Field.js.map