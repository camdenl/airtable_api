import React, { Component } from 'react';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keydVVH8JQAGBQC8h' }).base('app1bMqKwnm8xpoTb');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      isLoaded: false,
      error: false
    };
  }
  componentDidMount() {
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
          const jobName = record.get('Name');
          const jobID = record['id'];
          jobs.push({
            'key': jobID, 'name': jobName
          });
        });
        this.setState({
          records: jobs,
          isLoaded: true,
          error: false
        });
        console.log(jobs);
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: true });
      });
  }
  render() {
    return (
      <div>
        {
          // if the data loaded correctly
          (this.state.isLoaded && !this.state.error) ? (
            this.state.records.map(record =>
              <li key={record.key}>
                {record.name}
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