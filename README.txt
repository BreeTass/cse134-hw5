Astro SSG Exercise:

Folder path: /ssg-exercise/
Pages to preview: about_me.astro and index.astro

Design note:

A visitor may want to see fun facts at my Web Component Demo page. If they do not have JavaScript enabled, they see a box with the text "Enable JavaScript to load live data from this widget." With JavaScript enabled, they may click the 'Random Fact' button or 'Today's Fact.' Clicking one of these buttons requests data from 'https://uselessfacts.jsph.pl/' using a GET request. The p tag in the DOM containing the status message changes to 'Status: Request Started.' On success, it changes to 'Status: Request Successful.' On failure, it changes to 'Status: Request Failed.' Once the data is successfully fetched, the p tag in the DOM containing the message updates to show the message.