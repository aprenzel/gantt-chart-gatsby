import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {GanttChart} from "../GanttChart"
import '../styles/index.css';

// markup
const IndexPage = (data) => {

  console.log(data.data);

  let j = data.data.jobs.edges.map(edge => {
    
    let s = new Date(edge.node.data.start);
    s.setHours(0);

    let e = new Date(edge.node.data.end);
    e.setHours(0);

    return {
      id:edge.node.data.id,
      start: s,
      end: e,
      resource: parseInt(edge.node.data.id__from_resource_[0])
    };
  });


  let r = data.data.resources.edges.map(edge => {

    return{
      id: edge.node.data.id,
      name: edge.node.data.name
    }
  });

  if(r && j){
    return (
      <main>
        <title>Gantt Chart</title>
        <h1>Welcome to my Gatsby Gantt Chart</h1> 
        <GanttChart jobs={j} resources={r}/> 
      </main>
    )
  }else{
    return (
      <main>
        <title>Gantt Chart</title>
        <h1>Welcome to my Gatsby Gantt Chart</h1> 
        <p>Missing data...</p> 
      </main>
    )
  }
}

export const query = graphql`
      query{
        jobs: allAirtable(filter: {table: {eq: "Jobs"}}) {
          edges {
            node {
              data {
                id
                start
                end
                id__from_resource_
              }
            }
          }
        }

        resources: allAirtable(
          filter: {table: {eq: "Resources"}}
          sort: {fields: [data___name], order: ASC}
          ) {
          edges {
            node {
              data {
                id
                name
              }
            }
          }
        }
      }
  `
  

export default IndexPage

