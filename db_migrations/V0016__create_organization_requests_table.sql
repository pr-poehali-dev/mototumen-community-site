CREATE TABLE organization_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(50) NOT NULL CHECK (organization_type IN ('shop', 'service', 'school')),
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),
    working_hours VARCHAR(255),
    additional_info TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INTEGER,
    review_comment TEXT
);

CREATE INDEX idx_organization_requests_user_id ON organization_requests(user_id);
CREATE INDEX idx_organization_requests_status ON organization_requests(status);
