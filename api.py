import time
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI, PermissionDeniedError, NotFoundError
import anthropic
import os


load_dotenv()

app = Flask(__name__)


openAIKey = os.getenv('OPEN_AI_KEY')
anthropicKey = os.getenv('ANTHROPIC_KEY')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message'] or ""
    model = request.json['model'] or ""
    main_model = request.json['mainModel'] or ""
    if main_model == "openai":
        client = OpenAI(api_key=openAIKey)
        try:
            completion = client.chat.completions.create(model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ])
            response = completion.choices[0].message.content
            return jsonify({'response': response})
        except PermissionDeniedError:
            return jsonify({'response': "Permission denied for the model " + model})
        except NotFoundError as e:
            return jsonify({'response': e.body['message']})
        except:
            return jsonify({'response': "Something went wrong, please try again."})
    elif main_model == "anthropic":
        try:
            client = anthropic.Anthropic(api_key=anthropicKey)

            message = client.messages.create(
                model=model,
                max_tokens=1000,
                temperature=0,
                system="",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": user_message
                            }
                        ]
                    }
                ]
            )
            return jsonify({'response': message.content[0].text})
        except:
            return jsonify({'response': "Something went wrong, please try again."})
    else:
        return jsonify({'response': "Please select a valid model"})

@app.route('/models_openai')
def models_openai():
    client = OpenAI(api_key=openAIKey)
    models = client.models.list()
    models_list = []
    for model in models.data:
        models_list.append(model.id)
        print(model.id)

    return jsonify({'models': models_list})

@app.route('/models_anthropic')
def models_anthropic():
    client = anthropic.Anthropic(api_key=anthropicKey)
    models = client.models.list()
    models_list = []
    for model in models.data:
        models_list.append(model.id)
        print(model.id)

    return jsonify({'models': models_list})

if __name__ == '__main__':
    app.run(debug=True)
