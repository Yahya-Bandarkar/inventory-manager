import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ogtcmtbermuzcqfyespx.supabase.co'
const supabaseKey = 'sb_publishable_rVF3kgv9wB3pwrPLuDhIkg_l9yz7ksj'

export const supabase = createClient(supabaseUrl, supabaseKey)