# MicroGPT UI refresh

This update refreshes the existing React interface with a light, purple/blue AI-chat layout inspired by the supplied reference image. It keeps the existing React, Express, MongoDB, JWT authentication, and OpenAI chat flow.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend calls `http://localhost:8000`. To use a different backend URL, create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:8000
```

## Backend

1. Copy `Backend/.env.example` to `Backend/.env`.
2. Set `MONGODB_URL`, `OPENAI_API_KEY`, and `JWT_SECRET` to your own values.
3. Install dependencies and start the server:

```bash
cd Backend
npm install
npm run dev
```

The backend listens on port `8000`.

## Notes

- Chat sending requires a signed-in user because the existing `/api/chat` endpoint uses JWT authentication.
- Conversation history uses the existing MongoDB thread endpoints.
- The current backend exposes text chat only. The redesigned interface does not add an image-generation API; it is a visual refresh of the existing chat application.
- Never upload or commit your real `.env` file. Keep API keys and database credentials private.
