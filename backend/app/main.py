from fastapi import FastAPI
from app.routes.chat import router as chat_router
from app.services.property_loader import merge_properties
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.property import router as property_router




app = FastAPI()


ALL_PROPERTIES = merge_properties()

app.state.properties = ALL_PROPERTIES

app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(property_router)




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)