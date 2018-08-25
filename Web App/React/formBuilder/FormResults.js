import * as React from "react";
import { FormBuilderApi } from "./formBuilderApi";
import { FormResultsList } from "./FormResultsList";
import { ScholarshipApi } from "../scholarship/scholarshipApi";
export default class FormResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scholarship: {
                id: props.match.params.id,
                name: "",
                organizationId: 0,
                deadlineDate: "",
                description: "",
                amount: 0,
                qtyAvailable: 0,
                keywordCSV: "",
                selectedArr: [],
                contactName: '',
                contactEmail: ''
            },
            results: [],
            userBaseId: 0
        };
    }
    componentDidMount() {
        FormBuilderApi.getAllFormResultsForScholarship(this.state.scholarship.id)
            .then(res => {
            if (res.items) {
                this.setState(Object.assign({}, this.state, { results: res.items }));
                console.log(res.items);
            }
            else
                throw new Error("Unable to get results");
        })
            .catch(err => console.log("Error:", err.message));
        ScholarshipApi.getScholarshipById(this.state.scholarship.id)
            .then(res => {
            if (res.item) {
                this.setState(Object.assign({}, this.state, { scholarship: res.item }));
            }
            else
                throw new Error("Unable to get scholarship");
        })
            .catch(err => console.log("Error:", err.message));
        FormBuilderApi.viewAllScholarshipsByUserId(this.state.userBaseId)
            .then(response => console.log("viewAll", response.items))
            .catch(error => console.log(error));
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "card-header mb-4" },
                React.createElement("h2", { className: "mb-1" }, "Form Results"),
                React.createElement("h3", null,
                    React.createElement("small", { className: "text-muted" }, this.state.scholarship.name))),
            this.state.results.length > 0 ?
                React.createElement("div", { className: "card" },
                    React.createElement(FormResultsList, Object.assign({ scholarshipId: this.state.scholarship.id, results: this.state.results }, this.props)))
                : React.createElement("p", { className: "text-center font-italic font-weight-bold" }, "No Results Found...")));
    }
}
//# sourceMappingURL=FormResults.js.map