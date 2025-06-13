from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from typing import Optional

class MongoConnection:
    '''
    Singleton MongoDB connection class for the iLearner application
    '''
    _instance: Optional['MongoConnection'] = None
    database_name = 'ilearner'

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoConnection, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'client'):
            self._connect()

    def _connect(self):
        '''
        Establish connection to MongoDB using environment variables
        '''
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
        self.client = MongoClient(mongo_uri, server_api=ServerApi('1'))
        self.db = self.client[self.database_name]

    def get_client(self):
        '''
        Get the MongoDB client instance
        '''
        return self.client
    
    def get_database(self):
        '''
        Get the database instance
        '''
        return self.db
    
    def get_collection(self, collection_name: str):
        '''
        Get a specific collection from the database
        '''
        return self.db[collection_name]
    
    def close(self):
        '''
        Close the MongoDB connection
        '''
        if hasattr(self, 'client'):
            self.client.close()

    def get_all_collections(self):
        '''
        Get list of all collection names in the database
        '''
        return self.db.list_collection_names()
    
    def get_all_databases(self):
        '''
        Get list of all database names
        '''
        return self.client.list_database_names()

# Create a single instance to be used throughout the application
mongo_connection = MongoConnection()