import * as React from 'react';
import * as moment from 'moment';
import { FormBuilderApi } from "./formBuilderApi";

interface IShowScholarshipsStatus {
    name: string,
    applicationStatus: string,
    createdDate: string,
    id: number,
    logoUrl: string
}

interface IShowScholarshipsStatusState {
    userBaseId: number,
    showStatusForAll: IShowScholarshipsStatus[]
}

class ShowScholarshipsStatus extends React.Component<any, IShowScholarshipsStatusState>{
    constructor(props) {
        super(props);
        this.state = {
            userBaseId: 0,
            showStatusForAll: []
        }
    }

    componentDidMount() {
        this.showAll(this.state.userBaseId)
    }

    showAll = (userBaseId) => {
        FormBuilderApi.viewAllScholarshipsByUserId(userBaseId)
            .then(response => {
                this.setState({
                    showStatusForAll: response.items
                })
                console.log(response.items)
            })
            .catch(error => console.log(error))
    }


    render() {
        return (
            <div>
                {this.state.showStatusForAll.length > 0 ?
                    <div className="card mb-4">
                        <div className="card-header with-elements">
                            <b><span className="card-header-title">Pending Applications:</span></b>
                            <div className="card-header-elements ml-md-auto">
                            </div>
                        </div>
                        <div className="col-xl-12" style={{ maxHeight: 400, overflowY: "scroll" }}>
                            <div className="card-body">
                                {this.state.showStatusForAll.map(status => {
                                    return (
                                        <div className="media align-items-center pb-1 mb-3" key={status.id}>
                                            <img src={status.logoUrl} className="d-block ui-w-40 rounded-circle" alt="image" />
                                            <div className="ml-4">
                                                <div /*href={`/user/social/events/${event.id}`}*/ style={{ fontSize: "16px" }}>{status.name}</div>
                                                <div>Status: <b><i>{status.applicationStatus}</i></b></div>
                                                <div className="text-muted small">Date submitted: {moment(status.createdDate).format('MMMM Do, YYYY')}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    : ""}
            </div>
        )
    }
}

export default ShowScholarshipsStatus;