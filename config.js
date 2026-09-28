// Jann Jaravata personal portfolio public configuration.
// Project data now reads directly from the same Supabase database used by DesignLab.
// The publishable key is intended for browser use and access is protected by Supabase RLS.

const SUPABASE_URL = "https://fyhxipoayyhlrablgvll.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_62LdQNox7y8HFWzO9tPS0Q_1nQ8qV9g";

// Apps Script remains active for the personal visitor counter/contact workflow.
const API_URL = "https://script.google.com/macros/s/AKfycbzu5Beh0F65rsUkUFJf2GdfwTOK0g-GEamgzsTtpH2T1uIrj76AvJvkgITCVLrd268X/exec";
const VISITOR_SITE_KEY = "jann-portfolio";
const VISITOR_COUNTER_VERSION = "2";

window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEY;
window.API_URL = API_URL;
