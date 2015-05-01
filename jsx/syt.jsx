var Diagram = React.createClass({
    render: function () {
      return (
        <div>
            <YoungTabluex key="1"  number = {1} syt = {this.props.syt1}  />
            <YoungTabluex key="2" number = {2} syt = {this.props.syt2}  />
        </div>
      );
    }
});

var YoungTabluex = React.createClass({
  render: function() {
    var rows = this.props.syt.map( function(columns, i) {
        return (
            <YTRow key={i} columns = {columns} color={colors[i]} />
        );
    });
    return (
      <div className='young'>
        <span>  {this.props.number === 0 ? 'Recording Tableaux' : 'Insertion Tableaux' } </span>
        {rows}
      </div>
    );
  }
});


var YTRow = React.createClass({
  render: function() {
    var color = this.props.color;
    var cells = this.props.columns.map(function(number, i) {
        return (
            <YTCell number={number} key={i} color={color}/>
        );
    });
    return (
      <div className='ytRow'>
        {cells}
      </div>
    );
  }
});

var YTCell = React.createClass({
  render: function() {
    return (
      <div className='ytBox' style={{borderColor : this.props.color }} >
        {this.props.number}
      </div>
    );
  }
});
