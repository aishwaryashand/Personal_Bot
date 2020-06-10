#!usr/bin/python3
from flask import Flask, render_template
from chatbot import chat
from flask import request
import json
from corona_chatbot import m1

app = Flask(__name__)
STATE = ""

@app.route('/')
def index():
	return render_template('show.html')

@app.route('/getpythondata/<jsdata>')
def user_msg(jsdata):
  msg,tag = chat(jsdata)
  # print(msg+tag)
  if tag in ["greeting","goodbye","name","hours"]:
  	STATE = "chatbot"
  	if tag == "greeting":
  		msg+="<br>I can tell you about some facts/myths or about this pandemic."
  	return msg
  elif tag == "corona":
	  STATE = "corona_chatbot"
	  return msg
	  # for x in jsdata.lower().split():
  	# 	if x in ["pandemic","covid-19","corona","coronavirus","virus"]:
	  # 		print(msg)
	  # 		return "First tell me the what you want to know about, <br> 1.) Total Cases 2.) Total Deaths 3.) Total Recovered cases"
  	# 	elif x in ["cases","deaths","recovered","1","2","3"]:
  	# 		STATE = "corona_chatbot"
  	# 		print(msg)
  	# 		return "Tell me the country name now"
  elif tag == "facts":
  	return msg
  elif tag == "none":
  	return "Umm, I didn't get you.." 

if __name__ == '__main__':
    app.run(host='localhost', debug=True)
