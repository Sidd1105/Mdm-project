import zipfile
import json
import shutil
import os

model_path = "models_artifacts/ann_model.keras"
patched_path = "models_artifacts/ann_model_patched.keras"

# Copy original
shutil.copy(model_path, patched_path)

# The .keras file is a zip — open and patch the config
with zipfile.ZipFile(model_path, 'r') as zin:
    with zipfile.ZipFile(patched_path, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "config.json":
                config = json.loads(data.decode("utf-8"))
                # Recursively remove quantization_config
                def remove_key(obj, key):
                    if isinstance(obj, dict):
                        obj.pop(key, None)
                        for v in obj.values():
                            remove_key(v, key)
                    elif isinstance(obj, list):
                        for item in obj:
                            remove_key(item, key)
                remove_key(config, "quantization_config")
                data = json.dumps(config).encode("utf-8")
            zout.writestr(item, data)

print("Patched model saved to:", patched_path)