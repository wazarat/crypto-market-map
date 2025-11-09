-- Enhanced Company Schema for Pakistan VASP Regulations
-- Support for multiple sectors and comprehensive company information

-- Add new columns to vasp_companies table
ALTER TABLE vasp_companies 
ADD COLUMN IF NOT EXISTS sectors TEXT[], -- Multiple sectors support
ADD COLUMN IF NOT EXISTS point_of_contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS point_of_contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS pvara_license_number_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS secp_registration_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS company_overview TEXT,
ADD COLUMN IF NOT EXISTS social_media_twitter VARCHAR(255),
ADD COLUMN IF NOT EXISTS social_media_linkedin VARCHAR(500),
ADD COLUMN IF NOT EXISTS social_media_facebook VARCHAR(500),
ADD COLUMN IF NOT EXISTS last_updated_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Rejected', 'Under Review'));

-- Create junction table for company-sector relationships (normalized approach)
CREATE TABLE IF NOT EXISTS company_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES vasp_categories(id) ON DELETE CASCADE,
    primary_sector BOOLEAN DEFAULT false,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, sector_id)
);

-- Create company audit log for tracking changes
CREATE TABLE IF NOT EXISTS company_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    changed_by VARCHAR(255),
    change_type VARCHAR(50), -- 'CREATE', 'UPDATE', 'DELETE', 'VERIFY'
    field_changed VARCHAR(255),
    old_value TEXT,
    new_value TEXT,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing companies to have sectors array
UPDATE vasp_companies 
SET sectors = ARRAY[
    (SELECT slug FROM vasp_categories WHERE id = vasp_companies.category_id)
]
WHERE sectors IS NULL AND category_id IS NOT NULL;

-- Insert company-sector relationships for existing data
INSERT INTO company_sectors (company_id, sector_id, primary_sector)
SELECT 
    vc.id as company_id,
    vc.category_id as sector_id,
    true as primary_sector
FROM vasp_companies vc
WHERE vc.category_id IS NOT NULL
ON CONFLICT (company_id, sector_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_sectors_company ON company_sectors(company_id);
CREATE INDEX IF NOT EXISTS idx_company_sectors_sector ON company_sectors(sector_id);
CREATE INDEX IF NOT EXISTS idx_company_audit_company ON company_audit_log(company_id);
CREATE INDEX IF NOT EXISTS idx_vasp_companies_sectors ON vasp_companies USING GIN(sectors);
CREATE INDEX IF NOT EXISTS idx_vasp_companies_verification ON vasp_companies(verification_status);

-- Function to automatically update sectors array when company_sectors changes
CREATE OR REPLACE FUNCTION update_company_sectors_array()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the sectors array in vasp_companies
    UPDATE vasp_companies 
    SET sectors = (
        SELECT ARRAY_AGG(vc.slug)
        FROM company_sectors cs
        JOIN vasp_categories vc ON cs.sector_id = vc.id
        WHERE cs.company_id = COALESCE(NEW.company_id, OLD.company_id)
    )
    WHERE id = COALESCE(NEW.company_id, OLD.company_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update sectors array
DROP TRIGGER IF EXISTS trigger_update_company_sectors ON company_sectors;
CREATE TRIGGER trigger_update_company_sectors
    AFTER INSERT OR UPDATE OR DELETE ON company_sectors
    FOR EACH ROW EXECUTE FUNCTION update_company_sectors_array();

-- Function to log company changes
CREATE OR REPLACE FUNCTION log_company_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the change
    INSERT INTO company_audit_log (company_id, change_type, changed_by, field_changed, old_value, new_value)
    VALUES (
        NEW.id,
        TG_OP,
        COALESCE(NEW.last_updated_by, 'system'),
        'company_data',
        CASE WHEN TG_OP = 'UPDATE' THEN OLD::text ELSE NULL END,
        NEW::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log company changes
DROP TRIGGER IF EXISTS trigger_log_company_changes ON vasp_companies;
CREATE TRIGGER trigger_log_company_changes
    AFTER INSERT OR UPDATE ON vasp_companies
    FOR EACH ROW EXECUTE FUNCTION log_company_changes();

-- Update RLS policies for new tables
ALTER TABLE company_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_audit_log ENABLE ROW LEVEL SECURITY;

-- Allow read access to company sectors
CREATE POLICY IF NOT EXISTS "Allow read access to company sectors" ON company_sectors FOR SELECT USING (true);

-- Allow admin access to company sectors
CREATE POLICY IF NOT EXISTS "Allow admin access to company sectors" ON company_sectors FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@pakistancrypto.council' OR 
    auth.jwt() ->> 'role' = 'admin'
);

-- Allow read access to audit log for admins only
CREATE POLICY IF NOT EXISTS "Allow admin read access to audit log" ON company_audit_log FOR SELECT USING (
    auth.jwt() ->> 'email' = 'admin@pakistancrypto.council' OR 
    auth.jwt() ->> 'role' = 'admin'
);

-- Create view for company details with sectors
CREATE OR REPLACE VIEW company_details_with_sectors AS
SELECT 
    c.*,
    ARRAY_AGG(
        JSON_BUILD_OBJECT(
            'id', cat.id,
            'name', cat.name,
            'slug', cat.slug,
            'primary_sector', cs.primary_sector
        )
    ) FILTER (WHERE cat.id IS NOT NULL) as sector_details
FROM vasp_companies c
LEFT JOIN company_sectors cs ON c.id = cs.company_id
LEFT JOIN vasp_categories cat ON cs.sector_id = cat.id
GROUP BY c.id;
