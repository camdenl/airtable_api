import React, { Component } from 'react';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keydVVH8JQAGBQC8h' }).base('app1bMqKwnm8xpoTb');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobsTableData: [],
      isLoaded: false,
      error: false,
      jobFields: {},
      fieldFields: {},
      dealFields: {},
      allFields: {},
      selectedJob: undefined
    };
    this.handleClick = this.handleClick.bind(this);
    this.getFieldData = this.getFieldData.bind(this);
    this.getDealData = this.getDealData.bind(this);
  }

  handleClick(record) {
    this.setState({
      allFields: { ...this.state.allFields, ...record.fields },
      selectedJob: record.id
    });
    this.getFieldData(record.fields['Field'][0]);
    this.getDealData(record.fields['Deal'][0]);
  }

  getFieldData(fieldId) {
    const TABLE_NAME = 'Fields';
    const table = base(TABLE_NAME)
    const getData = id => {
      return table.find(id)
    }
    getData(fieldId).then((resp) => {
      this.setState({
        allFields: { ...this.state.allFields, ...resp.fields }
      });
    })
  }

  getDealData(dealId) {
    const TABLE_NAME = 'Deals';
    const table = base(TABLE_NAME)
    const getData = id => {
      return table.find(id)
    }
    getData(dealId).then((resp) => {
      this.setState({
        allFields: { ...this.state.allFields, ...resp.fields }
      });
    })
  }
  getJobData = () => {
    const TABLE_NAME = 'Jobs';
    const VIEW_NAME = 'camden_dev'
    const table = base(TABLE_NAME)
    const jobs = [];
    const getData = view => {
      return table.select({
        view: view
      }).all()
    }
    getData(VIEW_NAME)
      .then((resp) => {
        resp.forEach((record) => {
          const jobID = record['id'];
          jobs.push({ 'id': jobID, 'fields': record.fields });
        });
        this.setState({
          jobsTableData: jobs,
          isLoaded: true,
          error: false
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: true });
      });
  }
  componentDidMount() {
    this.getJobData();
  }
  render() {
    return (
      <div>
        {
          // if the data loaded correctly
          (this.state.isLoaded && !this.state.error) ? (
            this.state.jobsTableData.map(record =>
              <li key={record.id} onClick={() => this.handleClick(record)}>
                {record.id}
              </li>
            )
          ) :
            // else if there is no error, it is loading
            (!this.state.error) ? (
              <p>Loading...</p>
            ) :
              // else error
              (<p>error</p>)
        }
      </div>
    )
  }
}

export default App;