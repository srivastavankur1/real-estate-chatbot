from fastapi import APIRouter, Request
from pydantic import BaseModel
from uuid import uuid4
from app.services.mongo_service import append_message
from app.llm import get_filter_chain, get_intent_chain
from app.services.property_filter import filter_properties
from app.services.mongo_service import (
    get_session,
    save_session,
    merge_filters
)

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: str | None = None



@router.post("/")
async def chat(request: ChatRequest, fastapi_request: Request):

    if not request.user_id:
        return {"error": "Authentication required"}

    session_id = request.session_id or str(uuid4())

    #get intent
    intent_chain = get_intent_chain()
    intent_result = intent_chain.invoke({"message": request.message})
    intent = intent_result.get("intent", "casual")

    existing_session = get_session(session_id)
    old_filters = existing_session.get("filters", {}) if existing_session else {}

    all_properties = fastapi_request.app.state.properties

    # GREETING
    if intent == "greeting":
        reply = "Hello! I'm your real estate assistant. How can I help you today?"
        results = []
        merged_filters = old_filters

    # OUT OF DOMAIN
    elif intent == "out_of_domain":
        reply = "I'm a real estate assistant. I can help you find properties based on location, budget, bedrooms and amenities."
        results = []
        merged_filters = old_filters

    # CASUAL
    elif intent == "casual":
        reply = "I'm here to help you find the perfect property. Tell me your preferred location or budget."
        results = []
        merged_filters = old_filters

    # PROPERTY SEARCH

    else:
        filter_chain = get_filter_chain()
        new_filters_obj = filter_chain.invoke(request.message)
        new_filters = new_filters_obj.dict(exclude_none=True)

        if new_filters:
            merged_filters = merge_filters(old_filters, new_filters)
            save_session(request.user_id, session_id, merged_filters, request.message)

            results = filter_properties(merged_filters, all_properties)

            if len(results) > 0:
                reply = f"I found {len(results)} property(s) matching your search."
            else:
                query = request.message.lower()
                query_words = query.split()

                results = [
                    p for p in all_properties
                    if any(word in p["title"].lower() for word in query_words)
                ]

                if len(results) > 0:
                    reply = f"I couldn’t find an exact match, but here are {len(results)} similar properties you might like."
                else:
                    reply = "Sorry, no properties matched your criteria."

        else:
            query = request.message.lower()
            query_words = query.split()

            results = [
                p for p in all_properties
                if any(word in p["title"].lower() for word in query_words)
            ]

            if len(results) > 0:
                reply = f"I found {len(results)} property(s) matching your request."
            else:
                reply = "I'm here to help you find properties Tell me location, budget, or number of bedrooms."

            merged_filters = old_filters


    append_message(session_id, {
        "sender": "user",
        "text": request.message
    })

    append_message(session_id, {
        "sender": "bot",
        "text": reply,
        "properties": results
    })

    return {
        "session_id": session_id,
        "reply": reply,
        "active_filters": merged_filters,
        "properties": results
    }



@router.get("/sessions/{user_id}")
def get_user_sessions(user_id: str):
    from app.services.mongo_service import get_sessions_by_user
    return {
        "sessions": get_sessions_by_user(user_id)
    }

@router.get("/history/{session_id}")
def get_history(session_id: str):
    from app.services.mongo_service import get_chat_history
    return {
        "messages": get_chat_history(session_id)
    }
