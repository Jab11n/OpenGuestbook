from flask import Flask, jsonify, request, send_from_directory, render_template
import requests
import re
import json
import os
import time
from datetime import datetime
import sqlite3

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
        "restricted_words": [],
        "access": "link",
        "key": "CHANGEME",
    }
    with open ("config.json", "w") as f:
        json.dump(data, f, indent=4)
else:
    with open("config.json", "r") as f:
        data = json.load(f)
    setup = data.get("key", "CHANGEME") != "CHANGEME"

conn = sqlite3.connect('guestbook.db')
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS guestbook (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        comment TEXT,
        website TEXT,
        time INTEGER NOT NULL
    )
''')
conn.commit()

def add_entry(name, comment, website):
    conn = sqlite3.connect('guestbook.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO guestbook (name, comment, website, time) VALUES (?, ?, ?, ?)', (name, comment, website, time.time()))
    conn.commit()

def get_entries(page=1, page_size=20):
    conn = sqlite3.connect('guestbook.db')
    cursor = conn.cursor()
    offset = (page - 1) * page_size
    cursor.execute('SELECT * FROM guestbook ORDER BY id DESC LIMIT ? OFFSET ?', (page_size + 1, offset))
    rows = cursor.fetchall()
    conn.close()
    more = len(rows) > page_size
    return rows[:page_size], more

def delete_entry(entry_id):
    conn = sqlite3.connect('guestbook.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM guestbook WHERE id = ?', (entry_id,))
    conn.commit()

@app.route('/')
def guestbook():
    if setup:
        with open("config.json", "r") as f:
            data = json.load(f)
            pubData = {"name": data['name'], "description": data['description'], "theme": data['theme'], "custom_theme": data['custom_theme'], "website": data['website'], "fields": data['fields'], "char_limits": data['char_limits']}
            return render_template('guestbook.html', data=pubData, theme=data["theme"])
    else:
        with open("config.json", "r") as f:
            data = json.load(f)
            return render_template('setup.html', key=data['key'])

@app.route('/admin')
def admin():
    token = request.cookies.get("Admin")
    if os.path.isfile("config.json"):
        with open("config.json") as f:
            config = json.load(f)
        if token == config["key"]:
            return render_template('admin.html', theme=config['theme'], data=config)
        elif token == None:
            return render_template('admin-login.html', theme=data['theme'])
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

@app.route('/api/signs', methods=['GET'])
def api_signs():
    page = request.args.get('page', default=1, type=int)
    entries, more = get_entries(page=page, page_size=20)
    return jsonify({
        "entries": entries,
        "last": not more
    })

@app.route('/api/sign', methods=['POST'])
def api_sign():
    reqData = request.get_json()
    with open("config.json") as f:
        config = json.load(f)
    if not reqData or not reqData.get('name'):
        return jsonify({"status": "error", "message": "Name is required :("}), 400
    elif (
        any(word.lower() in reqData.get('name').lower() for word in config['restricted_words']) or
        any(word.lower() in (reqData.get('comment')).lower() for word in config['restricted_words']) or
        any(word.lower() in (reqData.get('website')).lower() for word in config['restricted_words'])
    ):
        return jsonify({"status": "error", "message": "this contains blocked words :("}), 403
    
    add_entry(
        name=reqData['name'],
        comment=reqData.get('comment') or None if "comment" in config['fields'] else None,
        website=reqData.get('website') or None if "website" in config['fields'] else None
    )
    return jsonify({"status": "ok", "message": "Entry added! :D"}), 201

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    with open("config.json") as f:
        config = json.load(f)
    if request.headers.get("Authorization") == config['key']:
        return jsonify({"status": "ok", "message": "yeah that was the right key"}), 200
    else:
        return jsonify({"status": "not ok", "message": "no that's the wrong key"}), 403

@app.route('/api/admin', methods=['POST'])
def update_admin():
    data = request.get_json()
    with open("config.json", "w") as f:
        json.dump(data, f, indent=4)
    return jsonify({"status": "ok", "message": "updated settings ok"}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
