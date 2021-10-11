import React from 'react';

/*extended version of the chart, features:
 *select starting month and end month
 *drag and drop jobs
*/
export class GanttChart extends React.Component {
  
    constructor(props) {
  
      super(props);
     
      this.state = {
        dateFrom: new Date(2021,5,24),
        dateTo: new Date(2021,7,31),
      };
    }
  
    render() {
      return (
        <div>
              
          <Settings dateFrom={this.state.dateFrom} dateTo={this.state.dateTo}
            onDateFromChanged={(date) => {this.setState({dateFrom:date});}} 
            onDateToChanged={(date) => {this.setState({dateTo:date});}}
          />
          
          <Chart jobs={this.props.jobs} resources={this.props.resources} dateFrom={this.state.dateFrom}
            dateTo={this.state.dateTo} onUpdateJob={this.props.onUpdateJob}/>
          
        </div>
      );
    }
}

class Settings extends React.Component {

    constructor(props) {
  
      super(props);
  
      this.state = {
        dateFrom: props.dateFrom,
        dateTo: props.dateTo,
        monthFrom: props.dateFrom.getMonth(),
        monthTo: props.dateTo.getMonth(),
        yearFrom: props.dateFrom.getFullYear(),
        yearTo: props.dateTo.getFullYear(),
        valid: true
      };
    }
  
    render() {
  
        let fields1;
        let fields2;
    
        let years = [];

        for(let i=2000; i<=2100; i++){
            years.push(<option key={i} value={i}>{i}</option>);
        }
        
        fields1 =  (
        <div>
            <select className={this.state.valid ? "select_valid" : "select_invalid"} value={this.state.yearFrom} id="from-select-year" name="from-select-year" onChange={this.changeYearFrom}>
            {years}    
            </select>

            <select className={this.state.valid ? "select_valid" : "select_invalid"} value={this.state.monthFrom} id="from-select-month" name="from-select-month" onChange={this.changeMonthFrom}>
            <option value="0">Jan</option>
            <option value="1">Feb</option>
            <option value="2">Mar</option>
            <option value="3">Apr</option>
            <option value="4">May</option>
            <option value="5">Jun</option>
            <option value="6">Jul</option>
            <option value="7">Aug</option>
            <option value="8">Sep</option>
            <option value="9">Okt</option>
            <option value="10">Nov</option>
            <option value="11">Dec</option>   
            </select>
        </div> 
        );

        fields2 = (
        <div>
            <select className={this.state.valid ? "select_valid" : "select_invalid"} value={this.state.yearTo} id="to-select-year" name="to-select-year" onChange={this.changeYearTo}>
            {years}    
            </select>

            <select className={this.state.valid ? "select_valid" : "select_invalid"} value={this.state.monthTo} id="to-select-month" name="to-select-month" onChange={this.changeMonthTo}>
            <option value="0">Jan</option>
            <option value="1">Feb</option>
            <option value="2">Mar</option>
            <option value="3">Apr</option>
            <option value="4">May</option>
            <option value="5">Jun</option>
            <option value="6">Jul</option>
            <option value="7">Aug</option>
            <option value="8">Sep</option>
            <option value="9">Okt</option>
            <option value="10">Nov</option>
            <option value="11">Dec</option>   
            </select>
        </div> 
        );
    
        return (
            <div id="gantt-settings">
        
            <fieldset id="select-from">
            <legend>From</legend>
            {fields1}
            </fieldset>
    
            <fieldset id="select-to">
            <legend>To</legend>
            {fields2}
            </fieldset>
            </div>
        );
    }
  
  
    changeYearFrom = y => {
  
      let v = parseInt(y.target.value);
      let d = new Date(v, this.state.monthFrom, 1);

      if(d <= this.state.dateTo){
  
        this.props.onDateFromChanged(d);
        this.setState({yearFrom: v, dateFrom: d, valid: true});

      }else{
        this.setState({yearFrom: v, dateFrom: d, valid: false});
      }
    }
  
    changeYearTo = y => {
  
      let v = parseInt(y.target.value);
      let d = new Date(v, this.state.monthTo, 1);

      this.setState({yearTo: v});
  
      if(this.state.dateFrom <= d){

        this.props.onDateToChanged(d);
        this.setState({yearTo: v, dateTo: d, valid: true});

      }else{

        this.setState({yearTo: v, dateTo: d, valid: false});
      }
    }
  
    changeMonthFrom = m => {
  
      let v = parseInt(m.target.value);
      let d = new Date(this.state.yearFrom, v, 1);
  
      if(d <= this.state.dateTo){

        this.props.onDateFromChanged(d);
        this.setState({monthFrom: v, dateFrom : d, valid: true});

      }else{
        this.setState({monthFrom: v, dateFrom : d, valid: false});
      }
    }
  
    changeMonthTo = m => {
  
      let v = parseInt(m.target.value);
      let d = new Date(this.state.yearTo, v, 1);
  
      if(this.state.dateFrom <= d){

        this.props.onDateToChanged(d);
        this.setState({monthTo: v, dateTo: d, valid: true});

      }else{
        this.setState({monthTo: v, dateTo: d, valid: false});
      }
    }
}  

class Chart extends React.Component {

    constructor(props) {

        super(props);      

        this.state = {

            jobs: props.jobs,
            resources: props.resources
        };
    }
      
    names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    render(){
        
        var first_month = new Date(this.props.dateFrom.getFullYear(), this.props.dateFrom.getMonth(), 1);
        var last_month = new Date(this.props.dateTo.getFullYear(), this.props.dateTo.getMonth(), 1);
    
        var n_months = this.monthDiff(first_month, last_month)+1;
        let grid_style = `100px repeat(${n_months},1fr)`;

        let firstRow = this.initFirstRow(first_month, last_month);
        let secondRow = this.initSecondRow(first_month, last_month);
        let ganttRows = this.initGanttRows(first_month, last_month);

        return (
        
            <div className="gantt-chart">
                <div id="gantt-container" style={{gridTemplateColumns : grid_style}}>
                    {firstRow}
                    {secondRow}
                    {ganttRows}
                </div>
            </div>
        );
     }


     initFirstRow = function(first_month, last_month){
      
          let elements = []; let i = 0;

          elements.push(<div key={"fr"+(i++)} className="gantt-row-resource"></div>);
         
          var month = new Date(first_month);
  
          for(month; month <= last_month; month.setMonth(month.getMonth()+1)){
              
            elements.push(<div key={"fr"+(i++)} className="gantt-row-period"><div className="period">{this.names[month.getMonth()] + " " + month.getFullYear()}</div></div>);
            
          }

          return elements;
    }


    initSecondRow = function(first_month, last_month){

        let elements = []; let i=0;

        elements.push(<div key={"sr"+(i++)} style={{borderTop : 'none'}} className="gantt-row-resource"></div>);

        var month = new Date(first_month);
  
        for(month; month <= last_month; month.setMonth(month.getMonth()+1)){

            let days = [];

            var f_om = new Date(month);
            var l_om = new Date(month.getFullYear(), month.getMonth()+1, 0);
          
            var date = new Date(f_om);

            for(date; date <= l_om; date.setDate(date.getDate()+1)){

                days.push(<div key={"sr"+(i++)} style={{borderTop: 'none'}} className="gantt-row-period period">{date.getDate()}</div>);
            }

            elements.push(<div key={"sr"+(i++)} style={{border: 'none'}} className="gantt-row-period">{days}</div>);

        }

        return elements;

    }

    initGanttRows(first_month, last_month){

        let elements = []; let i=0;

        this.props.resources.forEach(resource => {

            elements.push(<div key={"gr"+(i++)} style={{borderTop : 'none'}} className="gantt-row-resource">{resource.name}</div>);

            var month = new Date(first_month);
    
            for(month; month <= last_month; month.setMonth(month.getMonth()+1)){

                let cells = [];

                var f_om = new Date(month);
                var l_om = new Date(month.getFullYear(), month.getMonth()+1, 0);
            
                var date = new Date(f_om);

                for(date; date <= l_om; date.setDate(date.getDate()+1)){

                    let cell_jobs = this.props.jobs.filter((job) => job.resource == resource.id && job.start.getTime() == date.getTime());

                    cells.push(<ChartCell key={"gr"+(i++)} resource={resource} date={new Date(date)} jobs={cell_jobs} onDropJob={this.dropJob}/>);
                }

                elements.push(<div key={"gr"+(i++)} style={{border: 'none'}} className="gantt-row-period">{cells}</div>);

            }
        });

        return elements;

    }


    dropJob = (id, newResource, newDate) => {

        let job = this.props.jobs.find(j => j.id == id );

        let newJob = {};
        newJob.resource = newResource;
       
        let d = this.dayDiff(job.start, job.end); 
        let end = new Date(newDate);
        end.setDate(newDate.getDate()+d);

        newJob.start = newDate;
        newJob.end = end;

        this.props.onUpdateJob(id, newJob);
    };

       
    formatDate = function(d){

        return d.getFullYear()+"-"+this.zeroPad(d.getMonth()+1)+"-"+this.zeroPad(d.getDate());
    
    }

    zeroPad = function(n){

        return n<10 ? "0"+n : n;

    }

    monthDiff(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    dayDiff(d1, d2){
    
        var diffTime = Math.abs(d2 - d1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }

}

class ChartCell extends React.Component {

    constructor(props) {

      super(props);
    }
 
    render(){

      let jobElements = this.props.jobs.map((job) => this.getJobElement(job));

      let dragOver = (ev) => {ev.preventDefault()};

      let drop = (ev) => {

        ev.preventDefault(); 

        let data = ev.dataTransfer.getData("job");  

        this.props.onDropJob(data, this.props.resource.id, this.props.date)

      };

      return (
        <div 
            style={{borderTop: 'none', borderRight: 'none', backgroundColor: (this.props.date.getDay()==0 || this.props.date.getDay()==6) ? "whitesmoke" : "white" }} 
            className="gantt-row-item" onDragOver={dragOver} onDrop={drop}>
            {jobElements}
        </div>
      );
    }

    getJobElement(job){

        let d = this.dayDiff(job.start, job.end);

        return (
        <div    style={{width: "calc("+(d*100)+"% + "+ d + "px)"}} 
                className="job" 
                id={job.id} 
                key={job.id}
                draggable="true"
                onDragStart={this.dragStart}>

        </div>
        );
    }

    dragStart = (ev) => { ev.dataTransfer.setData("job", ev.target.id);}

    dayDiff(d1, d2){
    
        var diffTime = Math.abs(d2 - d1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }
}