# api-uptime-monitor
https://api-uptime-monitor.herokuapp.com/
![Preview Image](/public/images/api_uptime_monitor.png)

## Technical Details

This app is built on a Node/Express back-end. It uses an MVC pattern and views use EJS templating. The database is a MongoDB and I use the Mongoose ORM. API calls are made using the [Axios](https://www.npmjs.com/package/axios) library. Notifications are sent using [Sendgrid](https://sendgrid.com/docs/for-developers/sending-email/).

## Using API Uptime Monitor

The app has three main page types. The 'overview' page contains a table with all APIs currently monitored, and some basic statistics for each. Clicking on the row of an API takes you to the 'details' page of that API. There you can edit the API info, view more detailed statistics over different time frames (last 24 hours, last week, etc.) and add and delete notes on that API. You can also 'pause' the API, which will stop testing it but keep all data, or 'delete' which removes the records of that API alltogether. Third is the 'new api' page, which allows you to start a new monitor. The form there includes expandable sections, where you can add as many fields for headers, params, the body, etc. In this way you can test a wide range of API endpoints. To begin monitoring, the app first makes a test call the endpoint and will only begin monitoring after a successful response. After the monitor is created, unless the monitor is paused, the endpoint will be pinged every five minutes and the response recorded. If valid emails are entered to the monitor, alert emails will be sent after three consecutive failed responses.

## Audience Considerations

This app is intended as a demonstration and therefore doesn't have unique users. Any monitor created can be viewed by any user of the site. It is not advised to monitor APIs that require sensitive api keys or credentials, as that information will be unencrypted in a public database. If this app were to be converted for more serious use, I would make the concept of individual users and any monitor would be attached to these users. The 'overview' page would show only the monitors for the logged-in user. API request data, such as headers would be encrypted so that any sensitive data would have a higher level of security.
