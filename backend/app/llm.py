from langchain_google_genai import ChatGoogleGenerativeAI
from app.schemas import PropertyFilter
from app.config import GOOGLE_API_KEY
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel
from typing import Optional


def get_filter_chain():

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=GOOGLE_API_KEY,
        temperature=0
    )

    structured_llm = llm.with_structured_output(PropertyFilter)

    return structured_llm



# Intent Classification 

class IntentSchema(BaseModel):
    intent: str
    message: Optional[str] = None


def get_intent_chain():

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=GOOGLE_API_KEY,
        temperature=0
    )

    prompt = ChatPromptTemplate.from_template("""
You are a real estate assistant.

Classify the user message into one of these intents:
- greeting
- property_search
- out_of_domain
- casual

Rules:
- If message asks about politics, history, general knowledge → out_of_domain
- If message is about buying/renting/searching house → property_search
- If greeting → greeting
- Otherwise → casual

Return JSON only:
{{
  "intent": "intent_name"
}}

User message:
{message}
""")

    parser = JsonOutputParser()

    chain = prompt | llm | parser

    return chain
