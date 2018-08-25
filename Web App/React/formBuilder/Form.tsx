import * as React from "react";
import { RouteComponentProps } from "react-router";
import { FormBuilderApi } from "./formBuilderApi";
import { FormQuestion } from "./FormQuestion";
import { Button } from "../common/form";
import { connect } from "react-redux";
import { Card } from "../common/card"
import { ScholarshipApi } from "../scholarship/scholarshipApi"
import OrgAssignApi from "../organization/OrgAssignApi"
import * as moment from 'moment'


const mapStateToProps = (state) => ({
    user: state.user
});
interface IFormProps extends RouteComponentProps<any> {
    user: any
}

interface IOrganizationEntity {
    orgName: string,
    organizationBio: string,
    websiteUrl: string,
    contactPhone: string,
    contactName: string,
    contactTitle: string
}

interface IScholarshipInfoEntity {
    name: string,
    deadlineDate: string,
    description: string,
    amount: number,
    qtyAvailable: number,
    organizationId: number,
}

interface IFormState {
    formTitle: string,
    formFields: any[],
    scholarshipId: number,
    form: any,
    formId: number,
    userId: number,
    fillMode: boolean,
    dbColumnInfo: any,
    dbInfo: any,
    scholarshipInfo: IScholarshipInfoEntity
    organizationInfo: IOrganizationEntity
}
class FormRedux extends React.Component<IFormProps, IFormState> {
    constructor(props) {
        super(props);
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
        }
    }
    onChange = (fieldName: string, fieldValue: string) => {
        this.setState({ ...this.state, form: { ...this.state.form, [fieldName]: fieldValue } }, () => console.log("OnChange", this.state));
    }
    onCheckboxChange = (fieldName: string, fieldValue: string) => {
        let newValues = [...this.state.form[fieldName]];
        let index = newValues.indexOf(fieldValue);
        if (index == -1)
            newValues.push(fieldValue);
        else newValues.splice(index, 1);
        this.setState({ ...this.state, form: { ...this.state.form, [fieldName]: newValues } }, () => console.log("Checkbox Change", this.state));
    }

    getOrganization = () => {
        OrgAssignApi.getOrgById(this.state.scholarshipInfo.organizationId)
            .then(response => {
                this.setState({
                    organizationInfo: response.item
                })
                console.log(response.item)
            })
            .catch(error => console.log(error))
    }

    getScholarship = () => {
        ScholarshipApi.getScholarshipById(this.state.scholarshipId)
            .then(response => {
                this.setState({
                    scholarshipInfo: response.item
                })
                this.getOrganization();
            })
            .catch(error => console.log(error))
    }

    getUserInfo = () => {
        FormBuilderApi.getFormUserInfo(this.state.dbColumnInfo)
            .then(response => {
                let obj = JSON.parse(response.item)
                this.setState({
                    dbInfo: obj
                })
                let clonedFields = JSON.parse(JSON.stringify(this.state.formFields))
                let dbColumnItems = this.state.dbInfo
                let formInputs = this.state.form
                this.state.formFields.map((item, index) => {
                    for (const prop in item) {
                        for (const dbCol in dbColumnItems) {
                            if (item[prop].form.dbColumn) if (item[prop].form.dbColumn.toString().toLowerCase() === dbCol.toString().toLowerCase()) {
                                formInputs[prop] = dbColumnItems[dbCol],
                                    clonedFields[index][prop].form.value = dbColumnItems[dbCol]
                            }
                        }
                    }
                })
                this.setState({
                    formFields: clonedFields,
                    form: formInputs
                })
            })
            .catch(error => console.log(""))

    }

    setupForm = () => {
        let dbColumnArray = []
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
                            else form[prop] = "";
                            dbColumnArray.push(field[prop].form.dbColumn)
                        }
                    });
                    let dbColInfo = { ...this.state.dbColumnInfo, dbColumns: dbColumnArray.join() }

                    this.setState({
                        dbColumnInfo: dbColInfo,
                        formFields: formInfo.fields,
                        formTitle: formInfo.title,
                        form: form, formId: res.item.id
                    }, () => this.getUserInfo())
                }
                else throw new Error("Unable to get Form")
            })
            .catch(err => console.log("Error:", err.message))
    }
    componentDidMount() {

        this.getScholarship();
        if (this.state.userId) {
            FormBuilderApi.getFormResultForUser(this.state.scholarshipId, this.state.userId)
                .then(res => {
                    if (res.item) {
                        if (res.item.form == null)
                            this.setupForm()
                        else {
                            let formInfo = JSON.parse(res.item.form);
                            let form = JSON.parse(res.item.results);
                            console.log("form", formInfo, "res", form)
                            this.setState({
                                formFields: formInfo.fields,
                                formTitle: formInfo.title,
                                form: form,
                                formId: res.item.formId
                            }, () => console.log("Loaded Form and Results ", this.state, "Props", this.props))
                        }
                    }
                    else throw new Error("Unable to get Form")
                })
                .catch(err => console.log("Error:", err.message))
        }
        else {
            this.setupForm();
        }
    }


    onSubmit = () => {
        FormBuilderApi.submitFormResults({ UserBaseId: 0, FormId: this.state.formId, Results: JSON.stringify(this.state.form) })
            .then(res => {
                if (res.item) {
                    console.log("Success:", res.item)
                    alert("Form submitted. Click 'Ok' to re-route to homepage.")
                    this.props.history.push("/user/home")

                }
                else throw new Error("Unable to submit results");

            })
            .catch(err => console.log("Error:", err.message));
    }
    render() {
        return (
            <div className="container">
                <div className="row justify-content-xl-center">
                    <div className="col col-md-10">
                        <Card>
                            <form className="form-control">
                                <div className="card-header text-center">
                                    <h2>{this.state.formTitle}</h2>
                                    <div className="card-title">
                                        <div className="x-large text-muted"><i>{this.state.scholarshipInfo.name}</i></div>
                                        <div className="large"> <span className="text-muted">Awarded by </span> <span style={{ color: "olive" }}><b>{this.state.organizationInfo.orgName}</b></span></div>
                                        <div className="small text-muted">{this.state.scholarshipInfo.description}</div>
                                        <div className="small text-muted">Deadline: {moment(this.state.scholarshipInfo.deadlineDate).format('MMMM Do, YYYY')}</div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <fieldset>
                                        {this.state.formFields.map((field, index) =>
                                            <FormQuestion key={index}
                                                form={this.state.form}
                                                field={field}
                                                onChange={this.onChange}
                                                onCheckboxChange={this.onCheckboxChange}
                                            />
                                        )}
                                    </fieldset>
                                    <Button
                                        label="Submit"
                                        className="btn btn-primary"
                                        onClick={this.onSubmit}
                                    />
                                    <div className="card-footer">
                                        <div className="text-right">
                                            <div><i><b>{this.state.organizationInfo.orgName}</b></i></div>
                                            <div className="small text-muted">{this.state.organizationInfo.organizationBio}</div>
                                            <div className="small text-muted">Contact: {this.state.organizationInfo.contactName}, {this.state.organizationInfo.contactTitle}</div>
                                            <div className="small text-muted">{this.state.organizationInfo.contactPhone}</div>
                                            <a target="_blank" href={`https://${this.state.organizationInfo.websiteUrl}`}>{this.state.organizationInfo.websiteUrl}</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>

            </div>
        );
    }
}
const Form = connect(mapStateToProps)(FormRedux);

export default Form;

