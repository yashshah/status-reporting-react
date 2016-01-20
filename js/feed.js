var appbaseRef = new Appbase({
  url: 'https://scalr.api.appbase.io',
  appname: 'workingon',
  username: 'iiyvFcb3A',
  password: 'b3a36a4d-e517-451c-a04f-a11dc2c4b4bc'
})

var FeedItem = React.createClass({
	render: function() {
		twitterProfilePictureURL = "https://twitter.com/" + this.props.item.twitterHandle + "/profile_image?size=original"
		return (
			<div className="row">
				<div className="col s4 m2 l1">
		        	<img className="profile-picture" src={twitterProfilePictureURL}/>
		        </div>
				<div className="col s8 m10 l11">
		          	<span className="twitter-handle">{this.props.item.twitterHandle} is</span>
		          	<p className="working-on">{this.props.item.status}</p>
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

	getDefaultProps: function() {
		return {
			pageNumber: 0
		};
	},

	getInitialState: function() {
		var self = this;

		appbaseRef.searchStream({
		  type: "feed",
		  body: {
		    query: {
		      match_all: {}
		    }
		  }
		}).on('data', function(res) {
		  self.addItemToTop(res._source)
		}).on('error', function(err) {
		  console.log("streaming error: ", err);
		})	
		return {
			items: [] 
		};
	},
	componentDidMount: function() {
		window.addEventListener('scroll', this.handleScroll)
		this.getItems()
	},
	componentWillUnmount: function() {
		window.removeEventListener('scroll', this.handleScroll)
	},
	handleScroll: function(event) {
		console.log("inside")
		var body = event.srcElement.body
		var self = this
		if(body.clientHeight + body.scrollTop >= body.offsetHeight) {
			this.getItems()
		}
	},
	addItemToTop: function(newItem){
		var updated = this.state.items;
		updated.unshift(newItem)
		this.setState({items: updated});
	},
	getItems: function(){
		self = this
		appbaseRef.search({
			type: "feed",
		  	size: 10,
		  	from: self.props.pageNumber*10,
			body: {
			    query: {
			      match_all: {}
			    },
			    sort: {
			    	timestamp: "desc"
			    }
			  }
			}).on('data', function(res) {
				console.log(self.props.pageNumber)
				self.props.pageNumber = self.props.pageNumber + 1
				self.addItemsToFeed(res.hits.hits)
			}).on('error', function(err) {
			  console.log("search error: ", err);
		})
	},
	addItemsToFeed: function(newItems){
		var updated = this.state.items;
		$.map(newItems, function(object){
			updated.push(object._source)
		})
		this.setState({items: updated});
	},
	render: function() {
		return (
			<FeedItems items={this.state.items}/>
		);
	}

});

React.render(
  <Feed />,
  document.getElementById('feed')
);