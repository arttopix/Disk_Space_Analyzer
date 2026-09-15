import os

def get_dir_size(path: str) -> int:
    """Calculate total size in bytes of all files in a directory and subdirectories recursively."""
    total = 0
    try:
        with os.scandir(path) as it:
            for entry in it:
                try:
                    if entry.is_file(follow_symlinks=False):
                        total += entry.stat(follow_symlinks=False).st_size
                    elif entry.is_dir(follow_symlinks=False):
                        total += get_dir_size(entry.path)
                except (PermissionError, FileNotFoundError, OSError):
                    continue
    except (PermissionError, FileNotFoundError, OSError):
        pass
    return total

def scan_directory(path: str, max_depth: int = 4, current_depth: int = 0):
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
                children.append({"name": entry.name, "value": size, "type": "file", "path": os.path.abspath(entry.path)})
            elif entry.is_dir(follow_symlinks=False):
                if current_depth + 1 < max_depth:
                    dir_data = scan_directory(entry.path, max_depth, current_depth + 1)
                    if dir_data.get("value", 0) > 0:
                        children.append(dir_data)
                        total_size += dir_data["value"]
                else:
                    # Leaf reached at max_depth: compute complete recursive size without further expanding children
                    dir_size = get_dir_size(entry.path)
                    if dir_size > 0:
                        children.append({"name": entry.name, "value": dir_size, "type": "dir", "path": os.path.abspath(entry.path)})
                        total_size += dir_size
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
            significant.append({"name": "Others", "value": others_size, "type": "group", "path": os.path.abspath(path)})
            
        children = significant

    # Sort children by size (largest first)
    children.sort(key=lambda x: x.get("value", 0), reverse=True)

    result = {
        "name": os.path.basename(path) or path,
        "value": total_size,
        "type": "dir",
        "path": os.path.abspath(path)
    }
    
    if children and total_size > 0:
        result["children"] = children
        
    return result
