# How to Check if User Exists in Supabase

## Quick Check via Dashboard

1. **Go to Users Page:**

   - https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/auth/users

2. **Search for your email:**

   - Look for `ranjaniashok1997@gmail.com` in the list
   - If you see it, click on it to see details

3. **Check User Status:**
   - **Email Confirmed:** Should show a date/time or "Not confirmed"
   - **Created At:** When the account was created
   - **Last Sign In:** When they last signed in (might be empty if never signed in)

---

## Check via SQL Editor

1. **Go to SQL Editor:**

   - https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/sql/new

2. **Run this query to check your user:**

   ```sql
   SELECT
     email,
     email_confirmed_at,
     created_at,
     last_sign_in_at
   FROM auth.users
   WHERE email = 'ranjaniashok1997@gmail.com';
   ```

3. **What to look for:**
   - If `email_confirmed_at` is `NULL` → Email not confirmed (this is the issue!)
   - If no rows returned → User doesn't exist (need to sign up again)

---

## Fix: Confirm Email via SQL

If email is not confirmed, run this to confirm it:

```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'ranjaniashok1997@gmail.com';
```

Then try signing in again!
