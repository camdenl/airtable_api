import React, { Component } from 'react';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keydVVH8JQAGBQC8h' }).base('app1bMqKwnm8xpoTb');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: {}
    };
  }
  componentDidMount() {
    const jobs = {}; 
    base('Jobs').select({
      view: "camden_dev"
    }).eachPage(function page(records, fetchNextPage) {
      console.log(records)
      records.forEach(function (record) {
        const jobName = record.get('Name');
        const jobID = record.get('Id');
        console.log(jobID);
        jobs[jobID] = jobName;
      });
      fetchNextPage();
    }, function done(err) {
      if (err) { 
        console.error(err); 
      }
    });
    this.setState({records: jobs});
  }
  render() {
    return (
      <div>
        <div>Hello</div>
      </div>
    )
  }
}

export default App;