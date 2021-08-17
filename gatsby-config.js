module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "Gatsby Gantt Chart",
  },
  plugins: [
  
  `gatsby-plugin-gatsby-cloud`,

  {
    resolve: `gatsby-source-airtable`,
    options: {
      apiKey: `keyofGe507yAlwZXv`, // may instead specify via env, see below
      concurrency: 5, // default, see using markdown and attachments for more information
      tables: [
        {
          baseId: `apprFBK5EHobJNylY`,
          tableName: `Jobs`,    
        },
        {
          baseId: `apprFBK5EHobJNylY`,
          tableName: `Resources`,
        }
      ]
    }
  }

  ],
};
