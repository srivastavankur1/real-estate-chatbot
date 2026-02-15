from pymongo import MongoClient
from bson import ObjectId
from app.config import MONGO_URI
from datetime import datetime


client = MongoClient(MONGO_URI)
db = client["real_estate_chatbot"]

# Collections
session_collection = db["sessions"]
user_collection = db["users"]


# SESSION

def get_session(session_id: str):
    return session_collection.find_one({"session_id": session_id})


def save_session(user_id: str, session_id: str, filters: dict, last_message: str):
    session_collection.update_one(
        {"session_id": session_id},
        {
            "$set": {
                "user_id": user_id,
                "filters": filters,
                "last_message": last_message,
                "updated_at": datetime.utcnow()
            }
        },
        upsert=True
    )

def get_sessions_by_user(user_id: str):
    return list(
        session_collection.find(
            {"user_id": user_id},
            {"_id": 0, "session_id": 1, "last_message": 1}
        ).sort("updated_at", -1)
    )



def merge_filters(old_filters: dict, new_filters: dict):
    merged = old_filters.copy()
    merged.update(new_filters)
    return merged


# USERS 
def create_user(name, email, password):
    return user_collection.insert_one({
        "name": name,
        "email": email,
        "password": password,
        "saved_properties": []
    })


def get_user_by_email(email):
    return user_collection.find_one({"email": email})


def get_user_by_id(user_id):
    return user_collection.find_one({"_id": ObjectId(user_id)})


def save_property_for_user(user_id, property_data):
    user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"saved_properties": property_data}}
    )

def get_saved_properties(user_id):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        return user.get("saved_properties", [])
    return []


def append_message(session_id: str, message: dict):
    session_collection.update_one(
        {"session_id": session_id},
        {"$push": {"messages": message}},
        upsert=True
    )

def get_chat_history(session_id: str):
    session = session_collection.find_one({"session_id": session_id})
    if session:
        return session.get("messages", [])
    return []
