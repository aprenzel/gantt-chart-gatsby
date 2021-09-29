import React from 'react';

export class GanttChart extends React.Component {

    names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    constructor(props) {

        super(props);       

        this.state = {
            dateFrom: new Date(2021,5,1),
            dateTo: new Date(2021,5,30),
        };
    }
      
    render(){
        
        var month = new Date(this.state.dateFrom.getFullYear(), this.state.dateFrom.getMonth(), 1);
       
        let grid_style = `100px 1fr`;

        let firstRow = this.initFirstRow(month);
        let secondRow = this.initSecondRow(month);
        let ganttRows = this.initGanttRows(month);

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


     initFirstRow = function(month){
      
          let elements = []; let i = 0;

          elements.push(<div key={"fr"+(i++)} className="gantt-row-resource"></div>);
         
          elements.push(<div key={"fr"+(i++)} className="gantt-row-period"><div className="period">{this.names[month.getMonth()] + " " + month.getFullYear()}</div></div>);
            
          return elements;
    }


    initSecondRow = function(month){

        let elements = []; let i=0;

        elements.push(<div key={"sr"+(i++)} style={{borderTop : 'none'}} className="gantt-row-resource"></div>);

        let days = [];

        var f_om = new Date(month);
        var l_om = new Date(month.getFullYear(), month.getMonth()+1, 0);
      
        var date = new Date(f_om);

        for(date; date <= l_om; date.setDate(date.getDate()+1)){

            days.push(<div key={"sr"+(i++)} style={{borderTop: 'none'}} className="gantt-row-period period">{date.getDate()}</div>);
        }

        elements.push(<div key={"sr"+(i++)} style={{border: 'none'}} className="gantt-row-period">{days}</div>);

        return elements;

    }

    initGanttRows(month){

        let elements = []; let i=0;

        this.props.resources.forEach(resource => {

            elements.push(<div key={"gr"+(i++)} style={{borderTop : 'none'}} className="gantt-row-resource">{resource.name}</div>);
    
            let cells = [];

            var f_om = new Date(month);
            var l_om = new Date(month.getFullYear(), month.getMonth()+1, 0);
        
            var date = new Date(f_om);

            for(date; date <= l_om; date.setDate(date.getDate()+1)){

                let cell_jobs = this.props.jobs.filter((job) => job.resource == resource.id && job.start.getTime() == date.getTime());

                cells.push(<ChartCell key={"gr"+(i++)} resource={resource} date={new Date(date)} jobs={cell_jobs}/>);
            }

            elements.push(<div key={"gr"+(i++)} style={{border: 'none'}} className="gantt-row-period">{cells}</div>);

        });

        return elements;

    }

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
      
      this.state = {

        jobs: props.jobs
      }
    }
 
    render(){

      let jobElements = this.props.jobs.map((job) => this.getJobElement(job));

      return (
        <div 
            style={{borderTop: 'none', borderRight: 'none', backgroundColor: (this.props.date.getDay()==0 || this.props.date.getDay()==6) ? "whitesmoke" : "white" }} 
            className="gantt-row-item">
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
        >

        </div>
        );
    }

    dayDiff(d1, d2){
    
        var diffTime = Math.abs(d2 - d1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }
}