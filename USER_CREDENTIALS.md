# Star Movers - User Credentials
**Date:** December 23, 2025
**Status:** All passwords verified and working

---

## Admin Users

### John Anderson
- **Email:** john.anderson@starmovers.com
- **Password:** eUdiuwPyGB
- **Role:** Admin

### Sarah Mitchell
- **Email:** sarah.mitchell@starmovers.com
- **Password:** z7wYYcBMfE
- **Role:** Admin

### Michael Roberts
- **Email:** michael.roberts@starmovers.com
- **Password:** GR5XNUAu5p
- **Role:** Admin

---

## Customer Users

### Emily Johnson
- **Email:** emily.johnson@email.com
- **Password:** fjdkQwP8Xm

### David Williams
- **Email:** david.williams@email.com
- **Password:** nR3pTsLwK7

### Jennifer Brown
- **Email:** jennifer.brown@email.com
- **Password:** YvHg9mNcU2

### Robert Davis
- **Email:** robert.davis@email.com
- **Password:** bZx5KjPqW4

### Lisa Miller
- **Email:** lisa.miller@email.com
- **Password:** aEr7VmNtH8

### James Wilson
- **Email:** james.wilson@email.com
- **Password:** cMp4XqDfL9

### Maria Garcia
- **Email:** maria.garcia@email.com
- **Password:** gJw6YhRkN3

### Matthew Jackson
- **Email:** matthew.jackson@email.com
- **Password:** dKt8BnZvM5

### Amanda Taylor
- **Email:** amanda.taylor@email.com
- **Password:** hLq2WpFsJ6

### Christopher Martinez
- **Email:** chris.martinez@email.com
- **Password:** eTy9GmXcR7

### Jessica Thomas
- **Email:** jessica.thomas@email.com
- **Password:** fNx3HkVbP8

### Daniel Anderson
- **Email:** daniel.anderson@email.com
- **Password:** jQr4KpYdT9

### Bob James
- **Email:** bobby@hotmail.com
- **Password:** kWs5LmZfN2

### Test User
- **Email:** testuser456@test.com
- **Password:** mCv6PnXgH3

---

## Notes

- All passwords are 10 characters long (alphanumeric)
- Passwords are properly hashed in the database using bcrypt
- Each password is unique
- Login at: http://localhost:5173

## Technical Details

**Issue Fixed:** The original password reset script was hashing passwords before saving, but the User model's pre-save hook was hashing them again (double hashing). This has been corrected by setting plain text passwords and allowing the pre-save hook to handle the hashing.

**Verification:** All 17 users have been verified with bcrypt.compare() to ensure passwords work correctly.
