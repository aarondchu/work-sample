import * as React from "react";
import { FormBuilderApi } from "./formBuilderApi";
import { FormResultsList } from "./FormResultsList";
import { RouteComponentProps } from "react-router";
import { IScholarshipEntity } from "../scholarship/scholarshipForm";
import { ScholarshipApi } from "../scholarship/scholarshipApi";

export interface IResults {
	createdDate: Date,
	formId: number,
	userBaseId: number,
	firstName: string,
	lastName: string,
	applicationStatus: string
}

interface IFormResultsState {
	results: IResults[],
	scholarship: IScholarshipEntity,
	userBaseId: number
}

export default class FormResults extends React.Component<RouteComponentProps<any>, IFormResultsState> {
	constructor(props) {
		super(props);
		this.state = {
			scholarship: {
				id: props.match.params.id,                      // required for Update, Not insert
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

		}
	}
	componentDidMount() {
		FormBuilderApi.getAllFormResultsForScholarship(this.state.scholarship.id)
			.then(res => {
				if (res.items) {
					this.setState({ ...this.state, results: res.items })
					console.log(res.items)
				}
				else throw new Error("Unable to get results")
			})
			.catch(err => console.log("Error:", err.message))
		ScholarshipApi.getScholarshipById(this.state.scholarship.id)
			.then(res => {
				if (res.item) {
					this.setState({ ...this.state, scholarship: res.item })
				}
				else throw new Error("Unable to get scholarship")
			})
			.catch(err => console.log("Error:", err.message))
		FormBuilderApi.viewAllScholarshipsByUserId(this.state.userBaseId)
			.then(response => console.log("viewAll", response.items))
			.catch(error => console.log(error))
	}

    render() {
        return (
            <React.Fragment>
                <div className="card-header mb-4">
                    <h2 className="mb-1">Form Results</h2>
                    <h3><small className="text-muted">{this.state.scholarship.name}</small></h3>
                </div>
                {this.state.results.length > 0 ?
                    <div className="card">
                        <FormResultsList
                            scholarshipId={this.state.scholarship.id}
                            results={this.state.results}
                            {...this.props}
                        />
                    </div>
                    : <p className="text-center font-italic font-weight-bold">No Results Found...</p>
                }
            </React.Fragment>
        );
    }
}