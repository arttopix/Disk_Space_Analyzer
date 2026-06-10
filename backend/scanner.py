import os

def scan_directory(path: str, max_depth: int = 3, current_depth: int = 0):
    try:
        entries = list(os.scandir(path))
    except (PermissionError, FileNotFoundError, OSError):
        return {"name": os.path.basename(path) or path, "value": 0, "type": "error"}

    total_size = 0
    children = []
    
    for entry in entries:
        try:
            if entry.is_file(follow_symlinks=False):
                size = entry.stat(follow_symlinks=False).st_size
                total_size += size
                children.append({"name": entry.name, "value": size, "type": "file"})
            elif entry.is_dir(follow_symlinks=False):
                if current_depth < max_depth:
                    dir_data = scan_directory(entry.path, max_depth, current_depth + 1)
                    if dir_data["value"] > 0:
                        children.append(dir_data)
                        total_size += dir_data["value"]
                else:
                    # Limit scanning to max depth to ensure fast responses
                    pass
        except (PermissionError, FileNotFoundError, OSError):
            continue

    # Group small files and folders into "Others" to prevent massive trees that freeze the UI
    if children:
        threshold = total_size * 0.02  # Anything less than 2% of this folder's total size
        significant = []
        others_size = 0
        
        for child in children:
            if child.get("value", 0) < threshold:
                others_size += child.get("value", 0)
            else:
                significant.append(child)
        
        if others_size > 0:
            significant.append({"name": "Others", "value": others_size, "type": "group"})
            
        children = significant

    # Sort children by size (largest first)
    children.sort(key=lambda x: x.get("value", 0), reverse=True)

    result = {
        "name": os.path.basename(path) or path,
        "value": total_size,
        "type": "dir"
    }
    
    if children and total_size > 0:
        result["children"] = children
        
    return result
