import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create admin client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// This endpoint looks up a user's email from their phone number
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Note: This requires service_role key or admin access
    // For production, you might want to use a database table instead
    // For now, we'll try to use the admin API if available
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Query auth.users to find user by phone in user_metadata
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Normalize phone number for comparison (remove spaces, dashes, parentheses, plus signs)
    const normalizePhone = (num: string) => String(num).replace(/[\s\-\(\)\+]/g, "");
    const normalizedPhone = normalizePhone(phone);

    // Find user with matching phone number in metadata
    // Check both exact match and normalized match for various formats
    const user = users.users.find((u) => {
      const metadataPhone = u.user_metadata?.phone || u.user_metadata?.phoneNumber;
      if (!metadataPhone) return false;
      
      const normalizedMetadataPhone = normalizePhone(String(metadataPhone));
      
      // Try exact match first
      if (String(metadataPhone) === phone || String(metadataPhone) === normalizedPhone) return true;
      
      // Try normalized match (remove all formatting)
      return normalizedMetadataPhone === normalizedPhone;
    });

    if (!user) {
      // For debugging: log available phone numbers (remove in production)
      if (process.env.NODE_ENV === "development") {
        console.log("Looking for phone:", phone, "normalized:", normalizedPhone);
        console.log("Available users with phone:", users.users
          .filter(u => u.user_metadata?.phone || u.user_metadata?.phoneNumber)
          .map(u => ({ 
            email: u.email, 
            phone: u.user_metadata?.phone || u.user_metadata?.phoneNumber 
          }))
        );
      }
      
      return NextResponse.json(
        { error: "No account found with this phone number. Please sign in with your email address instead." },
        { status: 404 }
      );
    }

    return NextResponse.json({ email: user.email });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
