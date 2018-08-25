import * as React from "react";
import { FormBuilderApi } from "./formBuilderApi";
import { FormQuestion } from "./FormQuestion";
import { Button } from "../common/form";
import { connect } from "react-redux";
import { Card } from "../common/card";
import { ScholarshipApi } from "../scholarship/scholarshipApi";
import OrgAssignApi from "../organization/OrgAssignApi";
import * as moment from 'moment';
const mapStateToProps = (state) => ({
    user: state.user
});
class FormRedux extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = (fieldName, fieldValue) => {
            this.setState(Object.assign({}, this.state, { form: Object.assign({}, this.state.form, { [fieldName]: fieldValue }) }), () => console.log("OnChange", this.state));
        };
        this.onCheckboxChange = (fieldName, fieldValue) => {
            let newValues = [...this.state.form[fieldName]];
            let index = newValues.indexOf(fieldValue);
            if (index == -1)
                newValues.push(fieldValue);
            else
                newValues.splice(index, 1);
            this.setState(Object.assign({}, this.state, { form: Object.assign({}, this.state.form, { [fieldName]: newValues }) }), () => console.log("Checkbox Change", this.state));
        };
        this.getOrganization = () => {
            OrgAssignApi.getOrgById(this.state.scholarshipInfo.organizationId)
                .then(response => {
                this.setState({
                    organizationInfo: response.item
                });
                console.log(response.item);
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
        this.getUserInfo = () => {
            FormBuilderApi.getFormUserInfo(this.state.dbColumnInfo)
                .then(response => {
                let obj = JSON.parse(response.item);
                this.setState({
                    dbInfo: obj
                });
                let clonedFields = JSON.parse(JSON.stringify(this.state.formFields));
                let dbColumnItems = this.state.dbInfo;
                let formInputs = this.state.form;
                this.state.formFields.map((item, index) => {
                    for (const prop in item) {
                        for (const dbCol in dbColumnItems) {
                            if (item[prop].form.dbColumn)
                                if (item[prop].form.dbColumn.toString().toLowerCase() === dbCol.toString().toLowerCase()) {
                                    formInputs[prop] = dbColumnItems[dbCol],
                                        clonedFields[index][prop].form.value = dbColumnItems[dbCol];
                                }
                        }
                    }
                });
                this.setState({
                    formFields: clonedFields,
                    form: formInputs
                });
            })
                .catch(error => console.log(""));
        };
        this.setupForm = () => {
            let dbColumnArray = [];
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
                            dbColumnArray.push(field[prop].form.dbColumn);
                        }
                    });
                    let dbColInfo = Object.assign({}, this.state.dbColumnInfo, { dbColumns: dbColumnArray.join() });
                    this.setState({
                        dbColumnInfo: dbColInfo,
                        formFields: formInfo.fields,
                        formTitle: formInfo.title,
                        form: form, formId: res.item.id
                    }, () => this.getUserInfo());
                }
                else
                    throw new Error("Unable to get Form");
            })
                .catch(err => console.log("Error:", err.message));
        };
        this.onSubmit = () => {
            FormBuilderApi.submitFormResults({ UserBaseId: 0, FormId: this.state.formId, Results: JSON.stringify(this.state.form) })
                .then(res => {
                if (res.item) {
                    console.log("Success:", res.item);
                    alert("Form submitted. Click 'Ok' to re-route to homepage.");
                    this.props.history.push("/user/home");
                }
                else
                    throw new Error("Unable to submit results");
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
            fillMode: true,
            dbColumnInfo: {
                dbColumns: "",
                userBaseId: 0
            },
            dbInfo: {},
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
                        console.log("form", formInfo, "res", form);
                        this.setState({
                            formFields: formInfo.fields,
                            formTitle: formInfo.title,
                            form: form,
                            formId: res.item.formId
                        }, () => console.log("Loaded Form and Results ", this.state, "Props", this.props));
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
                                React.createElement("fieldset", null, this.state.formFields.map((field, index) => React.createElement(FormQuestion, { key: index, form: this.state.form, field: field, onChange: this.onChange, onCheckboxChange: this.onCheckboxChange }))),
                                React.createElement(Button, { label: "Submit", className: "btn btn-primary", onClick: this.onSubmit }),
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
const Form = connect(mapStateToProps)(FormRedux);
export default Form;
//# sourceMappingURL=Form.js.map