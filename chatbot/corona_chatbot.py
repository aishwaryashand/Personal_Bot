import json

def m1():
	corona_api = "https://corona-virus-stats.herokuapp.com/api/v1/cases/countries-search?limit=220"
	data = json.loads(corona_api)
	print (data)