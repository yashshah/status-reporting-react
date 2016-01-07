// Component for input of Twitter handle
var TwitterInput = React.createClass({
	componentDidMount: function() {
		this.refs.nameInput.getDOMNode().focus(); 
	},
	_handleKeyPress: function(e) {
		if (e.key === 'Enter') {
			this.props.onSubmit(this.refs.nameInput.getDOMNode().value);
		}
	},
	render: function () {
		return (
			<div className="statusInput">
				<h2>What is your Twitter username?</h2>
				<input type = "text" onKeyPress = {this._handleKeyPress} placeholder="@YourTwitterUsername" ref="nameInput" />
			</div>
		)
	}
});

// Component for input of Status
var StatusInput = React.createClass({
	componentDidMount: function() {
		this.refs.statusInput.getDOMNode().focus(); 
	},
	_handleKeyPress: function(e) {
		if (e.key === 'Enter') {
			this.props.onSubmit(this.refs.statusInput.getDOMNode().value);
			this.refs.statusInput.getDOMNode().value = "";
		}
	},
	render: function () {
		return (
			<div className="statusInput">
				<h2>What are you doing?</h2>
				<input type = "text" onKeyPress = {this._handleKeyPress} placeholder={this.props.placeholder} ref="statusInput" />
			</div>
		)
	}
});



var StreamBrowser = React.createClass({

	// Set your Appbase credentials here
	getDefaultProps: function() {
		return {
			app_name: 'workingon',
			username: 'iiyvFcb3A',
			password: 'b3a36a4d-e517-451c-a04f-a11dc2c4b4bc',
			type: 'feed'
		};
	},

	// Checks if localstorage already exists otherwise update it with default value
	getInitialState: function(){
		if (localStorage.state){
			status = JSON.parse(localStorage.state).status
			twitterHandle = JSON.parse(localStorage.state).twitterHandle
		}
		// Setting the status with default Value
		else
		{
			status = "Mining Bitcoin"
			twitterHandle = ""
		}
		return {
			status: status,
			twitterHandle: twitterHandle
		};
	},

	// Update the localStorage when state is changed
	componentDidUpdate: function(prevProps, prevState) {
		localStorage.state = JSON.stringify(this.state);
	},

	// Index the status to Appbase
	addStatus: function(status){
		// Set the status state with the argument passed with the function
		this.setState({
			status:status 
		});
		var data = {
			"status": status,
			"twitterHandle": this.state.twitterHandle
		}
		// Ajax call to insert the status in Appbase
		$.ajax({
			type: "POST",
			xhrFields: {
				withCredentials: true
			},
			headers: {
				"Authorization": "Basic " + btoa(this.props.username+':'+this.props.password)
			},
			data: JSON.stringify(data),
			url: 'http://scalr.api.appbase.io/'+this.props.app_name+ '/' + this.props.type+'/',
			dataType: 'json',
			contentType: "application/json",
			success: function(data) {
				console.log(data);
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
				console.log(data)
			}.bind(this)
		});
	},

  	// Update the Twitter Handle state when the TwitterInput component is submitted
  	addTwitterHandle: function(twitterHandle){
  		this.setState({
  			twitterHandle: twitterHandle 
  		});
  	},

  	render: function() {
  		var twitterHandle = ""
  		
  		// If twitterHandle already exists, then directly show update status page
  		if(this.state.twitterHandle){
  			return (
  				<StatusInput onSubmit={this.addStatus} placeholder={this.state.status}/>
  			);					
  		}
  		else{
  			return (
  				<TwitterInput onSubmit={this.addTwitterHandle} />
  			);
  		}
  	}

  });

React.render(
  <StreamBrowser />,
  document.getElementById('statusInput')
);