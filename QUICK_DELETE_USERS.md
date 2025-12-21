# Quick Guide: Delete Users from Supabase

## 🚀 Fastest Method: SQL Editor

### Step 1: Open SQL Editor

**Direct Link:** https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/sql/new

### Step 2: Copy & Paste One of These Queries

**Delete ALL users:**

```sql
DELETE FROM auth.users;
```

**Delete unconfirmed users (no email verification):**

```sql
DELETE FROM auth.users WHERE email_confirmed_at IS NULL;
```

**Delete users older than 7 days:**

```sql
DELETE FROM auth.users WHERE created_at < NOW() - INTERVAL '7 days';
```

**Delete specific user:**

```sql
DELETE FROM auth.users WHERE email = 'user@example.com';
```

### Step 3: Run Query

- Click **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
- Confirm deletion

---

## 📋 Alternative: Delete via Dashboard

1. **Go to Users Page:** https://app.supabase.com/project/dvscirnbbmuaiukzhmnu/auth/users
2. Click on user → **Delete User** button
3. Confirm

⚠️ **Note:** Dashboard method is slower (one by one). Use SQL for multiple deletions.

---

## ⚠️ Important Notes

- **Backup first** if deleting production data
- **Double-check** the query before running
- Deleted users **cannot be recovered**
- This only deletes from `auth.users` table

---

## 🔍 Verify Deletion

After deleting, run this query to check remaining users:

```sql
SELECT COUNT(*) as total_users FROM auth.users;
```
