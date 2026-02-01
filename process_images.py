import os
from PIL import Image

src_dir = r"C:\Users\edosu\.gemini\antigravity\brain\62666176-6055-4fee-a547-a0e32d146389"
target_base = r"c:\Users\edosu\Desktop\Nexenergy\images"

# Ensure dirs exist
os.makedirs(os.path.join(target_base, "hero"), exist_ok=True)
os.makedirs(os.path.join(target_base, "sections"), exist_ok=True)

mapping = {
    "hero_image_real_1769879253485.png": "hero/hotel-risparmio-energetico-nexenergy.webp",
    "problem_image_real_1769879269205.png": "sections/sistema-tessera-hotel-problema.webp",
    "solution_image_real_1769879285115.png": "sections/installazione-retrofit-camera-hotel.webp",
    "method_image_real_1769879300860.png": "sections/dashboard-ai-energy-management-hotel.webp"
}

for src_name, target_rel in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    target_path = os.path.join(target_base, target_rel)
    
    try:
        print(f"Converting {src_name} to {target_rel}...")
        img = Image.open(src_path)
        img.save(target_path, "WEBP", quality=95)
        print("Success.")
    except Exception as e:
        print(f"Error processing {src_name}: {e}")
