from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = "mongodb+srv://dbAdmin:xGQgWug04CZgePWi@demo.z6qv048.mongodb.net/?retryWrites=true&w=majority&appName=demo"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    print(client.list_database_names()) # Should print ['admin', 'ilearner', 'local']
except Exception as e:
    print(e)