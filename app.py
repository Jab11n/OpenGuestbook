from flask import Flask, request, send_from_directory, render_template
import requests
import re
import json
import os
import time
from datetime import datetime

app = Flask(__name__, static_folder="static", template_folder="templates")

setup = False

if not os.path.isfile("config.json"):
    print("Found no pre-existing config file. Running setup.")
    setup = False
    data = {
        "name": "My Guestbook",
        "description": "No description provided.",
        "theme": "retro-space",
        "custom_theme": "",
        "website": "",
        "fields": ["name", "comment", "website"],
        "char_limits": [20, 200, 40],
        "access": "link",
        "key": "CHANGEME",
    }
    with open ("config.json", "w") as f:
        json.dump(data, f, indent=4)
else:
    with open("config.json", "r") as f:
        data = json.load(f)
    setup = data.get("key", "CHANGEME") != "CHANGEME"


@app.route('/')
def guestbook():
    if setup:
        with open("config.json", "r") as f:
            data = json.load(f)
            pubData = {"name": data['name'], "description": data['description'], "theme": data['theme'], "custom_theme": data['custom_theme'], "website": data['website'], "fields": data['fields'], "char_limits": data['char_limits']}
            return render_template('guestbook.html', data=pubData)
    else:
        with open("config.json", "r") as f:
            data = json.load(f)
            return render_template('setup.html', key=data['key'])

@app.route('/admin', methods=['POST'])
def admin():
    token = request.cookies.get("Admin")
    if os.path.isfile("config.json"):
        with open("config.json") as f:
            config = json.load(f)
        if token == config["key"]:
            return render_template('admin.html')
        else:
            return "Unauthorized", 403

@app.route('/api/setup', methods=['POST'])
def api_setup():
    global setup
    if not setup:
        data = request.get_json()
        with open("config.json", "w") as f:
            json.dump(data, f, indent=4)
        setup = True
        return "Setup complete", 200
    
if __name__ == '__main__':
    app.run(debug=True)
