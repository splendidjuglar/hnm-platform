import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai 
from google.genai import types 
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal, Enquiry

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE TOOL FOR THE AI ---
def save_lead_to_db(name: str, email: str, phone: str, business_name: str) -> str:
    """Saves a new retail or distribution partnership lead to the database.

    Args:
        name: The full name of the contact person.
        email: The business or personal email address.
        phone: The contact telephone number.
        business_name: The registered name of their company.
    """
    db = SessionLocal()
    try:
        new_enquiry = Enquiry(
            name=name, 
            email=email, 
            phone=phone, 
            business_name=business_name, 
            message="Automatic lead capture from AI Agent"
        )
        db.add(new_enquiry)
        db.commit()
        print(f"✅ LEAD SAVED TO DB: {name} from {business_name}")
        return "Success: The lead has been officially registered in the HNM database."
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return f"Error saving lead: {str(e)}"
    finally:
        db.close()

# --- AI CLIENT SETUP ---
try:
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    print("✅ New Google GenAI Client Initialized")
except Exception as e:
    print(f"❌ Client Setup Error: {e}")
    client = None

try:
    with open("knowledge.txt", "r", encoding="utf-8") as f:
        KNOWLEDGE_BASE = f.read()
except FileNotFoundError:
    KNOWLEDGE_BASE = "HNM Food Groups: Luxury cereals from Wales."

class ChatRequest(BaseModel):
    message: str

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

# ✅ HELPER FUNCTION: Maps and routes local function calls execution immediately 
def execute_tool_calls(response_object) -> list:
    tool_outputs = []
    # Check if the model requested any function calls
    if response_object.function_calls:
        for call in response_object.function_calls:
            if call.name == "save_lead_to_db":
                # Execute your local python tool instantly
                result = save_lead_to_db(**call.args)
                tool_outputs.append(
                    types.Part.from_function_response(
                        name=call.name,
                        response={"result": result}
                    )
                )
    return tool_outputs

@app.post("/chat")
async def chat(request: ChatRequest):
    if client is None:
        raise HTTPException(status_code=500, detail="AI Client not initialized")

    system_prompt = (
        f"You are the HNM Food Groups AI Agentic Receptionist. Provide short, sharp, crystal clear answers.\n\n"
        f"KNOWLEDGE:\n{KNOWLEDGE_BASE}\n\n"
        f"STRICT GUIDELINES:\n"
        f"1. Be concise. No long greetings or fluff.\n"
        f"2. Format: Use simple dashes (-) for lists. No asterisks (*) or bold markers (**).\n"
        f"3. Lead Capture: If a user wants partnership, distribution, or samples, you MUST collect: Name, Email, Phone, and Business Name.\n"
        f"4. Action: Once you have all 4 pieces of info, use the 'save_lead_to_db' tool immediately."
    )

    # Dictionary mapping mapping your tools for validation clarity
    available_tools = [save_lead_to_db]
    
    # Fast primary execution model config mapping budget zero
    primary_config = types.GenerateContentConfig(
        tools=available_tools,
        thinking_config=types.ThinkingConfig(thinking_budget=0)
    )

    # Setup core conversation payload structures
    history_contents = [
        types.Content(role="user", parts=[types.Part.from_text(text=f"{system_prompt}\n\nUser: {request.message}")])
    ]

    try:
        # Step 1: Initial invocation call to the fast 2.5 Flash architecture
        target_model = "gemini-2.5-flash"
        response = client.models.generate_content(
            model=target_model, 
            contents=history_contents,
            config=primary_config
        )
        
        # Step 2: Extract tool tasks requested by model
        tool_parts = execute_tool_calls(response)
        
        if tool_parts:
            # Append model's request and the execution results back to history context tracking array
            history_contents.append(response.candidates[0].content)
            history_contents.append(types.Content(role="tool", parts=tool_parts))
            
            # Step 3: Fast second-turn turnaround to finalize reply text layout
            response = client.models.generate_content(
                model=target_model,
                contents=history_contents,
                config=primary_config
            )

        return {"reply": response.text}
        
    except Exception as e:
        print(f"🔥 PRIMARY AGENT ENGINE ERROR: {str(e)}. Swapping fallback execution routing...")
        try:
            # Fast low latency backup engine routine structure configuration
            fallback_model = "gemini-3.5-flash"
            fallback_config = types.GenerateContentConfig(
                tools=available_tools,
                thinking_config=types.ThinkingConfig(thinking_level="MINIMAL")
            )
            
            fallback_history = [
                types.Content(role="user", parts=[types.Part.from_text(text=f"{system_prompt}\n\nUser: {request.message}")])
            ]
            
            response = client.models.generate_content(
                model=fallback_model, 
                contents=fallback_history,
                config=fallback_config
            )
            
            tool_parts = execute_tool_calls(response)
            if tool_parts:
                fallback_history.append(response.candidates[0].content)
                fallback_history.append(types.Content(role="tool", parts=tool_parts))
                response = client.models.generate_content(
                    model=fallback_model,
                    contents=fallback_history,
                    config=fallback_config
                )
                
            return {"reply": response.text}
        except Exception as e2:
            print(f"🔥 BOTH MODELS FAILED: {str(e2)}")
            raise HTTPException(status_code=500, detail=f"AI Error: {str(e2)}")

class EnquiryRequest(BaseModel):
    name: str
    email: str
    phone: str
    business_name: str
    message: str

@app.post("/enquiry")
async def save_enquiry(req: EnquiryRequest, db: Session = Depends(get_db)):
    try:
        status_message = save_lead_to_db(req.name, req.email, req.phone, req.business_name)
        return {"status": "success", "message": status_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
