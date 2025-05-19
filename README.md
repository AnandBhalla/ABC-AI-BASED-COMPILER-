
# AI Based Compiler Project

## Project Overview
**ABC (AI Based Compiler)** is a full-stack web application that leverages artificial intelligence to analyze, optimize, and compile code. The project consists of two main parts: a **React-based Frontend** and a **FastAPI-based Backend**.

```
AiCompiler/
├── Backend/         # Python FastAPI backend
└── Frontend/        # React TypeScript frontend 
```

---

## Backend

The backend is built with **FastAPI**, a modern Python web framework that makes it easy to build APIs.

### Technologies Used
- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for FastAPI
- **Pydantic**: Data validation and settings management

### Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

### Building for Production

You can deploy the backend to any ASGI-compatible server. Example:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## Frontend

The frontend is built with **React**, **TypeScript**, and **Vite**, styled with **Tailwind CSS** and **Shadcn UI** components.

### Technologies Used
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **React Router**: For routing
- **TanStack Query**: For data fetching
- **JSZip & File-Saver**: For file operations

### Features
- Modern code editor interface
- File system management (create, edit, delete files/folders)
- File download capabilities
- Terminal for command outputs
- Dark-themed UI optimized for development

### Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install 
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:8080`.

### Environment Variables

Create a `.env` file in the Frontend directory with:

```
REACT_APP_API_URL = https://your-backend-url.com
```

For local development:

```
REACT_APP_API_URL = http://localhost:8000
```

### Building for Production

```bash
cd Frontend
npm run build 
```

This will generate optimized files in the `dist` directory that can be served by any static file server.

---

## Contributing

- Create feature branches from `main`
- Submit pull requests with descriptive messages
- Ensure code passes all tests before submitting

---

## License

This project is licensed under the **MIT License**.
