# api-uptime-monitor
https://api-uptime-monitor.herokuapp.com/

This project started as a personal tool. I was working on an Elasticsearch API and needed to be alerted when it went down. After building something that worked for my purposes, I began thinking it would be interesting to work more on it - I wanted to generalize it to work on any type API. I wanted to put some love into the UI and make something that looked and felt good to use. I wanted to do so focusing on the base technologies - Node/Express and Vanilla Javascript. Thus API Uptime Monitor was born.

![Preview Image](/public/images/api_uptime_monitor.png)

## Technical Details

This app is built on a Node/Express back-end. It uses an MVC pattern and views use EJS templating. The database is a MongoDB and I use the Mongoose ORM. API calls are made using the [Axios](https://www.npmjs.com/package/axios) library. Notifications are sent using [Sendgrid](https://sendgrid.com/docs/for-developers/sending-email/).
