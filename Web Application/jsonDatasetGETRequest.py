import requests
url = "https://api.npoint.io/02a6606bd83177762972"
response = requests.get(url).json()
print(response)
# testing the api only, this will not be used in the web application, as we can see from the output it was successful
