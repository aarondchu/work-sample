import * as React from "react";
import { FormBuilderApi } from "./formBuilderApi";
import { FormQuestion } from "./FormQuestion";
import { connect } from "react-redux";
import { Card } from "../common/card";
import { ScholarshipApi } from "../scholarship/scholarshipApi";
import OrgAssignApi from "../organization/OrgAssignApi";
import * as moment from 'moment';
const mapStateToProps = (state) => ({
    user: state.user
});
class FormReduxAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = (fieldName, fieldValue) => {
            this.setState(Object.assign({}, this.state, { form: Object.assign({}, this.state.form, { [fieldName]: fieldValue }) }));
        };
        this.onCheckboxChange = (fieldName, fieldValue) => {
            let newValues = [...this.state.form[fieldName]];
            let index = newValues.indexOf(fieldValue);
            if (index == -1)
                newValues.push(fieldValue);
            else
                newValues.splice(index, 1);
            this.setState(Object.assign({}, this.state, { form: Object.assign({}, this.state.form, { [fieldName]: newValues }) }));
        };
        this.getOrganization = () => {
            OrgAssignApi.getOrgById(this.state.scholarshipInfo.organizationId)
                .then(response => {
                this.setState({
                    organizationInfo: response.item
                });
            })
                .catch(error => console.log(error));
        };
        this.getScholarship = () => {
            ScholarshipApi.getScholarshipById(this.state.scholarshipId)
                .then(response => {
                this.setState({
                    scholarshipInfo: response.item
                });
                this.getOrganization();
            })
                .catch(error => console.log(error));
        };
        this.setupForm = () => {
            FormBuilderApi.getForm(this.state.scholarshipId)
                .then(res => {
                console.log(res);
                if (res.item) {
                    let formInfo = JSON.parse(res.item.form);
                    let form = {};
                    formInfo.fields.map((field, index) => {
                        for (const prop in field) {
                            if (field[prop].inputType == "dropdown") {
                                form[prop] = `${formInfo.fields[index][prop].form.options[0].value}`;
                            }
                            else if (field[prop].inputType == "checkbox") {
                                form[prop] = [];
                            }
                            else
                                form[prop] = "";
                        }
                    });
                    this.setState({
                        formFields: formInfo.fields,
                        formTitle: formInfo.title,
                        form: form, formId: res.item.id
                    });
                }
                else
                    throw new Error("Unable to get Form");
            })
                .catch(err => console.log("Error:", err.message));
        };
        this.state = {
            formFields: [],
            formTitle: "",
            scholarshipId: props.match.params.id,
            form: {},
            formId: 0,
            userId: props.match.params.userId || 0,
            fillMode: false,
            scholarshipInfo: {
                name: "",
                deadlineDate: "",
                description: "",
                amount: 0,
                qtyAvailable: 0,
                organizationId: 0
            },
            organizationInfo: {
                orgName: "",
                organizationBio: "",
                websiteUrl: "",
                contactPhone: "",
                contactName: "",
                contactTitle: ""
            }
        };
    }
    componentDidMount() {
        this.getScholarship();
        if (this.state.userId) {
            FormBuilderApi.getFormResultForUser(this.state.scholarshipId, this.state.userId)
                .then(res => {
                if (res.item) {
                    if (res.item.form == null)
                        this.setupForm();
                    else {
                        let formInfo = JSON.parse(res.item.form);
                        let form = JSON.parse(res.item.results);
                        this.setState({
                            formFields: formInfo.fields,
                            formTitle: formInfo.title,
                            form: form,
                            formId: res.item.formId
                        });
                    }
                }
                else
                    throw new Error("Unable to get Form");
            })
                .catch(err => console.log("Error:", err.message));
        }
        else {
            this.setupForm();
        }
    }
    render() {
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "row justify-content-xl-center" },
                React.createElement("div", { className: "col col-md-10" },
                    React.createElement(Card, null,
                        React.createElement("form", { className: "form-control" },
                            React.createElement("div", { className: "card-header text-center" },
                                React.createElement("h2", null, this.state.formTitle),
                                React.createElement("div", { className: "card-title" },
                                    React.createElement("div", { className: "x-large text-muted" },
                                        React.createElement("i", null, this.state.scholarshipInfo.name)),
                                    React.createElement("div", { className: "large" },
                                        " ",
                                        React.createElement("span", { className: "text-muted" }, "Awarded by "),
                                        " ",
                                        React.createElement("span", { style: { color: "olive" } },
                                            React.createElement("b", null, this.state.organizationInfo.orgName))),
                                    React.createElement("div", { className: "small text-muted" }, this.state.scholarshipInfo.description),
                                    React.createElement("div", { className: "small text-muted" },
                                        "Deadline: ",
                                        moment(this.state.scholarshipInfo.deadlineDate).format('MMMM Do, YYYY')))),
                            React.createElement("div", { className: "card-body" },
                                React.createElement("fieldset", { disabled: this.state.userId != 0 || !this.state.fillMode }, this.state.formFields.map((field, index) => React.createElement(FormQuestion, { key: index, form: this.state.form, field: field, onChange: this.onChange, onCheckboxChange: this.onCheckboxChange }))),
                                React.createElement("div", { className: "card-footer" },
                                    React.createElement("div", { className: "text-right" },
                                        React.createElement("div", null,
                                            React.createElement("i", null,
                                                React.createElement("b", null, this.state.organizationInfo.orgName))),
                                        React.createElement("div", { className: "small text-muted" }, this.state.organizationInfo.organizationBio),
                                        React.createElement("div", { className: "small text-muted" },
                                            "Contact: ",
                                            this.state.organizationInfo.contactName,
                                            ", ",
                                            this.state.organizationInfo.contactTitle),
                                        React.createElement("div", { className: "small text-muted" }, this.state.organizationInfo.contactPhone),
                                        React.createElement("a", { target: "_blank", href: `https://${this.state.organizationInfo.websiteUrl}` }, this.state.organizationInfo.websiteUrl))))))))));
    }
}
const AdminForm = connect(mapStateToProps)(FormReduxAdmin);
export default AdminForm;
//# sourceMappingURL=AdminFormView.js.map