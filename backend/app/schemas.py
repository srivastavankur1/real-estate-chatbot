from pydantic import BaseModel
from typing import Optional, List


class PropertyFilter(BaseModel):
    location: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    amenities: Optional[List[str]] = None
