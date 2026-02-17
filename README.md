🏡 Real Estate Chatbot
An AI-powered Real Estate Chatbot built using FastAPI, MongoDB, Google Gemini API, and React (Vite + Tailwind CSS).

#Steps to run: 

1. Clone the repository <br>
git clone https://github.com/srivastavankur1/real-estate-chatbot <br>
cd real-estate-chatbot <br>

1. Navigate to backend : <
cd backend <br>

3. Create virtual Environment :
python -m venv venv <br>
source venv/bin/activate      # Mac/Linux <br>
venv\Scripts\activate         # Windows <br>
 
4. Install Dependencies :
pip install -r requirements.txt <br>
 
5. Inside backend/ create .env file :
GOOGLE_API_KEY = your_google_api_key <br>
MONGO_URI=your_mongodb_connection_string <br>

6. Run backend server :
uvicorn app.main:app –reload <br>

Backend runs on : 
http://127.0.0.1:8000 <br>


#FRONTEND SETUP 

1. Navigate to frontend folder : 
cd frontend <br>

2. Install Dependencies : 
npm install <br>

3. Inside folder/ create .env file : 
VITE_API_URL = “http://127.0.0.1:8000” <br>

4. Start frontend : 
npm run dev <br>
