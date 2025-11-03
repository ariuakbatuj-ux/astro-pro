# ✅ FIXED: Birthday Column Missing Error

## 🐛 Problem
```
Error updating profile: {
  code: 'PGRST204',
  message: "Could not find the 'birthday' column of 'profiles' in the schema cache"
}
```

The `birthday` column doesn't exist in your `profiles` table!

## ✅ Solution - Two Options

### Option 1: Add Birthday Column (Recommended)
Run the SQL script to add the column, then you can use the birthday field.

### Option 2: Use Without Birthday (Current)
The app now works without the birthday column - it's been temporarily hidden.

---

## 🔧 Option 1: Add Birthday Column

### Step 1: Run SQL Script

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Copy this SQL** (or use `ADD_BIRTHDAY_COLUMN.sql`):

```sql
-- Add birthday column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS birthday DATE;
```

3. **Click "Run"**
4. **Verify** it was added:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'birthday';
```

Expected result:
```
column_name | data_type
------------|----------
birthday    | date
```

### Step 2: Uncomment Birthday Field

After running the SQL, edit `src/pages/shop/profile.astro` and **uncomment** these lines:

Find this:
```html
<!-- Birthday field - Uncomment after running ADD_BIRTHDAY_COLUMN.sql
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
  <input type="date" id="birthday" value={profile.birthday} class="profile-input w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
</div>
-->
```

Change to:
```html
<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
  <input type="date" id="birthday" value={profile.birthday} class="profile-input w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
</div>
```

### Step 3: Test
1. Refresh http://localhost:4321/shop/profile
2. Birthday field should now appear!
3. Edit and save - should work perfectly

---

## 🚀 Option 2: Use Without Birthday (Already Done)

The app is **already fixed** to work without the birthday column:

### ✅ What Was Fixed:

**1. Frontend (profile.astro):**
- Birthday field is now commented out (hidden)
- `savePersonal()` checks if birthday input exists before reading it
- Only sends birthday to API if the field exists

**2. API (update.ts):**
- Dynamically builds update object
- Only includes `birthday` field if value is provided
- Won't try to update column if it doesn't exist

**3. Result:**
- ✅ Profile editing works NOW without birthday column
- ✅ No more "Could not find birthday column" errors
- ✅ Can still add birthday column later if you want

---

## 🧪 Test It Now (Without Birthday)

1. Go to http://localhost:4321/shop/profile
2. Click **"Edit"** button
3. Change **First Name**, **Last Name**, **Phone**, etc.
4. Click **"Save Changes"**
5. **Expected:** ✅ Green notification "Profile updated successfully!"
6. **No birthday errors!**

---

## 📊 What Gets Updated

### Without Birthday Column (Current):
```javascript
POST /api/profile/update
{
  userId: 1,
  firstName: "John",
  lastName: "Doe",
  phone: "+976 99112233",
  aimag: "Ulaanbaatar",
  sum: "Bayanzurkh",
  horoo: "3rd Khoroo",
  addressDetail: "Building 5"
  // birthday: NOT SENT (field hidden)
}
```

**Database Updates:**
- ✅ `users` table: first_name, last_name, phone
- ✅ `profiles` table: name, phone, aimag, sum, horoo, address_detail
- ✅ NO birthday update attempted

### With Birthday Column (After Adding):
```javascript
POST /api/profile/update
{
  userId: 1,
  firstName: "John",
  lastName: "Doe",
  phone: "+976 99112233",
  aimag: "Ulaanbaatar",
  sum: "Bayanzurkh",
  horoo: "3rd Khoroo",
  addressDetail: "Building 5",
  birthday: "1990-05-15" ← Will be included
}
```

**Database Updates:**
- ✅ `users` table: first_name, last_name, phone
- ✅ `profiles` table: name, phone, aimag, sum, horoo, address_detail, **birthday**

---

## 📝 Code Changes Made

### API (`src/pages/api/profile/update.ts`):

**Before (Broken):**
```typescript
await supabase.from('profiles').update({
  name: fullName,
  phone: phone,
  birthday: birthday || null,  // ❌ Always tries to update
  ...
})
```

**After (Fixed):**
```typescript
const profileUpdateData: any = {
  name: fullName || null,
  phone: phone || null,
  aimag: aimag || null,
  sum: sum || null,
  horoo: horoo || null,
  address_detail: addressDetail || null,
  updated_at: new Date().toISOString()
};

// Only add birthday if it's provided
if (birthday) {
  profileUpdateData.birthday = birthday;  // ✅ Conditional
}

await supabase.from('profiles').update(profileUpdateData)
```

### Frontend (`src/pages/shop/profile.astro`):

**Before (Broken):**
```javascript
const birthday = document.getElementById('birthday').value;  // ❌ Field doesn't exist
```

**After (Fixed):**
```javascript
const birthdayInput = document.getElementById('birthday');
const birthday = birthdayInput ? birthdayInput.value : null;  // ✅ Safe check

const requestBody = { userId, firstName, lastName, ... };

// Only add birthday if the input exists
if (birthday) {
  requestBody.birthday = birthday;  // ✅ Conditional
}
```

---

## 🎯 Summary

| Status | What Happens |
|--------|--------------|
| **Now (No Birthday Column)** | ✅ Profile editing works! Birthday field hidden. |
| **After Adding Column** | ✅ Uncomment birthday field, then it works with birthday! |

---

## 🔧 Quick Decision Guide

**Want to use birthday field?**
- ✅ Run `ADD_BIRTHDAY_COLUMN.sql` in Supabase
- ✅ Uncomment birthday field in profile.astro
- ✅ Test and enjoy!

**Don't care about birthday?**
- ✅ Do nothing - everything works now!
- ✅ Birthday field stays hidden
- ✅ No errors

---

**Your profile editing works now!** 🎉

Try it: http://localhost:4321/shop/profile
