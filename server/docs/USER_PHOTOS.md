# User Photo Management

## Overview

The User model includes a `photoFilename` field that stores the filename of a user's profile photo. Photo files are stored in the `client/src/assets/images/` directory and referenced by filename only (not full path or image data).

## photoFilename Field

- **Type:** String
- **Default:** `null`
- **Format:** Must be a `.jpg` file
- **Naming Convention:** Should match user's first and last name
  - Format 1: `FirstName LastName.jpg` (e.g., "John Anderson.jpg")
  - Format 2: `FirstName_LastName.jpg` (e.g., "John_Anderson.jpg")
- **Optional:** Not all users need to have a photo

## Storage Location

User photos are stored in: `client/src/assets/images/`

**Important:** Only the filename is stored in the database, not the image data itself. Frontend components will construct the full path when displaying images.

## Updating User Photos

### Automatic Update Script

The `updateUserPhotos.js` utility script automatically matches users to photo files based on their first and last names.

**Location:** `server/utils/updateUserPhotos.js`

**Usage:**
```bash
cd server
node utils/updateUserPhotos.js
```

**What it does:**
1. Scans `client/src/assets/images/` for `.jpg` files
2. Matches files to users based on firstName and lastName
3. Updates `photoFilename` field for users with matching photos
4. Sets `photoFilename` to `null` for users without photos
5. Provides a summary of updates

**Example Output:**
```
Found 10 .jpg files in images directory
Found 17 users in database

✓ Updated John Anderson with photo: John_Anderson.jpg
✓ Updated Sarah Mitchell with photo: Sarah_Mitchell.jpg
  No photo for Bob James (expected: Bob James.jpg or Bob_James.jpg)

--- Summary ---
Total users processed: 17
Users with photos: 9
Users without photos: 8
```

### Manual Update

You can manually update a user's photo filename through the API or database:

**Via MongoDB:**
```javascript
await User.findByIdAndUpdate(userId, { 
  photoFilename: 'John_Anderson.jpg' 
});
```

**Via API (future feature):**
```http
PATCH /api/users/:id
Content-Type: application/json

{
  "photoFilename": "John_Anderson.jpg"
}
```

## API Response

When fetching user data, the `photoFilename` field is automatically included:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Anderson",
    "email": "john.anderson@movingco.com",
    "photoFilename": "John_Anderson.jpg",
    "userType": "admin",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

If a user has no photo, the field will be `null`:

```json
{
  "photoFilename": null
}
```

## Frontend Usage

In React components, construct the image path using the filename:

```jsx
import { useState, useEffect } from 'react';

function UserAvatar({ user }) {
  const getImagePath = (filename) => {
    if (!filename) return '/default-avatar.jpg';
    return `/src/assets/images/${filename}`;
  };

  return (
    <img 
      src={getImagePath(user.photoFilename)} 
      alt={user.fullName}
      className="user-avatar"
    />
  );
}
```

**Alternative using import.meta.url (Vite):**

```jsx
function UserAvatar({ user }) {
  if (!user.photoFilename) {
    return <img src="/default-avatar.jpg" alt="User" />;
  }

  const imagePath = new URL(
    `../assets/images/${user.photoFilename}`, 
    import.meta.url
  ).href;

  return <img src={imagePath} alt={user.fullName} />;
}
```

## Adding New User Photos

1. **Prepare the photo:**
   - Save as `.jpg` format
   - Name using format: `FirstName_LastName.jpg` or `FirstName LastName.jpg`
   - Example: `Maria_Garcia.jpg`

2. **Add to images directory:**
   ```bash
   # Copy photo to images folder
   cp path/to/photo.jpg client/src/assets/images/Maria_Garcia.jpg
   ```

3. **Run the update script:**
   ```bash
   cd server
   node utils/updateUserPhotos.js
   ```

4. **Verify:**
   ```bash
   # Check the user was updated
   node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/moving-company'); const User = require('./models/User'); User.findOne({ firstName: 'Maria', lastName: 'Garcia' }).then(user => { console.log('Photo:', user.photoFilename); mongoose.connection.close(); });"
   ```

## Database Schema

```javascript
photoFilename: {
  type: String,
  trim: true,
  default: null,
  match: [/^[a-zA-Z0-9_\-\s.]+\.jpg$/i, 'Photo filename must be a .jpg file']
}
```

## Notes

- Only `.jpg` format is currently supported
- Photos are not returned as binary data in API responses
- The filename validation regex allows letters, numbers, spaces, underscores, hyphens, and periods
- Case-insensitive matching for `.jpg` extension
- Frontend components must handle `null` photoFilename gracefully
- Consider implementing image upload feature for users to set their own photos
- Consider adding image optimization/resizing when photos are uploaded

## Future Enhancements

- [ ] Support additional image formats (.png, .jpeg, .webp)
- [ ] Implement profile photo upload endpoint
- [ ] Add image validation (size, dimensions)
- [ ] Create image thumbnail generation
- [ ] Add default avatar images
- [ ] Implement image CDN integration
- [ ] Add photo cropping/editing interface
