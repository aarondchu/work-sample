import * as React from "react";
import * as moment from 'moment';
export const FormResultsList = (props) => {
    return (React.createElement("table", { className: "table table-striped table-bordered dataTable no-footer", role: "grid" },
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", { className: "text-center" }, "Name"),
                React.createElement("th", { className: "text-center" }, "Date Submitted"),
                React.createElement("th", { className: "text-center" }, "Status"))),
        React.createElement("tbody", null, props.results.map((result, index) => React.createElement(React.Fragment, { key: index },
            React.createElement("tr", { onClick: () => props.history.push(`/admin/forms/${props.scholarshipId}/${result.userBaseId}`) },
                React.createElement("td", null,
                    result.firstName,
                    " ",
                    result.lastName),
                React.createElement("td", null, moment(result.createdDate).format('MMMM Do, YYYY')),
                React.createElement("td", null, result.applicationStatus)))))));
};
//# sourceMappingURL=FormResultsList.js.map