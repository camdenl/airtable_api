import React, { Component } from 'react';
import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keydVVH8JQAGBQC8h' }).base('app1bMqKwnm8xpoTb');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobsTableData: [],
      isLoaded: false,
      error: false
    };
  }

  handleClick = (record) => {
    this.getFieldData(record['Field'][0])
    this.getDealData(record['Deal'][0])
  }

  getFieldData = (fieldId) => {
    const TABLE_NAME = 'Fields';
    const table = base(TABLE_NAME)
    table.find(fieldId, function (err, record) {
      if (err) {
        console.error(err); return;
      }
      console.log('field', record.fields);
    })
  }
  /*
  mission = {};
  mission.name = ('Name' in job['fields']) ? job['fields']['Mission Name'] : ''
  mission.R24_Job.test_package = job['fields']['Test Pckg - Final'][0] if 'Test Pckg - Final' in job['fields'] and len(job['fields']['Test Pckg - Final']) > 0 else ''
  mission.R24_Job.event_id = job['fields']['Event ID'] if 'Event ID' in job['fields'] else ''
  mission.R24_Job.sampling_company_name = get_field(job, 'Submitter ID Final', 'Rogo')
  mission.R24_Job.sampling_company_id = job['fields']['Lab Sub ID & Location'][0].split(',')[0] if 'Lab Sub ID & Location' in job['fields'] and len(job['fields']['Lab Sub ID & Location']) > 0 else ''
  mission.R24_Job.response_email = job['fields']['Email for Results'][0] if 'Email for Results' in job['fields'] and len(job['fields']['Email for Results']) > 0 else ''
  mission.R24_Job.client = job['fields']['Client'][0] if 'Client' in job['fields'] and len(job['fields']['Client']) > 0 else ''
  mission.R24_Job.grower = job['fields']['Grower'][0] if 'Grower' in job['fields'] and len(job['fields']['Grower']) > 0 else ''
  mission.R24_Job.farm = field['fields']['Farm Name Clean'] if 'Farm Name Clean' in field['fields'] else ''
  mission.R24_Job.field = field['fields']['Field Name Clean'] if 'Field Name Clean' in field['fields'] else ''
  mission.R24_Job.billing_account = job['fields']['Final Lab Acc #'][0] if 'Final Lab Acc #' in job['fields'] and len(job['fields']['Final Lab Acc #']) > 0 else ''
  mission.R24_Job.lab_name = job['fields']['Lab - Final'][0] if 'Lab - Final' in job['fields'] and len(job['fields']['Lab - Final']) > 0 else ''
  mission.R24_Job.ship_instructions = job['fields']['Ship Instructions'][0] if 'Ship Instructions' in job['fields'] and len(job['fields']['Ship Instructions']) > 0 else ''
  mission.R24_Job.field_id = job['fields']['Field ID'] if 'Field ID' in job['fields'] else ''
  mission.R24_Job.add_on_freq = int(job['fields']['Final Freq of Add-On Test Pckg'][0]) if 'Final Freq of Add-On Test Pckg' in job['fields'] else 1
  mission.R24_Job.lab_submittal_id = job['fields']['Final Lab Presubmission Code'] if 'Final Lab Presubmission Code' in job['fields'] else ''
*/
  getDealData = (dealId) => {
    // {"model_name" : value, "airtable_name" : value, "dtype" : (str|int|float)}
    /* const dealData = [
      { 'cores': null, 'Cores': null, 'dtype': 'int' },
      { 'radius': null, 'Size (ft)': null, 'dtype': 'float' }
    ]; */
    const TABLE_NAME = 'Deals';
    const table = base(TABLE_NAME)
    table.find(dealId, function (err, record) {
      if (err) {
        console.error(err); return;
      }

      console.log('deal', record.fields);
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
              <li key={record.id} onClick={() => this.handleClick(record.fields)}>
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