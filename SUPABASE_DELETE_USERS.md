# How to Delete Users from Supabase

## Method 1: Delete via Supabase Dashboard (Easiest)

### Steps:

1. **Go to Supabase Dashboard**

   - Open: https://app.supabase.com
   - Sign in and select your project: **fitarrito-web**

2. **Navigate to Authentication → Users**

   - Click **Authentication** in the left sidebar
   - Click **Users** (you'll see a list of all registered users)

3. **Delete a User**

   - Find the user you want to delete in the list
   - Click on the user row to open details
   - Scroll down and click the **Delete User** button (usually at the bottom)
   - Confirm deletion

4. **Bulk Delete (if needed)**
   - Unfortunately, Supabase dashboard doesn't support bulk delete
   - You'll need to delete users one by one, or use SQL (Method 2)

---

## Method 2: Delete via SQL Editor (Faster for Multiple Users)

### Steps:

1. **Go to Supabase Dashboard → SQL Editor**

   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run Delete Query**

   **Delete specific user by email:**

   ```sql
   DELETE FROM auth.users
   WHERE email = 'user@example.com';
   ```

   **Delete all unconfirmed users (users who haven't verified email):**

   ```sql
   DELETE FROM auth.users
   WHERE email_confirmed_at IS NULL;
   ```

   **Delete all users (⚠️ CAREFUL - deletes everything):**

   ```sql
   DELETE FROM auth.users;
   ```

   **Delete users created in last 24 hours:**

   ```sql
   DELETE FROM auth.users
   WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

3. **Run the Query**
   - Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - Confirm if prompted

---

## Method 3: Disable Email Confirmation (For Development)

If you want to test without email verification:

1. **Go to Supabase Dashboard**

   - Navigate to **Authentication** → **Providers**
   - Click on **Email** provider

2. **Disable Email Confirmation**

   - Toggle OFF **"Confirm email"** option
   - This allows users to sign in immediately after signup without email verification

3. **Save Changes**

⚠️ **Note:** Only disable this for development/testing. Always enable it in production!

---

## Troubleshooting: Sign In Errors After Signup

### Common Issues:

1. **"Invalid login credentials" after signup**

   - **Cause:** Email confirmation is enabled and user hasn't verified email
   - **Solution:**
     - Option A: Check email inbox and click verification link
     - Option B: Disable email confirmation (Method 3 above)
     - Option C: Manually confirm user in Supabase Dashboard (see below)

2. **"User not found"**

   - **Cause:** User was deleted or never created
   - **Solution:** Check Supabase Dashboard → Authentication → Users

3. **Empty error object `{}`**
   - **Cause:** Error object structure is different
   - **Solution:** Check browser console for detailed error logs

### Manually Confirm User Email (For Testing)

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click on the user
3. Scroll to **Email Confirmed** section
4. Click **Confirm Email** button

---

## Quick Testing Workflow

1. **Disable email confirmation** (Method 3) - for easy testing
2. **Delete old test users** (Method 1 or 2) - to start fresh
3. **Create new account** - via your signup page
4. **Sign in immediately** - should work without email verification

---

## Your Project Details

- **Project URL:** `https://dvscirnbbmuaiukzhmnu.supabase.co`
- **Project Name:** fitarrito-web
- **Direct Link to Users:** https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/auth/users

---

## Security Notes

- ⚠️ Never delete production users without backup
- ⚠️ Always enable email confirmation in production
- ⚠️ Keep backups before bulk deletions
