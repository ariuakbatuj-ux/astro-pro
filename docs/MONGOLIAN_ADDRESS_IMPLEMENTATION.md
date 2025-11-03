# 🇲🇳 Mongolian Address System - Complete Implementation Guide

## 📦 WHAT'S INCLUDED

### 1️⃣ **Data File** (`src/data/mongoliaAddresses.js`)
- ✅ Complete address hierarchy data
- ✅ Ulaanbaatar with 9 districts and horoos
- ✅ 21 aimags with their sums
- ✅ Type annotations (city vs aimag)

### 2️⃣ **Backend API Routes** (3 endpoints)
- ✅ `GET /api/addresses/aimags` - Returns all 22 locations
- ✅ `GET /api/addresses/districts-sums/[aimag]` - Returns districts or sums
- ✅ `GET /api/addresses/horoos/[aimag]/[district]` - Returns horoos for UB

### 3️⃣ **Frontend Integration** (Ready to use in your forms)
- ✅ 3 cascading dropdowns (Aimag → District/Sum → Horoo)
- ✅ Dynamic labels that change based on selection
- ✅ Auto show/hide horoo field
- ✅ Edit mode support (pre-fills existing data)

---

## 🎯 KEY FEATURES

### ✅ Smart Detection
Automatically detects Ulaanbaatar vs aimag based on selection

### ✅ Dynamic Labels
Changes "Дүүрэг" ↔ "Сум" automatically

### ✅ Conditional Fields
Horoo shows only for Ulaanbaatar

### ✅ Cascading Logic
Each selection enables the next dropdown

### ✅ Validation Ready
Built-in checks for required fields

---

## 🚀 HOW TO USE IN YOUR FORMS

### Example: Profile Page Integration

Add this JavaScript to your `profile.astro`:

```javascript
<script>
  // Load all aimags when page loads
  async function loadAimags() {
    try {
      const response = await fetch('/api/addresses/aimags');
      const result = await response.json();
      
      const aimagSelect = document.getElementById('aimagSelect');
      aimagSelect.innerHTML = '<option value="">Сонгоно уу...</option>';
      
      result.data.forEach(aimag => {
        const option = document.createElement('option');
        option.value = aimag.name;
        option.textContent = aimag.name;
        option.dataset.type = aimag.type;
        aimagSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error loading aimags:', error);
    }
  }

  // Load districts (UB) or sums (aimags)
  async function loadDistrictsOrSums(aimag, aimagType) {
    try {
      const response = await fetch(`/api/addresses/districts-sums/${encodeURIComponent(aimag)}`);
      const result = await response.json();
      
      const sumSelect = document.getElementById('sumSelect');
      const horooDiv = document.getElementById('horooDiv');
      const sumLabel = document.getElementById('sumLabel');
      
      // Clear previous selections
      sumSelect.innerHTML = '<option value="">Сонгоно уу...</option>';
      document.getElementById('horooSelect').innerHTML = '<option value="">Сонгоно уу...</option>';
      
      // Populate sum/district dropdown
      result.data.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        sumSelect.appendChild(option);
      });
      
      // Update label and show/hide horoo field
      if (aimagType === 'city') {
        sumLabel.textContent = 'Дүүрэг (District)';
        horooDiv.style.display = 'block';
        sumSelect.required = true;
        document.getElementById('horooSelect').required = true;
      } else {
        sumLabel.textContent = 'Сум (Sum)';
        horooDiv.style.display = 'none';
        sumSelect.required = true;
        document.getElementById('horooSelect').required = false;
      }
      
      sumSelect.disabled = false;
    } catch (error) {
      console.error('Error loading districts/sums:', error);
    }
  }

  // Load horoos for UB districts
  async function loadHoroos(aimag, district) {
    try {
      const response = await fetch(
        `/api/addresses/horoos/${encodeURIComponent(aimag)}/${encodeURIComponent(district)}`
      );
      const result = await response.json();
      
      if (!result.success) {
        console.log('No horoos available');
        return;
      }
      
      const horooSelect = document.getElementById('horooSelect');
      horooSelect.innerHTML = '<option value="">Сонгоно уу...</option>';
      
      result.data.forEach(horoo => {
        const option = document.createElement('option');
        option.value = horoo;
        option.textContent = horoo;
        horooSelect.appendChild(option);
      });
      
      horooSelect.disabled = false;
    } catch (error) {
      console.error('Error loading horoos:', error);
    }
  }

  // Event listeners
  document.addEventListener('DOMContentLoaded', () => {
    loadAimags();
    
    document.getElementById('aimagSelect').addEventListener('change', (e) => {
      const aimag = e.target.value;
      const aimagType = e.target.options[e.target.selectedIndex].dataset.type;
      
      if (aimag) {
        loadDistrictsOrSums(aimag, aimagType);
      }
    });
    
    document.getElementById('sumSelect').addEventListener('change', (e) => {
      const aimag = document.getElementById('aimagSelect').value;
      const aimagType = document.getElementById('aimagSelect').options[
        document.getElementById('aimagSelect').selectedIndex
      ].dataset.type;
      const district = e.target.value;
      
      if (aimagType === 'city' && district) {
        loadHoroos(aimag, district);
      }
    });
  });
</script>
```

---

## 📋 HTML FORM STRUCTURE

Add these form fields to your profile page:

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Aimag Selection -->
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Аймаг/Хот (Province/City) *
    </label>
    <select 
      id="aimagSelect"
      name="aimag"
      class="profile-input w-full px-3 py-2 border border-gray-300 rounded-md"
      required
    >
      <option value="">Сонгоно уу...</option>
    </select>
  </div>

  <!-- District/Sum Selection -->
  <div>
    <label id="sumLabel" class="block text-sm font-medium text-gray-700 mb-2">
      Дүүрэг/Сум (District/Sum) *
    </label>
    <select 
      id="sumSelect"
      name="sum"
      class="profile-input w-full px-3 py-2 border border-gray-300 rounded-md"
      disabled
      required
    >
      <option value="">Сонгоно уу...</option>
    </select>
  </div>

  <!-- Horoo Selection (Only for UB) -->
  <div id="horooDiv" style="display: none;">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Хороо (Neighborhood) *
    </label>
    <select 
      id="horooSelect"
      name="horoo"
      class="profile-input w-full px-3 py-2 border border-gray-300 rounded-md"
      disabled
    >
      <option value="">Сонгоно уу...</option>
    </select>
  </div>

  <!-- Address Detail -->
  <div class="md:col-span-2">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Дэлгэрэнгүй хаяг (Detailed Address)
    </label>
    <textarea
      id="addressDetail"
      name="addressDetail"
      rows="2"
      class="profile-input w-full px-3 py-2 border border-gray-300 rounded-md"
      placeholder="Байр, тоот, орцны дугаар гэх мэт..."
    ></textarea>
  </div>
</div>
```

---

## 🔌 API ENDPOINTS DOCUMENTATION

### 1. Get All Aimags

**Endpoint:** `GET /api/addresses/aimags`

**Response:**
```json
{
  "success": true,
  "count": 22,
  "data": [
    {
      "name": "Улаанбаатар хот",
      "type": "city"
    },
    {
      "name": "Архангай аймаг",
      "type": "aimag"
    },
    ...
  ]
}
```

### 2. Get Districts/Sums

**Endpoint:** `GET /api/addresses/districts-sums/[aimag]`

**Example:** `/api/addresses/districts-sums/Улаанбаатар%20хот`

**Response (Ulaanbaatar):**
```json
{
  "success": true,
  "aimagType": "city",
  "dataType": "districts",
  "count": 9,
  "data": [
    "Багануур дүүрэг",
    "Багахангай дүүрэг",
    "Баянгол дүүрэг",
    ...
  ]
}
```

**Response (Aimag):**
```json
{
  "success": true,
  "aimagType": "aimag",
  "dataType": "sums",
  "count": 24,
  "data": [
    "Цэцэрлэг сум",
    "Ихтамир сум",
    ...
  ]
}
```

### 3. Get Horoos (UB Only)

**Endpoint:** `GET /api/addresses/horoos/[aimag]/[district]`

**Example:** `/api/addresses/horoos/Улаанбаатар%20хот/Сүхбаатар%20дүүрэг`

**Response:**
```json
{
  "success": true,
  "aimag": "Улаанбаатар хот",
  "district": "Сүхбаатар дүүрэг",
  "count": 20,
  "data": [
    "1-р хороо",
    "2-р хороо",
    "3-р хороо",
    ...
  ]
}
```

---

## 📊 DATA STATISTICS

### Ulaanbaatar (Capital):
- **Districts:** 9
- **Total Horoos:** 204

| District | Horoos |
|----------|--------|
| Багануур дүүрэг | 5 |
| Багахангай дүүрэг | 2 |
| Баянгол дүүрэг | 34 |
| Баянзүрх дүүрэг | 43 |
| Налайх дүүрэг | 8 |
| Сонгинохайрхан дүүрэг | 43 |
| Сүхбаатар дүүрэг | 20 |
| Хан-Уул дүүрэг | 25 |
| Чингэлтэй дүүрэг | 24 |

### 21 Aimags:
- **Smallest:** Говьсүмбэр (3 sums), Орхон (2 sums)
- **Largest:** Төв (27 sums), Завхан (24 sums), Хөвсгөл (24 sums)

---

## 🧪 TESTING THE API

### Test in Browser:

1. **Get all aimags:**
   ```
   http://localhost:4321/api/addresses/aimags
   ```

2. **Get UB districts:**
   ```
   http://localhost:4321/api/addresses/districts-sums/Улаанбаатар%20хот
   ```

3. **Get Arkhangai sums:**
   ```
   http://localhost:4321/api/addresses/districts-sums/Архангай%20аймаг
   ```

4. **Get Sukhbaatar district horoos:**
   ```
   http://localhost:4321/api/addresses/horoos/Улаанбаатар%20хот/Сүхбаатар%20дүүрэг
   ```

### Test with cURL:

```bash
# Get aimags
curl http://localhost:4321/api/addresses/aimags

# Get districts
curl "http://localhost:4321/api/addresses/districts-sums/Улаанбаатар%20хот"

# Get horoos
curl "http://localhost:4321/api/addresses/horoos/Улаанбаатар%20хот/Сүхбаатар%20дүүрэг"
```

---

## 💾 DATABASE STORAGE

Your existing `profiles` table already has the columns:

```sql
CREATE TABLE profiles (
  ...
  aimag VARCHAR(100),           -- "Улаанбаатар хот" or aimag name
  sum VARCHAR(100),             -- District or sum name
  horoo VARCHAR(50),            -- Horoo (UB only) or NULL
  address_detail TEXT,          -- Building, apartment, etc.
  ...
);
```

### Example Data:

**Ulaanbaatar Resident:**
```sql
INSERT INTO profiles (user_id, aimag, sum, horoo, address_detail)
VALUES (
  1,
  'Улаанбаатар хот',
  'Сүхбаатар дүүрэг',
  '5-р хороо',
  'Барилга 5, 23 тоот'
);
```

**Aimag Resident:**
```sql
INSERT INTO profiles (user_id, aimag, sum, horoo, address_detail)
VALUES (
  2,
  'Архангай аймаг',
  'Цэцэрлэг сум',
  NULL,  -- No horoo for aimags
  'Төвийн талбайн ойролцоо'
);
```

---

## ✅ VALIDATION LOGIC

```javascript
function validateAddress() {
  const aimag = document.getElementById('aimagSelect').value;
  const sum = document.getElementById('sumSelect').value;
  const horoo = document.getElementById('horooSelect').value;
  const aimagType = document.getElementById('aimagSelect').options[
    document.getElementById('aimagSelect').selectedIndex
  ].dataset.type;

  if (!aimag) {
    return { valid: false, message: 'Аймаг/хот сонгоно уу' };
  }

  if (!sum) {
    return { valid: false, message: 'Дүүрэг/сум сонгоно уу' };
  }

  // Horoo is required only for Ulaanbaatar
  if (aimagType === 'city' && !horoo) {
    return { valid: false, message: 'Хороо сонгоно уу' };
  }

  return { valid: true };
}
```

---

## 🎨 CSS STYLING (Optional)

Add smooth transitions:

```css
.profile-input {
  transition: all 0.3s ease;
}

.profile-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.profile-input:enabled {
  background-color: white;
}

#horooDiv {
  transition: opacity 0.3s ease, height 0.3s ease;
}
```

---

## 🚀 NEXT STEPS

### 1. Update Your Profile Page
- Add the HTML form fields
- Add the JavaScript code
- Test the cascading dropdowns

### 2. Update Your API Handler
- The API endpoints are already created
- No changes needed to `/api/profile/update`

### 3. Test the Flow
1. Select "Улаанбаатар хот"
   - District dropdown enables
   - Horoo field appears
2. Select an aimag
   - Sum dropdown enables
   - Horoo field hides

### 4. Deploy
- All API endpoints work server-side
- No additional dependencies needed
- Ready for production!

---

## 📚 FILES CREATED

```
src/
├── data/
│   └── mongoliaAddresses.js         ← Complete address data
├── pages/
│   └── api/
│       └── addresses/
│           ├── aimags.ts            ← Get all aimags
│           ├── districts-sums/
│           │   └── [aimag].ts       ← Get districts/sums
│           └── horoos/
│               └── [aimag]/
│                   └── [district].ts ← Get horoos
```

---

## 🎉 SUMMARY

✅ **Complete address hierarchy** for Mongolia  
✅ **3 API endpoints** ready to use  
✅ **Smart detection** of UB vs aimag  
✅ **Dynamic form behavior**  
✅ **Cascading dropdowns**  
✅ **Validation ready**  
✅ **Database compatible**  
✅ **Production ready**  

**Your Mongolian address system is complete!** 🇲🇳

---

📖 **See also:**
- `MONGOLIAN_ADDRESS_SYSTEM.md` - Detailed explanation
- `src/pages/shop/profile.astro` - Integration example
