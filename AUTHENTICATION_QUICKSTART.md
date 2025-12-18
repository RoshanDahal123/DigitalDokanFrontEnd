# Authentication System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running
- Email service configured (Gmail SMTP recommended)

### Environment Setup

Create/update your `.env` file in the server directory:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/mern-ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Server
PORT=4000
```

### Installation & Running

```bash
# Install dependencies
cd server
npm install

cd ../client
npm install

# Run the application
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## 📋 Testing the Features

### 1. Test User Registration

1. Navigate to `http://localhost:5173/register`
2. Fill in the form:
   - **Username:** testuser
   - **Email:** valid@email.com
   - **Password:** Test@1234 (must meet requirements)
3. Click "Register"
4. ✅ Success: You should see a green success message
5. ✅ Email: Check inbox for welcome email
6. ✅ Redirect: Auto-redirected to login after 2 seconds

**Test Invalid Data:**
- Invalid email: `notanemail` → Should show error
- Weak password: `test123` → Should show password requirements error

### 2. Test Login

1. Navigate to `http://localhost:5173/login`
2. Enter registered credentials
3. Click "Login"
4. ✅ Success: Redirected to home page
5. ✅ Token: Check localStorage for token

**Test Invalid Login:**
- Wrong password → "Credentials not matched"
- Non-existent email → "Credentials not matched"

### 3. Test Forgot Password Flow

#### Step A: Request Password Reset
1. Click "Forgot Password?" on login page
2. Enter registered email
3. Click "Send Reset OTP"
4. ✅ Check email for OTP code (6 digits)
5. ✅ Success message shown
6. ✅ Auto-redirect to verify OTP page

#### Step B: Verify OTP
1. Enter the 6-digit OTP from email
2. Click "Verify OTP"
3. ✅ Success message shown
4. ✅ Auto-redirect to reset password page

**Note:** OTP expires in 2 minutes. If expired, click "Resend OTP"

#### Step C: Reset Password
1. Enter new password (must meet requirements)
2. Confirm new password
3. Click "Reset Password"
4. ✅ Success message shown
5. ✅ Auto-redirect to login page after 3 seconds
6. ✅ Test login with new password

### 4. Test Admin Login

1. Login with admin credentials
2. ✅ Should redirect to `/admin` dashboard
3. ✅ Check localStorage for `adminToken`

## 🎯 Feature Checklist

### Registration
- [ ] Email validation works
- [ ] Password strength validation works
- [ ] Error messages display correctly
- [ ] Success message displays
- [ ] Welcome email received
- [ ] Auto-redirect to login works
- [ ] Loading state shows during submission

### Login
- [ ] Valid credentials work
- [ ] Invalid credentials show generic error
- [ ] Token stored in localStorage
- [ ] Admin redirects to /admin
- [ ] User redirects to /
- [ ] "Forgot Password" link works
- [ ] Loading state shows

### Password Reset
- [ ] Email sent with OTP
- [ ] OTP verification works
- [ ] OTP expiration (2 min) works
- [ ] Resend OTP works
- [ ] Password reset successful
- [ ] Can login with new password
- [ ] Password validation enforced

### Security
- [ ] Passwords not visible in requests
- [ ] Generic error messages (no user enumeration)
- [ ] Tokens properly stored
- [ ] OTP expires correctly
- [ ] Password strength enforced

### UX
- [ ] Success messages clear and helpful
- [ ] Error messages clear and helpful
- [ ] Loading states prevent double-submission
- [ ] Forms properly labeled (accessibility)
- [ ] Auto-redirects smooth
- [ ] Back navigation works

## 🐛 Troubleshooting

### Email Not Received
1. Check spam folder
2. Verify SMTP credentials in `.env`
3. For Gmail: Use App Password, not account password
4. Check server logs for email errors

### OTP Expired
- OTP is valid for 2 minutes only
- Click "Resend OTP" to get a new one
- Check email timestamp

### Token Issues
- Clear browser localStorage
- Check if token exists: `localStorage.getItem('token')`
- Verify backend JWT_SECRET is set

### Registration Fails
- Check if email already registered
- Verify password meets all requirements
- Check backend validation rules
- Look at Network tab for specific error

### Login Redirects Wrong
- Admin should have role='admin' in database
- Check token storage (admin vs user)
- Clear localStorage and try again

## 📧 Email Templates

The system sends these emails:

1. **Registration Welcome Email**
   - Subject: "Registration successful on Digital Dookan"
   - Content: Welcome message

2. **Password Reset OTP Email**
   - Subject: "Digital Dookan Password change Request"
   - Content: OTP code (6 digits)
   - Valid for: 2 minutes

3. **Login Notification Email**
   - Subject: "Login successful on Digital Dookan"
   - Content: Login confirmation

## 🔐 Security Best Practices Implemented

✅ **Password Requirements:**
- Minimum 8 characters
- Uppercase + lowercase + number + special char
- Validated on both frontend and backend

✅ **Error Messages:**
- Generic messages prevent user enumeration
- No distinction between wrong email vs wrong password

✅ **Token Security:**
- JWT tokens with expiration
- Separate admin and user tokens
- Stored in localStorage (consider httpOnly cookies for production)

✅ **OTP Security:**
- Time-limited (2 minutes)
- One-time use
- Securely stored with expiration

## 🎨 UI Components

### Notification Component
Reusable component for all messages:
```tsx
import Notification from "../../globals/component/Notification";

<Notification 
  message="Success!" 
  type="success"  // success, error, warning, info
  onClose={() => handleClose()}
  duration={5000}
/>
```

### Form Patterns
All forms follow consistent pattern:
- Labels with htmlFor
- Input IDs matching labels
- Placeholders for guidance
- Error/Success messages
- Loading states
- Disabled buttons during processing

## 📱 Testing on Mobile

The UI is responsive and works on mobile devices:
- Test on Chrome DevTools mobile view
- Forms are touch-friendly
- Messages are readable
- Navigation works on small screens

## 🚀 Production Deployment

Before deploying:

1. **Update Environment Variables:**
   - Change JWT_SECRET to strong random string
   - Use production email service
   - Update CORS settings
   - Set secure cookie flags

2. **Security Enhancements:**
   - Enable HTTPS
   - Use httpOnly cookies for tokens
   - Add rate limiting
   - Implement CAPTCHA

3. **Email Service:**
   - Consider SendGrid, AWS SES, or Mailgun
   - Set up proper SPF/DKIM records
   - Use email templates

## 📚 Additional Resources

- [JWT Documentation](https://jwt.io/)
- [React Router Documentation](https://reactrouter.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Nodemailer Documentation](https://nodemailer.com/)

## 💡 Tips

1. **Development:** Use MailHog or similar for testing emails locally
2. **Testing:** Create test accounts with pattern like `test+1@email.com`
3. **Debugging:** Check browser console and Network tab
4. **Database:** Use MongoDB Compass to view user data
5. **Tokens:** Use jwt.io to decode and inspect tokens

---

**Need Help?** Check the main documentation: [AUTHENTICATION_IMPLEMENTATION.md](AUTHENTICATION_IMPLEMENTATION.md)
