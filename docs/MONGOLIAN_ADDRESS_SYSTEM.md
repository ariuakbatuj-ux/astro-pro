# 🏠 MONGOLIAN ADDRESS SYSTEM EXPLAINED!

## 🇲🇳 Official Administrative Structure of Mongolia

This guide explains how Mongolia's unique address system works, specifically the difference between **Ulaanbaatar** (the capital) and the **21 aimags** (provinces).

---

## 🎯 THE BIG DIFFERENCE

### 🏙️ ULAANBAATAR (Capital City) - 3 Levels:

```
Level 1: Улаанбаатар хот (Ulaanbaatar City)
  ↓
Level 2: Дүүрэг (District) - Example: Сүхбаатар дүүрэг
  ↓
Level 3: Хороо (Neighborhood) - Example: 5-р хороо ✅
```

**Example Address:**
```
Улаанбаатар хот → Сүхбаатар дүүрэг → 5-р хороо ✅
```

### 🏞️ OTHER AIMAGS (21 Provinces) - 2 Levels:

```
Level 1: Аймаг (Aimag/Province) - Example: Архангай аймаг
  ↓
Level 2: Сум (Sum/District) - Example: Цэцэрлэг сум
  ↓
NO Level 3: Хороо does NOT exist in aimags! ❌
```

**Example Address:**
```
Архангай аймаг → Цэцэрлэг сум → (No horoo field) ✅
```

---

## 💡 HOW IT WORKS IN THE APP

### User Flow:

```
User opens form
  ↓
Selects location from dropdown
  ↓
Is it Ulaanbaatar? ◄─── JavaScript checks
  ↓
  ├─── YES (Ulaanbaatar)
  │      ↓
  │    Shows "Дүүрэг" (District) dropdown
  │    Shows "Хороо" (Neighborhood) dropdown
  │    Horoo is REQUIRED ✅
  │
  └─── NO (Aimag)
         ↓
       Shows "Сум" (Sum) dropdown
       Horoo field is HIDDEN ❌
       Horoo validation is skipped
```

---

## 🔄 Dynamic Behavior

The form **automatically adapts** based on what the user selects:

| Feature | Ulaanbaatar | Aimag |
|---------|-------------|-------|
| **Level 2 Label** | "Дүүрэг" (District) | "Сум" (Sum) |
| **Level 2 Options** | 9 districts | Multiple sums per aimag |
| **Horoo Field** | ✅ Visible & Required | ❌ Hidden & Not Required |
| **Validation** | Must select horoo | No horoo validation |
| **API Calls** | Fetches districts & horoos | Fetches sums only |

---

## 📊 Data Structure

Your `mongoliaAddresses.js` contains:

### 1. Ulaanbaatar (1 City):
```javascript
{
  name: "Улаанбаатар хот",
  type: "city",
  districts: [
    {
      name: "Сүхбаатар дүүрэг",
      horoos: ["1-р хороо", "2-р хороо", "3-р хороо", ...]
    },
    {
      name: "Чингэлтэй дүүрэг",
      horoos: ["1-р хороо", "2-р хороо", "3-р хороо", ...]
    },
    // ... 9 districts total
  ]
}
```

**Total Structure:**
- 1 city (Ulaanbaatar)
- 9 districts (дүүрэг)
- Multiple horoos per district (хороо)

### 2. Aimags (21 Provinces):
```javascript
{
  name: "Архангай аймаг",
  type: "aimag",
  sums: [
    "Цэцэрлэг сум",
    "Эрдэнэбулган сум",
    "Хангай сум",
    // ... multiple sums
  ]
  // NO horoos! ❌
}
```

**Total Structure:**
- 21 aimags (provinces)
- Multiple sums per aimag (сум)
- **NO horoos for aimags** - that's the key difference!

---

## 🗺️ MongoDB/Supabase Database Schema

### For Ulaanbaatar Residents:
```json
{
  "aimag": "Улаанbaatar хот",
  "sum": "Сүхбаатар дүүрэг",     // District (дүүрэг)
  "horoo": "5-р хороо",           // Required ✅
  "address_detail": "Building 5, Apt 23"
}
```

### For Aimag Residents:
```json
{
  "aimag": "Архангай аймаг",
  "sum": "Цэцэрлэг сум",          // Sum (сум)
  "horoo": null,                  // Not used ❌
  "address_detail": "Near central square"
}
```

---

## 🎨 Frontend Implementation

### Example Code (Simplified):
```javascript
// When user selects aimag/city
function onAimagChange(selectedAimag) {
  if (selectedAimag === "Улаанbaatar хот") {
    // Ulaanbaatar - Show districts and horoos
    document.getElementById('sumLabel').textContent = "Дүүрэг (District)";
    document.getElementById('horooField').style.display = 'block';
    document.getElementById('horooField').required = true;
    
    // Load districts into sum dropdown
    loadDistricts();
  } else {
    // Aimag - Show sums only, hide horoo
    document.getElementById('sumLabel').textContent = "Сум (Sum)";
    document.getElementById('horooField').style.display = 'none';
    document.getElementById('horooField').required = false;
    
    // Load sums into sum dropdown
    loadSums(selectedAimag);
  }
}

// When user selects district/sum
function onSumChange(selectedSum) {
  if (currentAimag === "Улаанbaatar хот") {
    // Load horoos for selected district
    loadHoroos(selectedSum);
  } else {
    // No horoos for aimags
    // Skip horoo loading
  }
}
```

---

## 🧪 Example User Scenarios

### Scenario 1: User Lives in Ulaanbaatar

**Step 1:** Select "Улаанбаатар хот"
```
Aimag: [Улаанbaatar хот ▼]
```

**Step 2:** Form shows district dropdown
```
Дүүрэг: [Select district... ▼]
Хороо: [Select horoo... ▼]  ← Appears!
```

**Step 3:** Select district
```
Дүүрэг: [Сүхбаатар дүүрэг ▼]
Хороо: [1-р хороо ▼]  ← Options loaded
```

**Step 4:** Select horoo (REQUIRED)
```
Дүүрэг: [Сүхбаатар дүүрэг ▼]
Хороо: [5-р хороо ▼]  ← Must select!
```

**Step 5:** Add details
```
Address Detail: [Building 5, Apartment 23]
```

✅ **Complete Address:**
```
Улаанbaatar хот, Сүхбаатар дүүрэг, 5-р хороо, Building 5, Apartment 23
```

---

### Scenario 2: User Lives in Aimag

**Step 1:** Select aimag
```
Aimag: [Архангай аймаг ▼]
```

**Step 2:** Form shows sum dropdown (horoo hidden)
```
Сум: [Select sum... ▼]
Хороо: [HIDDEN] ❌
```

**Step 3:** Select sum
```
Сум: [Цэцэрлэг сум ▼]
```

**Step 4:** Add details (horoo not required)
```
Address Detail: [Near central square]
```

✅ **Complete Address:**
```
Архангай аймаг, Цэцэрлэг сум, Near central square
```

---

## 📋 Complete List: Mongolia's Administrative Divisions

### The Capital:
- **Улаанбаатар хот** (Ulaanbaatar City)

### The 21 Aimags:
1. Архангай аймаг (Arkhangai)
2. Баян-Өлгий аймаг (Bayan-Ölgii)
3. Баянхонгор аймаг (Bayankhongor)
4. Булган аймаг (Bulgan)
5. Говь-Алтай аймаг (Govi-Altai)
6. Говьсүмбэр аймаг (Govisümber)
7. Дархан-Уул аймаг (Darkhan-Uul)
8. Дорноговь аймаг (Dornogovi)
9. Дорнод аймаг (Dornod)
10. Дундговь аймаг (Dundgovi)
11. Завхан аймаг (Zavkhan)
12. Орхон аймаг (Orkhon)
13. Өвөрхангай аймаг (Övörkhangai)
14. Өмнөговь аймаг (Ömnögovi)
15. Сүхбаатар аймаг (Sükhbaatar)
16. Сэлэнгэ аймаг (Selenge)
17. Төв аймаг (Töv)
18. Увс аймаг (Uvs)
19. Ховд аймаг (Khovd)
20. Хөвсгөл аймаг (Khövsgöl)
21. Хэнтий аймаг (Khentii)

---

## 🔍 Technical Implementation Details

### Database Fields:
```sql
CREATE TABLE profiles (
  ...
  aimag VARCHAR(100),           -- Province/City name
  sum VARCHAR(100),             -- District/Sum name
  horoo VARCHAR(50),            -- Neighborhood (UB only)
  address_detail TEXT,          -- Building, apartment, etc.
  ...
);
```

### Field Behavior:

| Field | Ulaanbaatar | Aimag | Notes |
|-------|-------------|-------|-------|
| `aimag` | "Улаанбаатар хот" | Aimag name | Always required |
| `sum` | District name (дүүрэг) | Sum name (сум) | Always required |
| `horoo` | Horoo number | `null` | Required only for UB |
| `address_detail` | Building/Apt | Landmark/Street | Optional |

### Validation Rules:
```javascript
// Validation logic
if (aimag === "Улаанbaatar хот") {
  // Ulaanbaatar validation
  if (!sum || !horoo) {
    return "District and horoo are required for Ulaanbaatar";
  }
} else {
  // Aimag validation
  if (!sum) {
    return "Sum is required";
  }
  // horoo not required ✅
}
```

---

## 🎯 Key Takeaways

✅ **Ulaanbaatar (Capital):**
- Uses: City → District (дүүрэг) → Horoo (хороо)
- 3-level system
- Horoo is REQUIRED
- 9 districts total

✅ **Aimags (21 Provinces):**
- Uses: Aimag (аймаг) → Sum (сум)
- 2-level system
- NO horoo field
- Multiple sums per aimag

✅ **Form Behavior:**
- Automatically adapts based on selection
- Labels change dynamically
- Horoo field shows/hides
- Validation adjusts accordingly

✅ **Database Storage:**
- Same fields for all users
- Horoo is `null` for aimag residents
- Address detail provides flexibility

---

## 🌟 Why This System?

This perfectly matches **Mongolia's real administrative structure**:

1. **Ulaanbaatar** is the only city with the horoo (neighborhood) system
2. **Aimags** are rural provinces with sums (districts) but no horoos
3. The system reflects Mongolia's **centralized capital** vs **rural provinces**
4. Makes address input intuitive for Mongolian users 🇲🇳

---

## 🚀 Implementation Summary

Your app now supports:
- ✅ Proper Mongolian address hierarchy
- ✅ Dynamic form behavior (UB vs Aimag)
- ✅ Correct validation rules
- ✅ Database schema that matches real addresses
- ✅ User-friendly dropdowns with Mongolian names
- ✅ Flexible address detail field for specifics

**This system accurately represents how addresses work in Mongolia!** 🏠🇲🇳

---

📚 **Related Files:**
- `mongoliaAddresses.js` - Complete address data
- `src/pages/shop/profile.astro` - Profile form with dynamic fields
- `src/pages/api/profile/update.ts` - API handling aimag/sum/horoo
- Database: `profiles` table with aimag, sum, horoo columns
