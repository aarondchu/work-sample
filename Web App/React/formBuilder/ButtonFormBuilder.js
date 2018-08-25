import * as React from "react";
;
export const ButtonFormBuilder = (props) => {
    return (React.createElement("button", { type: "button", className: props.className, onClick: () => props.onClick(props.field), disabled: props.disabled }, props.label));
};
//# sourceMappingURL=ButtonFormBuilder.js.map