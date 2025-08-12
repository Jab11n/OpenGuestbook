<img width="1500" height="500" alt="OpenGuestbook" src="https://github.com/user-attachments/assets/eeb5a1e3-2933-42c3-918e-8d6ba3fb2804" />

# OpenGuestbook

A FOSS self-hostable guestbook software for whatever you want. And for people to sign (duh).

## Features

-   Easy setup wizard
-   Customizable with preset themes and custom CSS
-   Leave a name, comment, and website
-   Restrict words from being included in names, comments, websites
-   Self-hostable (obviously)

## Setup Guide

1. Clone the repo: `git clone https://github.com/jab11n/openguestbook`
2. Run it: `gunicorn app:app` (if you don't have gunicorn, run `pip install gunicorn`) Or if you're going to be doing development run `flask --debug`
3. Follow the setup wizard
4. You can put it on your own domain with Cloudflare Tunnels or other things

Enjoy your guestbook 👍 and put it on your website and send it to your friends to tell them to sign it

## Access admin panel

During setup, you'll get your secret key. To access settings visit `/admin` and enter the admin key (you should have saved it, if not it's in your config.json file)

## Why?

I'm not sure. It seemed like a cool thing to make and guestbooks are going out of style, so I decided to make it.
