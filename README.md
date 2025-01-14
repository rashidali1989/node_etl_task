# node_etl_task

clone command
git clone https://github.com/rashidali1989/node_etl_task.git


Install dependencies:
npm install

Start the server:
npm run dev

This is will run this test project locally and you can test the functionality. Be default it will run on this port
localhost:3000


API Endpoints

POST /api/fetch-save-universities
This endpoint fetches university data from the external API, validates the data and format, and stores it as a CSV file.

GET /api/download-csv
This endpoint allows users to download the stored CSV file containing the university data.

The cron is set up to refresh data every midnight and the same function is also provided in the POST API above.

-----
Expansion-- saving in db
For saving data in db we can set up another cron that will get paginated data as the data is very huge and we can do batch insertions this way and all of this can happen in the background. I have demonstrated code for that in services/dbSaving file.

