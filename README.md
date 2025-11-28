# API Tester

A Postman-like API testing web application built with React, TypeScript, and Tailwind CSS. Test REST APIs with an intuitive dark-themed interface.

![API Tester Screenshot](/public/thumbnail.png)

## Features

### Request Building
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
- **URL Input**: Enter any API endpoint with Enter key support
- **Query Parameters**: Key-value table with enable/disable toggles
- **Headers**: Custom headers with enable/disable toggles
- **Request Body**:
  - None (no body)
  - Raw (Text or JSON with Monaco Editor)
  - Form-data (key-value pairs)

### Response Viewer
- **Status Display**: Color-coded HTTP status codes
- **Response Time**: Millisecond precision timing
- **Response Size**: Formatted size display
- **Body Viewer**: Pretty-printed JSON with syntax highlighting via Monaco Editor
- **Headers Tab**: View all response headers
- **Cookies Tab**: View response cookies
- **Copy Button**: One-click copy response body

### Console
- **Request Logging**: Method, URL, headers, and body
- **Response Logging**: Status, timing, and size
- **Error Logging**: Network errors and timeouts
- **Expandable Entries**: Click to view full details
- **Clear Function**: Reset console output

### History
- **Auto-Save**: Requests automatically saved to localStorage
- **Quick Load**: Click to restore previous requests
- **Status Preview**: See response status at a glance
- **Delete**: Remove individual history entries
- **Clear All**: Reset entire history

### UI Features
- **Dark Theme**: Professional Postman-inspired dark mode
- **Resizable Panels**: Drag to resize request, response, and console panels
- **Method Colors**: Color-coded HTTP methods (GET=green, POST=yellow, etc.)
- **Monaco Editor**: Syntax highlighting, formatting, and error detection for JSON
- **Keyboard Shortcuts**: Enter to send, Ctrl+Shift+F to format JSON

## Tech Stack

- **React 18** with Hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Monaco Editor** (lazy-loaded) for JSON editing
- **Axios** for HTTP requests
- **shadcn/ui** for UI components
- **Vite** for development and building

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build

```bash
# Create production build
npm run build
# or
bun run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── api-tester/
│       ├── ApiTester.tsx      # Main container component
│       ├── RequestBar.tsx     # URL input and send button
│       ├── MethodSelector.tsx # HTTP method dropdown
│       ├── RequestPanel.tsx   # Tabs for params/headers/body
│       ├── KeyValueTable.tsx  # Reusable key-value editor
│       ├── BodyEditor.tsx     # Body type selection and editing
│       ├── ResponsePanel.tsx  # Response display with tabs
│       ├── Console.tsx        # Request/response logging
│       └── Sidebar.tsx        # Collections and history
├── hooks/
│   ├── useRequestState.ts     # Request state management
│   ├── useConsole.ts          # Console logging logic
│   └── useHistory.ts          # History with localStorage
├── lib/
│   └── apiClient.ts           # HTTP request execution
├── types/
│   └── api.ts                 # TypeScript interfaces
└── pages/
    └── Index.tsx              # Main page
```

## Usage Tips

1. **Testing Public APIs**: Try `https://jsonplaceholder.typicode.com/posts` for a quick test
2. **Adding Headers**: Use the Headers tab to add Authorization, Content-Type, etc.
3. **JSON Body**: Select "raw" then "JSON" for the Monaco editor with formatting
4. **Format JSON**: Click the "Format" button or use Ctrl+Shift+F in the editor
5. **Query Params**: Use the Params tab - they'll be automatically appended to the URL

## CORS Note

When testing APIs from the browser, you may encounter CORS restrictions. Solutions:
- Use APIs that support CORS
- Use a CORS proxy for testing
- Test against your own backend with CORS enabled

## License

MIT
