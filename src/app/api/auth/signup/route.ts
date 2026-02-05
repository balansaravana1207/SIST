import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create admin client with service role key
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: NextRequest) {
    try {
        const { email, password, fullName, role } = await request.json();

        // Validate input
        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: 'Email, password, and full name are required' },
                { status: 400 }
            );
        }

        console.log("📝 Creating user via admin API:", email);

        // Create user with admin client (auto-confirms email)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm the email!
            user_metadata: {
                full_name: fullName,
                role: role || 'student'
            }
        });

        if (authError) {
            console.error("❌ Admin auth error:", authError);
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        console.log("✅ User created:", authData.user.id);

        // Create profile - Use correct column names
        // Based on SQL schema: table has 'full_name', 'role', 'email' columns
        const profileData = {
            id: authData.user.id,
            full_name: fullName,  // Matches your profiles table schema
            role: role || 'student',
            email: email
        };

        console.log("🔍 Input received - fullName:", fullName, ", email:", email, ", role:", role);
        console.log("📝 Creating profile with data:", JSON.stringify(profileData, null, 2));

        const { data: insertedProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert(profileData)
            .select();

        if (profileError) {
            console.error("❌ Profile error:", profileError);
            // User was created, so we'll just log the profile error
        } else {
            console.log("✅ Profile created:", JSON.stringify(insertedProfile, null, 2));
        }

        return NextResponse.json({
            success: true,
            user: {
                id: authData.user.id,
                email: authData.user.email
            }
        });

    } catch (error: any) {
        console.error("🚨 Signup API error:", error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
