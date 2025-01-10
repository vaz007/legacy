#!/bin/bash

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Database configuration
DB_NAME="legacy_db"
DB_USER="postgres"
DB_PASSWORD="postgres"

# Check PostgreSQL version
PSQL_VERSION=$(psql --version | awk '{print $3}')
echo "PostgreSQL version: $PSQL_VERSION"

# Create database if it doesn't exist
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists"

# Connect to the database and create tables
psql -U $DB_USER -d $DB_NAME << EOF

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin','dev', 'other');
CREATE TYPE user_status AS ENUM ('active', 'paused', 'blacklisted');
CREATE TYPE certificate_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE access_status AS ENUM ('active', 'revoked');
CREATE TYPE alive_status AS ENUM ('alive', 'dead');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'denied');
CREATE TYPE notification_status AS ENUM ('unread', 'read');
CREATE TYPE dispute_status AS ENUM ('open', 'resolved', 'rejected');

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    alternate_phone VARCHAR(20),
    alternate_email VARCHAR(255),
    role user_role NOT NULL DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    status user_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kyc_details (
    kyc_detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    id_proof VARCHAR(255) NOT NULL,
    id_proof_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nominees (
    nominee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    full_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    kyc_verified BOOLEAN DEFAULT FALSE,
    nominee_of UUID REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS death_certificates (
    certificate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nominee_id UUID REFERENCES nominees(nominee_id),
    certificate_url TEXT NOT NULL,
    status certificate_status DEFAULT 'pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wills (
    will_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    will_document_url TEXT NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_documents (
    user_document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    document_type VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_access (
    document_access_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nominee_id UUID REFERENCES nominees(nominee_id),
    document_type VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    access_status access_status DEFAULT 'active',
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blacklist (
    blacklist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    reason TEXT NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alive_checks (
    alive_check_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    status alive_status DEFAULT 'alive',
    last_checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS access_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nominee_id UUID REFERENCES nominees(nominee_id),
    document_id UUID REFERENCES user_documents(user_document_id),
    request_status request_status DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    message TEXT NOT NULL,
    status notification_status DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disputes (
    dispute_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID REFERENCES death_certificates(certificate_id),
    reason TEXT NOT NULL,
    status dispute_status DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nominee_id UUID REFERENCES nominees(nominee_id),
    action_type VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for foreign keys and frequently accessed columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_kyc_user_id ON kyc_details(user_id);
CREATE INDEX idx_nominees_user_id ON nominees(user_id);
CREATE INDEX idx_nominees_nominee_of ON nominees(nominee_of);
CREATE INDEX idx_death_certificates_nominee_id ON death_certificates(nominee_id);
CREATE INDEX idx_wills_user_id ON wills(user_id);
CREATE INDEX idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX idx_document_access_nominee_id ON document_access(nominee_id);
CREATE INDEX idx_blacklist_user_id ON blacklist(user_id);
CREATE INDEX idx_alive_checks_user_id ON alive_checks(user_id);
CREATE INDEX idx_access_requests_nominee_id ON access_requests(nominee_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_activity_logs_nominee_id ON activity_logs(nominee_id);

EOF

echo "Database setup completed successfully!"