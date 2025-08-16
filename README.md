# PANDU - Sistem Pendukung Rekam Medis Terpadu

<div align="center">
  <img src="attached_assets/pandu-logo.jpg" alt="PANDU Logo" width="200" height="auto" />
  
  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/pandu-app)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Node.js](https://img.shields.io/badge/node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
  [![PostgreSQL](https://img.shields.io/badge/postgresql-13%2B-blue.svg)](https://postgresql.org/)
</div>

## 📋 Overview

PANDU (Sistem Pendukung Rekam Medis Terpadu) is a comprehensive web-based medical record management platform designed to streamline healthcare documentation and improve patient data management. Built with modern web technologies, it features a dynamic form builder, medical workflow optimization, and secure data handling.

### 🌟 Key Features

- **Dynamic Form Builder**: Drag-and-drop interface for creating custom medical forms
- **Medical Workflow Integration**: Specialized URL routing for medical parameters (`/{form_slug}/{kunjungan_id}/{nopen}/{norm}/{oleh}`)
- **Real-time Search**: Instant search functionality across forms and submissions
- **Data Export**: CSV export with comprehensive medical data fields
- **Responsive Design**: Mobile-first approach ensuring accessibility across all devices
- **HIPAA-Compliant**: Secure medical record management with proper data validation
- **Multi-Environment**: Support for both cloud (Replit) and local (Laragon/XAMPP) deployment

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **PostgreSQL** 13.0 or higher
- **npm** or **yarn** package manager

### Installation

#### Option 1: Replit Deployment (Recommended)
1. Fork this repository on Replit
2. The environment will automatically set up dependencies
3. Configure your PostgreSQL database via Replit's database integration
4. Run the application using the "Start application" workflow

#### Option 2: Local Development (Windows/Laragon)
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pandu.git
   cd pandu
   ```

2. **Install dependencies**
   ```bash
   # Using the provided batch script
   install-deps.bat
   
   # Or manually
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   copy .env.example .env
   
   # Edit .env with your database credentials
   # Example configuration:
   DATABASE_URL=postgresql://username:password@localhost:5432/pandu_db
   PGHOST=localhost
   PGPORT=5432
   PGUSER=your_username
   PGPASSWORD=your_password
   PGDATABASE=pandu_db
   NODE_ENV=development
   PORT=5000
   SESSION_SECRET=your_random_secret_key_here
   ```

4. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   
   # Or generate migration files
   npm run db:generate
   ```

5. **Start the application**
   ```bash
   # Development mode
   start-dev.bat
   # or
   npm run dev
   
   # Production mode
   start-prod.bat
   # or
   npm run build && npm start
   ```

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling with custom design system
- **Shadcn/ui** components built on Radix UI primitives
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **@dnd-kit** for drag-and-drop form builder functionality

#### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for reliable data persistence
- **Zod** for runtime type validation
- **dotenv** for environment configuration

#### Database Schema
```sql
-- Forms table for storing form configurations
forms (
  id VARCHAR PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Form submissions with medical workflow data
form_submissions (
  id VARCHAR PRIMARY KEY,
  form_id VARCHAR REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_by TEXT,
  submitted_by_email TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  kunjungan_id CHAR(19),  -- Medical visit ID
  nopen CHAR(10),         -- Medical record number
  norm INTEGER,           -- Patient norm number
  oleh INTEGER            -- Healthcare provider ID
);

-- Users table for authentication (future feature)
users (
  id VARCHAR PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | ✅ |
| `PGHOST` | PostgreSQL host | localhost | ✅ |
| `PGPORT` | PostgreSQL port | 5432 | ✅ |
| `PGUSER` | PostgreSQL username | - | ✅ |
| `PGPASSWORD` | PostgreSQL password | - | ✅ |
| `PGDATABASE` | PostgreSQL database name | - | ✅ |
| `NODE_ENV` | Application environment | development | ✅ |
| `PORT` | Server port | 5000 | ✅ |
| `SESSION_SECRET` | Session encryption key | - | ✅ |

### Development Scripts

```json
{
  "dev": "Development server with hot reload",
  "build": "Build for production",
  "start": "Start production server",
  "check": "TypeScript type checking",
  "db:push": "Push database schema",
  "db:generate": "Generate migration files"
}
```

## 📱 Usage

### Form Builder
1. Navigate to `/builder` to access the form builder
2. Drag and drop form elements from the sidebar
3. Configure field properties in the right panel
4. Save and publish your form

### Medical Workflow
1. Access forms via the medical URL pattern: `/{form_slug}/{kunjungan_id}/{nopen}/{norm}/{oleh}`
2. The system preserves medical parameters throughout the workflow
3. Submit forms and continue with the same patient session
4. Export data with all medical context preserved

### Form Management
1. View all forms in the dashboard at `/`
2. Monitor form submissions at `/submissions`
3. Search and filter forms in real-time
4. Export submission data to CSV format

## 🚀 Deployment

### Production Deployment

#### Replit (Recommended)
1. Click the "Deploy" button in your Replit project
2. Configure your custom domain (optional)
3. Set production environment variables
4. Enable automatic deployments

#### Manual Server Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment**
   ```bash
   export NODE_ENV=production
   ```

3. **Start with PM2 (recommended)**
   ```bash
   pm2 start dist/index.js --name pandu
   pm2 save
   pm2 startup
   ```

### Database Migration
```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema (development only)
npm run db:push
```

## 🛠️ Development

### Project Structure
```
pandu/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages/routes
│   │   ├── lib/            # Utility functions
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations
│   ├── db.ts               # Database connection
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and validation
├── attached_assets/        # Static assets
├── .env.example           # Environment template
├── install-deps.bat       # Windows installation script
├── start-dev.bat          # Windows development script
├── start-prod.bat         # Windows production script
└── LARAGON-SETUP.md       # Local setup guide
```

### Adding New Features

1. **Database Changes**
   ```typescript
   // Update shared/schema.ts
   export const newTable = pgTable("new_table", {
     id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
     // ... other fields
   });
   
   // Generate migration
   npm run db:generate
   ```

2. **API Endpoints**
   ```typescript
   // Add to server/routes.ts
   app.get("/api/new-endpoint", async (req, res) => {
     // Implementation
   });
   ```

3. **Frontend Pages**
   ```typescript
   // Create client/src/pages/NewPage.tsx
   // Register in client/src/App.tsx
   ```

### Code Quality

- **TypeScript**: Full type safety across the stack
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (configured in editor)
- **Zod**: Runtime type validation for API endpoints

## 🔍 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
Error: Failed to connect to database
```
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists and user has permissions

**Port Already in Use**
```bash
Error: listen EADDRINUSE :::5000
```
- Change PORT in .env file
- Kill existing process: `pkill -f "node.*5000"`

**Build Errors**
```bash
Error: Cannot resolve module
```
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist && npm run build`

**Form Validation Errors**
- Check field configurations in form builder
- Verify required fields are properly set
- Review browser console for validation errors

### Performance Optimization

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_forms_slug ON forms(slug);
   CREATE INDEX idx_submissions_form_id ON form_submissions(form_id);
   CREATE INDEX idx_submissions_created_at ON form_submissions(created_at);
   ```

2. **Query Optimization**
   - Use proper WHERE clauses
   - Limit result sets with pagination
   - Optimize JOIN operations

3. **Frontend Performance**
   - Implement React.memo for expensive components
   - Use TanStack Query caching effectively
   - Optimize bundle size with code splitting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and [LARAGON-SETUP.md](LARAGON-SETUP.md)
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our community discussions
- **Email**: Contact support at support@pandu-app.com

## 🚦 Roadmap

### Version 1.1 (Q2 2025)
- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] Advanced form templates
- [ ] Email notifications

### Version 1.2 (Q3 2025)
- [ ] API integrations
- [ ] Advanced analytics dashboard
- [ ] Mobile app companion
- [ ] Multi-language support

### Version 2.0 (Q4 2025)
- [ ] AI-powered form recommendations
- [ ] Advanced reporting system
- [ ] Integration with major EMR systems
- [ ] Audit trails and compliance features

---

<div align="center">
  <p>Built with ❤️ for healthcare professionals</p>
  <p>© 2025 PANDU - Sistem Pendukung Rekam Medis Terpadu</p>
</div>