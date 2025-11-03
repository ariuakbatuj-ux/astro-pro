# Quick Verification Script
# Run this after completing setup to verify everything works

Write-Host "`n🔍 Checking Supabase Configuration..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
    
    # Read .env content
    $envContent = Get-Content ".env" -Raw
    
    # Check Supabase URL
    if ($envContent -match 'SUPABASE_URL=https://onbpsjzgzcfnucikheso\.supabase\.co') {
        Write-Host "✅ Supabase URL configured correctly" -ForegroundColor Green
    } else {
        Write-Host "❌ Supabase URL not configured" -ForegroundColor Red
    }
    
    # Check Anon Key
    if ($envContent -match 'SUPABASE_ANON_KEY=eyJ') {
        Write-Host "✅ Supabase Anon Key configured" -ForegroundColor Green
    } elseif ($envContent -match 'SUPABASE_ANON_KEY=your-anon-key') {
        Write-Host "❌ Supabase Anon Key NOT configured (still placeholder)" -ForegroundColor Red
        Write-Host "   👉 Get it from: https://supabase.com/dashboard/project/onbpsjzgzcfnucikheso/settings/api" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Supabase Anon Key may not be configured correctly" -ForegroundColor Yellow
    }
    
    # Check JWT Secret
    if ($envContent -match 'JWT_SECRET=.{32,}') {
        Write-Host "✅ JWT Secret configured" -ForegroundColor Green
    } else {
        Write-Host "❌ JWT Secret not configured" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

Write-Host "`n🌐 Testing Server Connection..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Test if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4322" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Development server is running on port 4322" -ForegroundColor Green
} catch {
    Write-Host "❌ Development server not responding" -ForegroundColor Red
    Write-Host "   👉 Start it with: npm run dev" -ForegroundColor Yellow
}

Write-Host "`n🔐 Testing Authentication API..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

try {
    $body = '{"emailOrUsername":"admin","password":"admin123"}'
    $response = Invoke-RestMethod -Uri "http://localhost:4322/api/auth/signin" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 5 `
        -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "✅ Admin authentication working!" -ForegroundColor Green
        Write-Host "   User: $($response.user.username)" -ForegroundColor Gray
        Write-Host "   Role: $($response.user.role)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Authentication returned unexpected response" -ForegroundColor Yellow
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 503) {
        Write-Host "⚠️  Authentication API returned 503 (Supabase not fully configured)" -ForegroundColor Yellow
        Write-Host "   This is normal if you haven't added the Anon Key yet" -ForegroundColor Gray
    } else {
        Write-Host "❌ Authentication test failed: $_" -ForegroundColor Red
    }
}

Write-Host "`n📦 Testing Products API..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4322/api/products?featured=true" `
        -TimeoutSec 5 `
        -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "✅ Products API working!" -ForegroundColor Green
        Write-Host "   Products found: $($response.count)" -ForegroundColor Gray
        Write-Host "   Data source: $($response.source)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Products API returned unexpected response" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Products API test failed: $_" -ForegroundColor Red
}

Write-Host "`n📊 Summary" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Quick links:" -ForegroundColor White
Write-Host "  • Test Page: http://localhost:4322/test-auth.html" -ForegroundColor Gray
Write-Host "  • Sign In: http://localhost:4322/signin" -ForegroundColor Gray
Write-Host "  • Sign Up: http://localhost:4322/signup" -ForegroundColor Gray
Write-Host "  • Products: http://localhost:4322/products-test" -ForegroundColor Gray
Write-Host "  • Supabase Dashboard: https://supabase.com/dashboard/project/onbpsjzgzcfnucikheso`n" -ForegroundColor Gray

Write-Host "Need help? Check these files:" -ForegroundColor White
Write-Host "  • FINAL_SETUP_STEPS.md - Complete setup guide" -ForegroundColor Gray
Write-Host "  • GET_ANON_KEY.md - How to get your Anon Key" -ForegroundColor Gray
Write-Host "  • AUTH_TROUBLESHOOTING.md - Fix auth issues`n" -ForegroundColor Gray