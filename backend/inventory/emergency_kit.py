from .items import REQUIRED_ITEMS


def kit_is_complete(items):
    return all(item in items for item in REQUIRED_ITEMS)
