import * as React from "react";
import { IResults } from "./FormResults";
import { RouteComponentProps } from "react-router";
import * as moment from 'moment';

interface IFormResultsListProps extends RouteComponentProps<any> {
	results: IResults[],
	scholarshipId: number
}

export const FormResultsList = (props: IFormResultsListProps) => {
	return (
		<table className="table table-striped table-bordered dataTable no-footer" role="grid">
			<thead>
				<tr>
					<th className="text-center">Name</th>
					<th className="text-center">Date Submitted</th>
					<th className="text-center">Status</th>
				</tr>
			</thead>
			<tbody>
				{
					props.results.map((result, index) =>
						<React.Fragment key={index}>
							<tr onClick={() => props.history.push(`/admin/forms/${props.scholarshipId}/${result.userBaseId}`)}>
								<td>{result.firstName} {result.lastName}</td>
								<td>{moment(result.createdDate).format('MMMM Do, YYYY')}</td>
								<td>{result.applicationStatus}</td>
							</tr>
						</React.Fragment>
					)
				}
			</tbody>
		</table>
	)
}