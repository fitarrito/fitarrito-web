# Fix "Invalid Login Credentials" Issue

## 🔍 Root Cause Analysis

The error `AuthApiError: Invalid login credentials` with status 400 means:

- The email/password combination doesn't match what's stored in Supabase
- OR the user account has an issue

## ✅ Complete Fix Steps

### Step 1: Delete the Existing User

**Via SQL Editor (Fastest):**

1. Go to: https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/sql/new
2. Run this query:
   ```sql
   DELETE FROM auth.users
   WHERE email = 'ranjaniashok1997@gmail.com';
   ```
3. Click **Run**

### Step 2: Disable Email Confirmation (For Testing)

1. Go to: https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/auth/providers
2. Click **Email** provider
3. Toggle OFF **"Confirm email"**
4. **Save**

### Step 3: Create Fresh Account

1. Go to: http://localhost:3000/signup
2. Fill in:
   - **Name:** Your name
   - **Email:** `ranjaniashok1997@gmail.com`
   - **Mobile Number:** Your phone number
   - **Password:** Choose a simple password (e.g., `test1234`) - **remember this!**
3. Click **Sign up**

### Step 4: Sign In Immediately

1. Go to: http://localhost:3000/signin
2. Enter:
   - **Email:** `ranjaniashok1997@gmail.com`
   - **Password:** The exact password you just used in signup
3. Click **Log in**

---

## 🔧 Alternative: Reset Password via SQL

If you want to keep the existing user but reset the password:

**⚠️ Warning:** This requires the service role key and is for development only!

1. Go to SQL Editor: https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/sql/new
2. Run this (replace `NEW_PASSWORD_HASH` with actual hash - complex):
   ```sql
   -- This is complex, better to delete and recreate
   ```

**Better approach:** Just delete and recreate the user (Step 1 above).

---

## 🐛 Debug: Check What's Actually Stored

Run this query to see the user details:

```sql
SELECT
  email,
  email_confirmed_at,
  encrypted_password IS NOT NULL as has_password,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'ranjaniashok1997@gmail.com';
```

**What to check:**

- `email_confirmed_at` should NOT be NULL
- `has_password` should be `true`
- If `has_password` is `false`, the password wasn't set correctly during signup

---

## 💡 Most Common Issues

1. **Password Mismatch**

   - You think you're using the right password, but it's different
   - **Solution:** Delete user and create fresh account with a password you'll remember

2. **Email Not Confirmed**

   - Even after confirming, sometimes it doesn't stick
   - **Solution:** Disable email confirmation for development

3. **User Created with Wrong Password**
   - Password might have been set incorrectly during signup
   - **Solution:** Delete and recreate

---

## ✅ Recommended Testing Workflow

1. **Delete all test users:**

   ```sql
   DELETE FROM auth.users;
   ```

2. **Disable email confirmation** (via Dashboard)

3. **Create new account** with simple password like `test1234`

4. **Sign in immediately** with same password

5. **If it works:** Great! The issue was with the old account

6. **If it still fails:** Check browser console for detailed error logs

---

## 🔍 Still Not Working?

Check these:

1. **Environment Variables:**

   - Verify `.env` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Restart dev server after changing `.env`

2. **Browser Console:**

   - Look for network errors
   - Check if request is reaching Supabase
   - Verify the error details

3. **Supabase Dashboard:**
   - Check Authentication → Users
   - Verify user exists and is confirmed
   - Check Authentication → Providers → Email is enabled
