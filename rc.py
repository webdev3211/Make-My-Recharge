import requests 
  
# api-endpoint 
URL = "https://compilert.000webhostapp.com/FetchEmail/mydataapi.php"
  
r = requests.get(url = URL) 
data = r.json() 

print(data)

