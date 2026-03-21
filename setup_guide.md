# Manual Setup Instructions for Takshila AI

To enable the new **AI PDF Chatbot (RAG)** and **Admin Dashboard**, you need to perform these two essential steps. Without these, the document upload and chat features will not work.

## 1. Setup the Database (Supabase)
The PDF chatbot requires a special "Vector" database to understand your documents.

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project (**fcrlthrjzyxvtmhpiqtf**).
3.  On the left sidebar, click on **SQL Editor** (the `>_` icon).
4.  Click **New Query**.
5.  Open the [supabase_schema.sql](file:///Users/apple/Desktop/anti/supabase_schema.sql) file I created.
6.  **Copy all the code** from that file and **paste it** into the Supabase SQL Editor.
7.  Click **Run**.
    - This will create the `documents`, `document_chunks`, and `chat_history` tables.
    - It also enables `pgvector` for AI search.

## 2. Configure Environment Variables
You need to provide the "Keys" so the AI can talk to OpenAI and your database.

1.  Open the file `.env.local` in your project folder.
2.  Add these two lines at the end:

```env
OPENAI_API_KEY=your_openai_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Where to find these keys?
- **OPENAI_API_KEY**: Get it from [platform.openai.com/api-keys](https://platform.openai.com/api-keys). (You must have an account with credits).
- **SUPABASE_SERVICE_ROLE_KEY**: 
  1. Go to your Supabase Dashboard.
  2. Click **Project Settings** (gear icon) -> **API**.
  3. Look for the `service_role` (secret) key. Click "Reveal" to copy it.
  - **IMPORTANT**: This is a secret key that allows the backend to write to your database. Never share it publicly.

---

### Why is the upload not working yet?
The upload fails because the code is trying to save the file to a table (`documents`) that doesn't exist yet in your database. Once you run the SQL script in Step 1, the upload will start working immediately!
