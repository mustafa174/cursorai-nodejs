# 🔐 OTP-Based Login Flow Diagram

## Visual Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         OTP-BASED LOGIN FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. POST /api/auth/signin
     │    { email, password }
     ▼
┌─────────────────┐
│     Server      │
│                 │
│ ┌─────────────┐ │
│ │ Verify      │ │
│ │ Credentials │ │
│ └──────┬──────┘ │
│        │        │
│        ▼        │
│ ┌─────────────┐ │
│ │  Generate   │ │
│ │  6-digit    │ │
│ │    OTP      │ │
│ └──────┬──────┘ │
│        │        │
│        ▼        │
│ ┌─────────────┐ │
│ │ Save OTP    │ │
│ │ in DB with  │ │
│ │ 5min expiry │ │
│ └──────┬──────┘ │
└────────┼────────┘
         │
         │ 2. Response
         │    { userId, otp }
         ▼
     ┌────────┐
     │ Client │
     │        │
     │ Store  │
     │ userId │
     │ & OTP  │
     └───┬────┘
         │
         │ 3. POST /api/auth/verify-otp
         │    { userId, otp }
         ▼
    ┌─────────────────┐
    │     Server      │
    │                 │
    │ ┌─────────────┐ │
    │ │ Find User   │ │
    │ │ by userId   │ │
    │ └──────┬──────┘ │
    │        │        │
    │        ▼        │
    │ ┌─────────────┐ │
    │ │ Verify OTP  │ │
    │ │ & Check     │ │
    │ │ Expiry      │ │
    │ └──────┬──────┘ │
    │        │        │
    │        ▼        │
    │ ┌─────────────┐ │
    │ │ Generate    │ │
    │ │ JWT Token   │ │
    │ └──────┬──────┘ │
    │        │        │
    │        ▼        │
    │ ┌─────────────┐ │
    │ │ Clear OTP   │ │
    │ │ from DB     │ │
    │ └──────┬──────┘ │
    └────────┼────────┘
             │
             │ 4. Response
             │    { token, user }
             ▼
         ┌────────┐
         │ Client │
         │        │
         │ Store  │
         │ Token  │
         │        │
         │ ✅ Login
         │ Complete
         └────────┘
```

## Step-by-Step Breakdown

### Step 1: Sign In (Credential Verification)
```
Client → Server

Request:
POST /api/auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}

Server Process:
1. Find user by email
2. Compare password hash
3. If valid:
   - Generate 6-digit OTP
   - Set expiry (5 minutes from now)
   - Save OTP to user document
   - (Optional) Send OTP via email

Response:
{
  "success": true,
  "code": 200,
  "message": "OTP generated successfully. Please verify to complete login.",
  "data": {
    "userId": "68f78b723042a7d624fd8ad8",
    "otp": "380163"
  }
}
```

### Step 2: Verify OTP (Complete Login)
```
Client → Server

Request:
POST /api/auth/verify-otp
{
  "userId": "68f78b723042a7d624fd8ad8",
  "otp": "380163"
}

Server Process:
1. Find user by userId
2. Check if OTP exists
3. Check if OTP matches
4. Check if OTP has expired
5. If all valid:
   - Generate JWT token
   - Mark email as verified
   - Clear OTP from database
   - Return token

Response:
{
  "success": true,
  "code": 200,
  "message": "OTP verified successfully. Login complete.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "68f78b723042a7d624fd8ad8",
      "name": "John Doe",
      "email": "user@example.com",
      "isEmailVerified": true
    }
  }
}
```

## Error Handling Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      ERROR SCENARIOS                          │
└──────────────────────────────────────────────────────────────┘

Sign-In Errors:
├─ Invalid email         → 401: "Invalid email or password"
├─ Invalid password      → 401: "Invalid email or password"
├─ User not found        → 401: "Invalid email or password"
└─ Missing fields        → 400: "Please provide email and password"

Verify OTP Errors:
├─ Invalid userId format → 400: "Please provide a valid user ID"
├─ User not found        → 400: "User not found"
├─ No OTP in database    → 400: "No OTP found for this user"
├─ Wrong OTP             → 400: "Invalid OTP"
├─ Expired OTP           → 400: "OTP has expired"
└─ Missing fields        → 400: "Please provide userId and OTP"
```

## Database State Changes

```
┌──────────────────────────────────────────────────────────────┐
│                   DATABASE STATE FLOW                         │
└──────────────────────────────────────────────────────────────┘

Initial State (Before Login):
{
  "_id": "68f78b723042a7d624fd8ad8",
  "email": "user@example.com",
  "password": "$2b$10$hashed...",
  "otp": null,
  "otpExpires": null,
  "isEmailVerified": false
}
         │
         │ After Step 1 (Signin)
         ▼
{
  "_id": "68f78b723042a7d624fd8ad8",
  "email": "user@example.com",
  "password": "$2b$10$hashed...",
  "otp": "380163",                    ← OTP stored
  "otpExpires": "2025-10-21T13:49:00", ← 5 min expiry
  "isEmailVerified": false
}
         │
         │ After Step 2 (Verify OTP)
         ▼
{
  "_id": "68f78b723042a7d624fd8ad8",
  "email": "user@example.com",
  "password": "$2b$10$hashed...",
  "otp": null,                        ← OTP cleared
  "otpExpires": null,                 ← Expiry cleared
  "isEmailVerified": true             ← Email verified
}
```

## Security Considerations

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY FEATURES                          │
└──────────────────────────────────────────────────────────────┘

✓ OTP Expiration
  └─ 5-minute validity window
  └─ Prevents replay attacks

✓ Single-Use OTP
  └─ OTP deleted after use
  └─ Cannot reuse the same OTP

✓ No Token Until Verified
  └─ JWT only issued after OTP verification
  └─ Prevents token theft during transmission

✓ Secure Storage
  └─ OTP field has select: false
  └─ Not included in default queries

✓ Password Hashing
  └─ Bcrypt with salt rounds
  └─ Passwords never stored in plain text

✓ Rate Limiting
  └─ Applied to both endpoints
  └─ Prevents brute force attacks

✓ Same Error Message
  └─ "Invalid email or password" for all auth failures
  └─ Doesn't reveal if email exists
```

## cURL Examples

### Complete Login Flow
```bash
# Step 1: Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Save userId and otp from response

# Step 2: Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "otp": "YOUR_OTP"
  }'

# Save token from response

# Step 3: Use token for authenticated requests
curl -X GET http://localhost:5000/api/protected-route \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## JavaScript/Frontend Example

```javascript
// Step 1: Sign in
const signinResponse = await fetch('http://localhost:5000/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data: { userId, otp } } = await signinResponse.json();

// In production, user would receive OTP via email
// For local dev, we have it in the response

// Step 2: Verify OTP
const verifyResponse = await fetch('http://localhost:5000/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId,
    otp
  })
});

const { data: { token, user } } = await verifyResponse.json();

// Store token (localStorage, sessionStorage, cookie, etc.)
localStorage.setItem('authToken', token);

// Use token for authenticated requests
const protectedResponse = await fetch('http://localhost:5000/api/protected-route', {
  headers: { 
    'Authorization': `Bearer ${token}`
  }
});
```

## Time-Based Flow

```
Time: 0:00
  │
  └─ User enters email/password
  │
Time: 0:01
  │
  └─ Server verifies credentials
  │
  └─ Server generates OTP: "380163"
  │
  └─ Server sets expiry: 0:06 (5 minutes)
  │
  └─ Response: { userId, otp }
  │
Time: 0:02
  │
  └─ User receives OTP
  │
Time: 0:03
  │
  └─ User enters OTP
  │
  └─ Server verifies OTP
  │
  └─ Server generates JWT
  │
  └─ Server clears OTP
  │
  └─ Response: { token, user }
  │
Time: 0:04
  │
  └─ ✅ Login Complete
  │
Time: 0:06
  │
  └─ ⚠️ OTP Expires (if not used)
  │
  └─ User must request new OTP (sign in again)
```

## Production vs Development

### Development (Current)
```
OTP returned in response
  ↓
{ "userId": "...", "otp": "380163" }
  ↓
Easy testing without email setup
```

### Production (Recommended)
```
OTP NOT in response
  ↓
{ "userId": "...", "message": "OTP sent to your email" }
  ↓
OTP only sent via email
  ↓
More secure
```

To switch to production mode, simply remove the `otp` field from the signin response in `src/services/auth.service.ts`.

---

**For more details, see `OTP_LOGIN_FLOW.md`**

