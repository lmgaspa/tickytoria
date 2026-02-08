export const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "Tickytoria ERP API",
    version: "1.0.0",
    description: "Comprehensive API documentation for Tickytoria ERP system, including Tickets, Clients, and Employee management.",
  },
  servers: [
    { url: "https://tickytoria-d1c0ff69e067.herokuapp.com", description: "Heroku Production" },
    { url: "https://www.tickytoria.com", description: "Custom Domain Production" },
    { url: "http://localhost:5000", description: "Local Development" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // --- TICKETS ---
      TicketInput: {
        type: "object",
        required: ["cliente", "empresa", "descricaoServico"],
        properties: {
          cliente: { type: "string", example: "John Doe" },
          empresa: { type: "string", example: "Acme Corp" },
          cpf: { type: "string", example: "123.456.789-00" },
          cnpj: { type: "string", example: "12.345.678/0001-99" },
          emailEmpresa: { type: "string", example: "contact@acme.com" },
          telefone: { type: "string", example: "+5511999999999" },
          whatsapp: { type: "string", example: "+5511999999999" },
          descricaoServico: { type: "string", example: "Software installation assistance" },
          lang: { type: "string", enum: ["en", "pt", "es"], default: "pt", description: "Email notification language" },
        },
      },
      TicketOutput: {
        allOf: [
          { $ref: "#/components/schemas/TicketInput" },
          {
            type: "object",
            properties: {
              _id: { type: "string", example: "665f7cba1e4f230d58bfa1ee" },
              notaServico: { type: "string", example: "NS-1751907481293" },
              createdAt: { type: "string", example: "2025-06-16 07:00" },
            },
          },
        ],
      },
      TicketUpdate: {
        type: "object",
        properties: {
          cliente: { type: "string" },
          empresa: { type: "string" },
          descricaoServico: { type: "string" },
          telefone: { type: "string" },
          whatsapp: { type: "string" },
          emailEmpresa: { type: "string" },
          cpf: { type: "string" },
          cnpj: { type: "string" },
        },
      },
      // --- CLIENTS ---
      ClientInput: {
        type: "object",
        required: ["name", "empresa", "endereco"],
        properties: {
          name: { type: "string", example: "Alice Smith" },
          empresa: { type: "string", example: "Alice's Bakery" },
          cpf: { type: "string", example: "987.654.321-00" },
          cnpj: { type: "string", example: "99.888.777/0001-66" },
          emailEmpresa: { type: "string", example: "alice@bakery.com" },
          telefone: { type: "string", example: "+557133334444" },
          whatsapp: { type: "string", example: "+5571988887777" },
          endereco: { type: "string", example: "123 Sugar St, Sweet City" },
          lang: { type: "string", enum: ["en", "pt", "es"], default: "pt", description: "Email notification language" },
        },
      },
      ClientOutput: {
        allOf: [
          { $ref: "#/components/schemas/ClientInput" },
          {
            type: "object",
            properties: {
              _id: { type: "string", example: "775f7cba1e4f230d58bfa2ff" },
              createdAt: { type: "string", example: "2025-06-17 10:00" },
            },
          },
        ],
      },
      // --- USERS (EMPLOYEES) ---
      UserInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Bob Manager" },
          email: { type: "string", example: "bob@tickytoria.com" },
          password: { type: "string", example: "securePassword123" },
          role: { type: "string", enum: ["admin", "funcionário"], default: "funcionário" },
          whatsapp: { type: "string", example: "+5511977776666" },
          endereco: { type: "string", example: "456 Office Rd, Work City" },
          lang: { type: "string", enum: ["en", "pt", "es"], default: "pt", description: "Email notification language" },
        },
      },
      UserOutput: {
        type: "object",
        properties: {
          _id: { type: "string", example: "885f7cba1e4f230d58bfa3bb" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
          whatsapp: { type: "string" },
          endereco: { type: "string" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Authentication", description: "Authorization and User Registration" },
    { name: "Tickets", description: "Service Order (Nota de Serviço) management" },
    { name: "Clients", description: "Client relationship management" },
    { name: "Users", description: "Internal Employee management and search" },
  ],
  paths: {
    // --- AUTHENTICATION ---
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        description: "Returns a JWT token for valid credentials.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } } } } },
        },
        responses: {
          200: { description: "Successful login", content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" } } } } } },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register new employee (Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserInput" } } },
        },
        responses: {
          201: { description: "Employee registered successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/UserOutput" } } } },
          403: { description: "Forbidden - Admin access required" },
          409: { description: "User already exists" },
        },
      },
    },

    // --- TICKETS ---
    "/api/tickets": {
      post: {
        tags: ["Tickets"],
        summary: "Create a new service ticket",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/TicketInput" } } },
        },
        responses: {
          201: { description: "Ticket created successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/TicketOutput" } } } },
        },
      },
    },
    "/api/tickets/all": {
      get: {
        tags: ["Tickets"],
        summary: "List all tickets",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of tickets", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/TicketOutput" } } } } },
        },
      },
    },
    "/api/tickets/nota/{notaServico}": {
      get: {
        tags: ["Tickets"],
        summary: "Get ticket by Service Note ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "notaServico", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Ticket details", content: { "application/json": { schema: { $ref: "#/components/schemas/TicketOutput" } } } },
          404: { description: "Ticket not found" },
        },
      },
      patch: {
        tags: ["Tickets"],
        summary: "Partially update ticket",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "notaServico", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/TicketUpdate" } } } },
        responses: { 200: { description: "Updated successfully" } },
      },
      put: {
        tags: ["Tickets"],
        summary: "Update ticket by Note ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "notaServico", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/TicketUpdate" } } } },
        responses: { 200: { description: "Updated successfully" } },
      },
    },

    // --- CLIENTS ---
    "/api/clients": {
      post: {
        tags: ["Clients"],
        summary: "Register a new client",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ClientInput" } } },
        },
        responses: {
          201: { description: "Client created successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/ClientOutput" } } } },
        },
      },
    },
    "/api/clients/all": {
      get: {
        tags: ["Clients"],
        summary: "List all clients",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of clients", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/ClientOutput" } } } } },
        },
      },
    },
    "/api/clients/name/{name}": {
      get: {
        tags: ["Clients"],
        summary: "Search clients by name",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "name", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Search results", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/ClientOutput" } } } } } },
      },
    },

    // --- USERS ---
    "/api/users/all": {
      get: {
        tags: ["Users"],
        summary: "List all system users",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of users", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/UserOutput" } } } } },
        },
      },
    },
    "/api/users/email/{email}": {
      get: {
        tags: ["Users"],
        summary: "Find user by email",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "email", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User data", content: { "application/json": { schema: { $ref: "#/components/schemas/UserOutput" } } } },
          404: { description: "User not found" },
        },
      },
    },
  },
};
