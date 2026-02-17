🏡 Real Estate Chatbot
An AI-powered Real Estate Chatbot built using FastAPI, MongoDB, Google Gemini API, and React (Vite + Tailwind CSS).

#Steps to run: 

1. Clone the repository 
git clone https://github.com/srivastavankur1/real-estate-chatbot
cd real-estate-chatbot

1. Navigate to backend : 
cd backend

3. Create virtual Environment :
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows
 
4. Install Dependencies :
pip install -r requirements.txt
 
5. Inside backend/ create .env file 
GOOGLE_API_KEY = your_google_api_key
MONGO_URI=your_mongodb_connection_string

6. Run backend server
uvicorn app.main:app –reload

Backend runs on : 
http://127.0.0.1:8000


#FRONTEND SETUP 

1. Navigate to frontend folder : 
cd frontend

2. Install Dependencies : 
npm install

3. Inside folder/ create .env file : 
VITE_API_URL = “http://127.0.0.1:8000”

4. Start frontend : 
npm run dev
