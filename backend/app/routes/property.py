from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.mongo_service import save_property_for_user
from app.services.mongo_service import get_saved_properties


router = APIRouter(prefix="/property", tags=["property"])


class SavePropertyRequest(BaseModel):
    user_id: str
    property: dict


@router.post("/save")
def save_property(data: SavePropertyRequest):
    try:
        save_property_for_user(data.user_id, data.property)
        return {"message": "Property saved successfully"}
    except:
        raise HTTPException(status_code=400, detail="Error saving property")

@router.get("/saved/{user_id}")
def get_saved(user_id: str):
    return {
        "saved_properties": get_saved_properties(user_id)
    }