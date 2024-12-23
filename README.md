# Setting up the application.

Step by step guide line to run the chat application

## API Key

Enter the API keys in the .env file

OPEN_AI_KEY = "API_KEY"
ANTHROPIC_KEY = "API_KEY"

## Run flask application

Enter `flask run --debugger` to run the flask app
This runs on [http://localhost:5000/](http://localhost:3000/)

Apis in flask server

Gets a models from open ai - GET Request
[http://localhost:5000/models_openai](http://localhost:5000/models_openai)

Gets a models from anthropic - GET Request
[http://localhost:5000/models_anthropic](http://localhost:5000/models_anthropic)

Posts a query to the model - POST Request
[http://localhost:5000/chat](http://localhost:5000/chat)

## Run react server

Enter `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000/chat](http://localhost:3000/chat) to view it in your browser.
