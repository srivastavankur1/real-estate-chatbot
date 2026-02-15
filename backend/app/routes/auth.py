from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.mongo_service import (
    create_user,
    get_user_by_email
)

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(data: RegisterRequest):
    existing_user = get_user_by_email(data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    result = create_user(data.name, data.email, data.password)

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


@router.post("/login")
def login(data: LoginRequest):
    user = get_user_by_email(data.email)

    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user_id": str(user["_id"])
    }
