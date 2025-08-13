# PANDU - Setup untuk Laragon/Windows

## Prerequisites
- Node.js 18 atau lebih tinggi
- PostgreSQL database
- Laragon atau XAMPP (opsional)

## Langkah Instalasi

### 1. Install Dependencies
```bash
# Jalankan install-deps.bat atau gunakan npm
npm install
```

### 2. Konfigurasi Environment
```bash
# Copy file .env.example ke .env
copy .env.example .env
```

Kemudian edit file `.env` dengan konfigurasi database Anda:
```env
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

### 3. Setup Database
```bash
# Push database schema
npm run db:push

# Atau jika ingin generate migration files
npm run db:generate
```

### 4. Menjalankan Aplikasi

#### Development Mode
```bash
# Gunakan batch file
start-dev.bat

# Atau menggunakan npm
npm run dev
```

#### Production Mode
```bash
# Build dan jalankan
start-prod.bat

# Atau manual
npm run build
npm start
```

## Scripts Khusus Windows

- `install-deps.bat` - Install semua dependencies
- `start-dev.bat` - Jalankan development server
- `start-prod.bat` - Build dan jalankan production server

## Struktur Port

- **Development**: http://localhost:5000
- **Production**: http://localhost:5000 (atau PORT yang dikonfigurasi di .env)

## Troubleshooting

### Error "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### Error Database Connection
1. Pastikan PostgreSQL sudah berjalan
2. Periksa konfigurasi di file `.env`
3. Pastikan database sudah dibuat

### Error Port Already in Use
Ubah PORT di file `.env` ke port yang tersedia (misal: 3000, 8000, dll)

### Error Permission pada Windows
Jalankan Command Prompt atau PowerShell sebagai Administrator

## Fitur Aplikasi

- **Form Builder**: Drag & drop form builder (akses via /builder)
- **Form Management**: Dashboard untuk manage forms
- **Medical Workflow**: URL pattern khusus untuk workflow medis
- **Real-time Search**: Pencarian form real-time
- **Export Data**: Export submissions ke CSV
- **Responsive Design**: Mobile-friendly interface

## Database Schema

Aplikasi menggunakan PostgreSQL dengan tabel:
- `forms` - Data form dan konfigurasi fields
- `form_submissions` - Data submission dengan informasi medis
- `users` - User management (untuk future authentication)

## Support

Untuk troubleshooting lebih lanjut, periksa:
1. Log console di browser (F12)
2. Log server di terminal
3. Konfigurasi environment variables