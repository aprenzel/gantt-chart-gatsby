import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import {GanttChart} from "../GanttChart"
import { useState, useEffect } from 'react';
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

  const [resources, setResources] = useState(r);
  const [jobs, setJobs] = useState(j);

  useEffect(() => {
    const interval = setInterval(() => { 
      
      let jobsLoaded = (j) => { setJobs(j) };
      let resourcesLoaded = (r) => { setResources(r) };

      loadDataFromAirtable(jobsLoaded, resourcesLoaded);
    
    }, 60000);  

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  if(resources && jobs){
    return (
      <main>
        <title>Gantt Chart</title>
        <h1>Welcome to my Gatsby Gantt Chart</h1> 
        <GanttChart jobs={jobs} resources={resources}/> 
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

function loadDataFromAirtable(onJobsLoaded, onResourcesLoaded){

  let j,r;

  fetch('https://api.airtable.com/v0/apprFBK5EHobJNylY/Jobs?maxRecords=3&view=Grid%20view',{headers: {"Authorization": "Bearer keyofGe507yAlwZXv"}})
  .then(response => response.json())
  .then(data => {

    j = data.records.map(record => {

      let s = new Date(record.fields.start);
      s.setHours(0);
  
      let e = new Date(record.fields.end);
      e.setHours(0);

       return {
        id: record.fields.id,
        start: s,
        end: e,
        resource: parseInt(record.fields['id (from resource)'][0])
       };
    });

    onJobsLoaded(j);
  });


  fetch('https://api.airtable.com/v0/apprFBK5EHobJNylY/Resources?maxRecords=3&view=Grid%20view',{headers: {"Authorization": "Bearer keyofGe507yAlwZXv"}})
  .then(response => response.json())
  .then(data => {

    r = data.records.map(record => {

       return {
        id: record.fields.id,
        name: record.fields.name
       };
    });

    onResourcesLoaded(r);
  });
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

