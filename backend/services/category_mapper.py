AUTHORITY_MAP = {
    "garbage": "kathmandu.municipality@example.com",
    "road": "department.roads@example.com",
    "water": "water.supply@example.com",
    "electricity": "nea@example.com",
}

def get_authority_email(category: str) -> str:
    # Lowercase the category for mapping
    cat = category.lower()
    return AUTHORITY_MAP.get(cat, "general.civic@example.com")
