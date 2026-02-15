import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

def load_json(filename: str):
    with open(BASE_DIR / filename, "r") as f:
        return json.load(f)

#merging all properties 
def merge_properties():
    basics = load_json("data/property_basics.json")
    characteristics = load_json("data/property_characteristics.json")
    images = load_json("data/property_images.json")

    char_map = {item["id"]: item for item in characteristics}
    image_map = {item["id"]: item for item in images}

    merged = []

    for basic in basics:
        pid = basic["id"]

        property_data = {
            "id": pid,
            "title": basic["title"],
            "price": basic["price"],
            "location": basic["location"],
            "bedrooms": char_map.get(pid, {}).get("bedrooms"),
            "bathrooms": char_map.get(pid, {}).get("bathrooms"),
            "size_sqft": char_map.get(pid, {}).get("size_sqft"),
            "amenities": char_map.get(pid, {}).get("amenities", []),
            "image_url": image_map.get(pid, {}).get("image_url")
        }

        merged.append(property_data)

    return merged
