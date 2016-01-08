var FeedItem = React.createClass({
	render: function() {
		twitterProfilePictureURL = "https://twitter.com/" + this.props.item.twitterHandle + "/profile_image?size=original"
		return (
			<div className="col s12 m6 l4">
	          <div className="card white">
	              <div className="card-image">
	              	<img src={twitterProfilePictureURL}/>
	              </div>
	              <div className="card-content gray-text">
	              	<span className="card-title text-darken-4">{this.props.item.twitterHandle} is</span>
	              	<p>{this.props.item.status}</p>
	              </div>
	          </div>
	        </div>
		);
	}
})

var FeedItems = React.createClass({
	render: function() {

		var content;
		if (this.props.items.length > 0) {
		  content = this.props.items.map(function(item) {
		    return <FeedItem item={item} />;
		  });
		} else {
		  content = <FeedItem item="No content Available!" />;
		}

		return (
			<div className="row">
				<h3 className="col s12 center white-text"> Working on Feed</h3>
				{content}
			</div>
		);
	}
})

var Feed = React.createClass({

	getInitialState: function() {
		var self = this;
		var appbaseRef = new Appbase({
		  url: 'https://scalr.api.appbase.io',
		  appname: 'workingon',
		  username: 'iiyvFcb3A',
		  password: 'b3a36a4d-e517-451c-a04f-a11dc2c4b4bc'
		})

		appbaseRef.search({
			type: "feed",
		  	size: 1000,
			body: {
			    query: {
			      match_all: {}
			    }
			  }
			}).on('data', function(res) {
			  $.map(res.hits.hits, function(object){
				self.addItem(object._source)
			  })
			}).on('error', function(err) {
			  console.log("search error: ", err);
		})

		appbaseRef.searchStream({
		  type: "feed",
		  body: {
		    query: {
		      match_all: {}
		    }
		  }
		}).on('data', function(res) {
		  self.addItem(res._source)
		}).on('error', function(err) {
		  console.log("streaming error: ", err);
		})	
		return {
			items: [] 
		};
	},
	addItem: function(newItem){
		var updated = this.state.items;
		updated.unshift(newItem)
		this.setState({items: updated});
		console.log(this.state.items)
	},
	render: function() {
		return (
			<FeedItems items={this.state.items}/>
		);
	}

});

React.render(
  <Feed />,
  document.getElementById('container')
);