from typing import List, Dict


def filter_properties(filters: Dict, properties: List[Dict]) -> List[Dict]:

    if not filters:
        return properties  # return all if empty

    results = properties

    # Location 
    if "location" in filters:
        results = [
            p for p in results
            if filters["location"].lower() in p["location"].lower()
        ]

    # Bedrooms 
    if "bedrooms" in filters:
        results = [
            p for p in results
            if p["bedrooms"] == filters["bedrooms"]
        ]

    # Bathrooms 
    if "bathrooms" in filters:
        results = [
            p for p in results
            if p["bathrooms"] == filters["bathrooms"]
        ]

    # Min Price
    if "min_price" in filters:
        results = [
            p for p in results
            if p["price"] >= filters["min_price"]
        ]

    # Max Price
    if "max_price" in filters:
        results = [
            p for p in results
            if p["price"] <= filters["max_price"]
        ]

    # Amenities 
    if "amenities" in filters:
        requested = [a.lower() for a in filters["amenities"]]

        results = [
            p for p in results
            if all(
                req in [amen.lower() for amen in p["amenities"]]
                for req in requested
            )
        ]

    return results
