var Diagram = React.createClass({displayName: "Diagram",
    render: function () {
      return (
        React.createElement("div", null, 
            React.createElement(YoungTabluex, {key: "1", number: 1, syt: this.props.syt1}), 
            React.createElement(YoungTabluex, {key: "2", number: 2, syt: this.props.syt2})
        )
      );
    }
});

var YoungTabluex = React.createClass({displayName: "YoungTabluex",
  render: function() {
    var rows = this.props.syt.map( function(columns, i) {
        return (
            React.createElement(YTRow, {key: i, columns: columns, color: colors[i]})
        );
    });
    return (
      React.createElement("div", {className: "young"}, 
        React.createElement("span", null, "  ", 'SYT ' + this.props.number, " "), 
        rows
      )
    );
  }
});


var YTRow = React.createClass({displayName: "YTRow",
  render: function() {
    var color = this.props.color;
    var cells = this.props.columns.map(function(number, i) {
        return (
            React.createElement(YTCell, {number: number, key: i, color: color})
        );
    });
    return (
      React.createElement("div", {className: "ytRow"}, 
        cells
      )
    );
  }
});

var YTCell = React.createClass({displayName: "YTCell",
  render: function() {
    return (
      React.createElement("div", {className: "ytBox", style: {borderColor : this.props.color}}, 
        this.props.number
      )
    );
  }
});
