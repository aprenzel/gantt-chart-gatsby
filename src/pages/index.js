import * as React from "react"
import {GanttChart} from "../GanttChart"
import '../styles/index.css';

var j = [
  {id: "j1", start: new Date("2021/6/1"), end: new Date("2021/6/4"), resource: 1},
  {id: "j2", start: new Date("2021/6/4"), end: new Date("2021/6/13"), resource: 2},
  {id: "j3", start: new Date("2021/6/13"), end: new Date("2021/6/21"), resource: 3},
];

var r = [{id:1, name: "Task 1"}, {id:2, name: "Task 2"}, {id:3, name: "Task 3"}, {id:4, name: "Task 4"}];


// markup
const IndexPage = () => {
  return (
    <main>
      <title>Gantt Chart</title>
      <h1>Welcome to my Gatsby Gantt Chart</h1> 
      <GanttChart jobs={j} resources={r}/> 
    </main>
  )
}

export default IndexPage
