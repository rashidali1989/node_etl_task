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