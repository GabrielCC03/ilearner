from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

class MongoConnection:

    database_name = 'ilearner'

    def __init__(self):
        self.client = MongoClient(os.getenv('MONGO_URI'), server_api=ServerApi('1'))
        self.db = self.client[self.database_name]

    def get_client(self):
        return self.client
    
    def get_database(self):
        return self.db
    
    def get_collection(self, collection_name):
        return self.db[collection_name]
    
    def close(self):
        self.client.close()

    def get_all_collections(self):
        return self.db.list_collection_names()
    
    def get_all_databases(self):
        return self.client.list_database_names()