import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Setup API Key
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("\n--- GOOGLE MODEL DIAGNOSTIC ---\n")

try:
    print("Connecting to Google AI servers...")
    models = genai.list_models()
    
    print("\n✅ MODELS AVAILABLE TO YOUR KEY:")
    print("-" * 40)
    for m in models:
        # We only care about models that can actually chat (generateContent)
        if 'generateContent' in m.supported_methods:
            print(f"MODEL NAME: {m.name}")
            print(f"DISPLAY NAME: {m.display_name}")
            print("-" * 40)
            
except Exception as e:
    print(f"\n❌ ERROR CONNECTING: {e}")

print("\n--- DIAGNOSTIC COMPLETE ---")