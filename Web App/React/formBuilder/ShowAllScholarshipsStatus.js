import * as React from 'react';
import * as moment from 'moment';
import { FormBuilderApi } from "./formBuilderApi";
class ShowScholarshipsStatus extends React.Component {
    constructor(props) {
        super(props);
        this.showAll = (userBaseId) => {
            FormBuilderApi.viewAllScholarshipsByUserId(userBaseId)
                .then(response => {
                this.setState({
                    showStatusForAll: response.items
                });
                console.log(response.items);
            })
                .catch(error => console.log(error));
        };
        this.state = {
            userBaseId: 0,
            showStatusForAll: []
        };
    }
    componentDidMount() {
        this.showAll(this.state.userBaseId);
    }
    render() {
        return (React.createElement("div", null, this.state.showStatusForAll.length > 0 ?
            React.createElement("div", { className: "card mb-4" },
                React.createElement("div", { className: "card-header with-elements" },
                    React.createElement("b", null,
                        React.createElement("span", { className: "card-header-title" }, "Pending Applications:")),
                    React.createElement("div", { className: "card-header-elements ml-md-auto" })),
                React.createElement("div", { className: "col-xl-12", style: { maxHeight: 400, overflowY: "scroll" } },
                    React.createElement("div", { className: "card-body" }, this.state.showStatusForAll.map(status => {
                        return (React.createElement("div", { className: "media align-items-center pb-1 mb-3", key: status.id },
                            React.createElement("img", { src: status.logoUrl, className: "d-block ui-w-40 rounded-circle", alt: "image" }),
                            React.createElement("div", { className: "ml-4" },
                                React.createElement("div", { style: { fontSize: "16px" } }, status.name),
                                React.createElement("div", null,
                                    "Status: ",
                                    React.createElement("b", null,
                                        React.createElement("i", null, status.applicationStatus))),
                                React.createElement("div", { className: "text-muted small" },
                                    "Date submitted: ",
                                    moment(status.createdDate).format('MMMM Do, YYYY')))));
                    }))))
            : ""));
    }
}
export default ShowScholarshipsStatus;
//# sourceMappingURL=ShowAllScholarshipsStatus.js.map