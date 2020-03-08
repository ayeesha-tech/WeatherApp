import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import Select from 'react-select';
import axios from 'axios';

class PostLists extends Component {
    constructor(props){
        super(props)
        this.state = {
            posts: [],
            value: '',
            opened: true,
            selectedOption: null,
        }
        this._isMounted = false;
        this.toggleBox = this.toggleBox.bind(this);
    }

    toggleBox() {
		const { opened } = this.state;
		this.setState({
			opened: !opened,
		});
	}

   componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    handleChange = selectedOption => {
        const { opened } = this.state;
        console.log('test:',opened);
        this.setState({ selectedOption });
        this.fetchData(selectedOption.value);       
    };

    fetchData(value){
        if (!this._isMounted) return;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        axios.get(proxyurl+'https://ws.weatherzone.com.au/?lt=aploc&lc='+value+'&locdet=1&latlon=1&pdf=twc(period=48,detail=2)&u=1&format=json' ,{ headers: {}})
             .then(response => {
                if (!this._isMounted) return;
                console.log(response)
                const dataobj = response.data
                this.setState({posts : dataobj.countries[0].locations[0].part_day_forecasts.forecasts})
             })
             .catch(error => {
                console.log(error)
             })
    }
     
    renderTableData() {
        return this.state.posts.map((post,index) => {
           return (
            <tr key={post.timestamp}>
                <td>{post.precis}</td>
                <td>{post.temperature}</td>
                <td>{post.wind_speed}</td>
                <td>{post.wind_direction}</td>
                <td> <Moment tz={post.time_zone} date={post.local_time}> </Moment></td>
                <td> <Moment tz={post.time_zone} date={post.utc_time} /></td>
            </tr>
           )
        })
     }   
    
    render()  {
        var { title } = this.props;
        const { opened } = this.state;
        const { selectedOption } = this.state;
        const options = [
        { value: '12495', label: 'Adelaide' },
        { value: '9388', label: 'Brisbane' },
        { value: '3928', label: 'Canberra' },
        { value: '11', label: 'Darwin' },
        { value: '15465', label: 'Hobart' },
        { value: '5594', label: 'Melbourne' },
        { value: '13896', label: 'Perth' },
        { value: '624', label: 'Sydney' }
      ];
      console.log('opened:',opened);
      if (opened){
        title ='Hide Weather Data';
    }else{
        title ='Show Weather Data';
    }
        return (
             <div className="col-md-4">
                <div style={{margin:'30px 0px'}}>
                    <div style={{float:'left',margin:'5px', paddingRight:'10px',paddingBottom:'20px'}}>Locations :</div>
                    <div style={{width:'240px'}}> 
                    <Select
                            value={selectedOption}
                            onChange={this.toggleBox,this.handleChange}
                            options={options}
                    />
                    
                    </div>
                </div>
                <button style={{float:'right'}} onClick={this.toggleBox}>{title}</button>
              <div>
        
                  {opened && (					
					<div>
						 <table id='weatherDetails'>
                 <tbody>
                 <tr>
                    <td>Precipitation Probability</td>
                    <td>Temperature</td>
                    <td>Wind Speed</td>
                    <td>Wind Direction</td>
                    <td>Local Time</td>
                    <td>UTC Time</td>
                 </tr>
					 {this.renderTableData()}
                 </tbody>
              </table>
					</div>
				)}
             
           </div>
           </div>
        )
     }
}

export default PostLists;