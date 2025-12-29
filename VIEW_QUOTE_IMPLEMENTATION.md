# View Quotes Implementation Summary

**Date:** December 29, 2025  
**Component:** ViewQuotePage.jsx  
**Purpose:** Quote management interface with role-based functionality for admins and customers

---

## Features Implemented

### 1. Role-Based Access Control
- **Admin Users**: View ALL quotes from all customers with full management capabilities
- **Customer Users**: View ONLY their own submitted quotes
- **Automatic Detection**: Uses `user.userType === 'admin'` from Redux store to determine user role

### 2. Quote Listing Display
- **Responsive Table Layout**: Full-width table with horizontal scroll on mobile devices
- **Columns Displayed**:
  - Quote ID (last 6 characters for brevity)
  - Customer Name (admin only)
  - Service Type
  - From Location (city, state)
  - To Location (city, state)
  - Move Date
  - Status Badge (color-coded)
  - Estimated Price (or "-" if not set)
  - Submitted Date
  - Action Buttons
- **Sorting**: Quotes sorted by creation date (newest first)
- **Rounded Border Styling**: Consistent with application design

### 3. Status Filtering System
- **Filter Buttons**: All, Pending, Reviewed, Approved, Rejected
- **Count Badges**: Shows number of quotes in each status
- **Color-Coded**: Each status filter uses appropriate Bootstrap variant
  - All: Primary (blue)
  - Pending: Warning (yellow)
  - Reviewed: Info (cyan)
  - Approved: Success (green)
  - Rejected: Danger (red)
- **Active State**: Selected filter highlighted with solid color
- **Real-time Counts**: Updates automatically as quotes are modified

### 4. Quote Status Badges
- **Color Coding**:
  - Pending: Yellow (`warning`)
  - Reviewed: Cyan (`info`)
  - Approved: Green (`success`)
  - Rejected: Red (`danger`)
- **Capitalized Display**: First letter uppercase for professional appearance

### 5. View Quote Details Modal
- **Comprehensive Information Display**:
  - Quote ID
  - Current Status (large badge)
  - Service Type
  - Customer Information (admin only: name and email)
  - Complete From Address
  - Complete To Address
  - Move Date (formatted: "Monday, January 15, 2026")
  - Estimated Price (or "Not yet estimated")
  - Admin Notes (if any)
  - Submitted On (timestamp)
  - Last Updated (timestamp)
- **Quick Review Access**: Admin users have "Review Quote" button in footer
- **Large Modal**: Uses `size="lg"` for comfortable viewing
- **Centered Display**: Modal centered on screen

### 6. Review Quote Functionality (Admin Only)
- **Review Modal Features**:
  - Quote Summary Panel (customer, service, from/to locations)
  - Status Dropdown (Pending, Reviewed, Approved, Rejected)
  - Estimated Price Input (optional, decimal support)
  - Admin Notes Textarea (visible to customer)
  - Validation with Bootstrap feedback
- **Data Persistence**: Pre-fills with existing quote data
- **Optional Price**: Can save review without setting price
- **Success Feedback**: Green alert shown after successful update
- **Auto-refresh**: Quote list refreshes after review submission

### 7. Delete Quote Functionality
- **Confirmation Modal**: Shows quote details before deletion
- **Quote Summary Display**:
  - Quote ID
  - Customer Name (admin only)
  - From and To locations
  - Move Date
- **Warning Message**: Yellow alert with "This action cannot be undone"
- **Safe Design**: Requires explicit confirmation to delete
- **Role Permission**: Both admins and customers can delete quotes

### 8. State Management
- **Quotes State**: Array of quote objects
- **Loading State**: "Loading quotes..." message during fetch
- **Error State**: Red dismissible alert for errors
- **Success State**: Green dismissible alert for successful operations (auto-dismiss after 3 seconds)
- **Filter State**: Currently selected status filter
- **Modal States**: Separate states for details, review, and delete modals
- **Form State**: Review form data with validation state

### 9. API Integration
- **Admin Endpoints**:
  - `quoteService.getAllQuotes()` - Fetch all quotes from all users
  - `quoteService.updateQuote(id, data)` - Update quote status, price, notes
  - `quoteService.deleteQuote(id)` - Delete any quote
- **Customer Endpoints**:
  - `quoteService.getMyQuotes()` - Fetch only user's own quotes
  - `quoteService.deleteQuote(id)` - Delete own quotes
- **Auto-refresh**: List refreshes after any modification

### 10. User Experience Features
- **Empty State**: Info alert when no quotes match filter
- **Auto-dismiss Alerts**: Success messages disappear after 3 seconds
- **Responsive Design**: Table scrolls horizontally on small screens
- **Consistent Styling**: Matches application's rounded border pattern
- **Compact Action Buttons**: Small size buttons for space efficiency
- **Tooltips**: Button titles for accessibility
- **Loading State**: Clear indication during data fetch

---

## Technical Implementation

### Component Structure
```
ViewQuotePage
├── State Management (useState)
│   ├── quotes, loading, error, success
│   ├── statusFilter
│   ├── showDetailsModal, showReviewModal, showDeleteModal
│   ├── selectedQuote
│   └── reviewFormData, reviewValidated
├── Effects (useEffect)
│   └── fetchQuotes on mount (depends on isAdmin)
├── Event Handlers
│   ├── fetchQuotes() - Load quotes based on role
│   ├── getFilteredQuotes() - Apply status filter
│   ├── getStatusBadgeVariant() - Determine badge color
│   ├── formatAddress() - Format from/to addresses
│   ├── handleViewDetails() - Open details modal
│   ├── handleReviewClick() - Open review modal (admin)
│   ├── handleDeleteClick() - Open delete confirmation
│   ├── handleReviewChange() - Update review form data
│   ├── handleReviewSubmit() - Save quote review
│   ├── handleDeleteConfirm() - Execute deletion
│   └── handleCloseModals() - Close and reset modals
├── UI Elements
│   ├── Header with role-based title
│   ├── Alert components for error/success messages
│   ├── Status Filter Card with count badges
│   ├── Quotes Table with responsive design
│   ├── Quote Details Modal
│   ├── Review Quote Modal (admin only)
│   └── Delete Confirmation Modal
```

### Dependencies
- `react-bootstrap`: Container, Row, Col, Card, Button, Alert, Badge, Modal, Form, Table
- `react-redux`: useSelector to access user data
- `quoteService`: API client for quote CRUD operations

### Styling Approach
- **Bootstrap Table**: Responsive table with hover effects
- **Custom Rounded Borders**: 15px radius with 2px solid border (#dee2e6)
- **Badge Colors**: Status-specific Bootstrap variants
- **Button Variants**: outline-info (view), outline-primary (review), outline-danger (delete)
- **Responsive Grid**: Row/Col layout for filters and details
- **Small Button Size**: Compact action buttons in table

### Quote Schema Reference
```javascript
{
  _id: ObjectId,
  userId: { ref: User, populated },
  serviceId: { ref: Service, populated },
  fromStreetAddress, fromCity, fromState, fromZipCode,
  toStreetAddress, toCity, toState, toZipCode,
  moveDate: Date,
  status: 'pending' | 'reviewed' | 'approved' | 'rejected',
  estimatedPrice: Number (optional),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints Used

| Method | Endpoint | Purpose | Access | Called By |
|--------|----------|---------|--------|-----------|
| GET | `/api/quotes` | Fetch all quotes | Admin | fetchQuotes() (admin) |
| GET | `/api/quotes/user/my-quotes` | Fetch user's quotes | Authenticated | fetchQuotes() (customer) |
| PUT | `/api/quotes/:id` | Update quote | Admin | handleReviewSubmit() |
| DELETE | `/api/quotes/:id` | Delete quote | Admin/Owner | handleDeleteConfirm() |

---

## Usage Instructions

### For Admin Users
1. **View All Quotes**: Navigate to "View Quote" from left navbar
2. **Filter Quotes**: Click status filter buttons to show specific quote types
3. **View Details**: Click "View" button on any quote
   - See complete quote information
   - View customer details and contact info
   - Check admin notes if any
4. **Review Quote**: Click "Review" button or "Review Quote" in details modal
   - Change status (Pending → Reviewed → Approved/Rejected)
   - Set estimated price
   - Add notes for customer
   - Submit review
5. **Delete Quote**: Click "Delete" button
   - Confirm deletion in modal
   - Quote removed from system

### For Customer Users
1. **View My Quotes**: Navigate to "View Quote" from left navbar
2. **Filter My Quotes**: Click status filter buttons
3. **View Details**: Click "View" button to see:
   - Current status
   - Estimated price (if set by admin)
   - Admin notes
   - Complete move details
4. **Delete Quote**: Click "Delete" button to remove unwanted quotes

### Status Workflow
1. **Pending**: Initial status when quote submitted
2. **Reviewed**: Admin has reviewed the quote
3. **Approved**: Quote approved, ready to proceed
4. **Rejected**: Quote rejected with reason in notes

### Error Handling
- **Network Errors**: Red alert with error message
- **Validation Errors**: Inline form feedback in review modal
- **Delete Failures**: Error alert displayed
- **Update Failures**: Error shown in modal

### Success Feedback
- **Update Success**: "Quote #[ID] updated successfully!" (3 seconds)
- **Delete Success**: "Quote #[ID] deleted successfully!" (3 seconds)

---

## Current Database State
- **2 Quotes**: Both from Robert Davis (robert.davis@email.com)
  - Quote #201522: Ann Arbor → Riverview, MI (Move: 1/11/2026, Status: pending)
  - Quote #2790f0: Grand Rapids → Kentwood, MI (Move: 2/26/2026, Status: pending)
- **Quote Schema**: Complete with all from/to fields, status, estimatedPrice, notes

---

## Feature Comparison: Admin vs Customer

| Feature | Admin | Customer |
|---------|-------|----------|
| View All Quotes | ✅ Yes | ❌ No (only own) |
| Filter by Status | ✅ Yes | ✅ Yes |
| View Quote Details | ✅ Yes (includes customer info) | ✅ Yes |
| Review Quote | ✅ Yes | ❌ No |
| Set Status | ✅ Yes | ❌ No |
| Set Estimated Price | ✅ Yes | ❌ No |
| Add Notes | ✅ Yes | ❌ No |
| Delete Quote | ✅ Yes (any quote) | ✅ Yes (own only) |
| See Customer Column | ✅ Yes | ❌ No |

---

## Next Steps (Future Enhancements)
1. **Export Functionality**: Download quotes as CSV/PDF
2. **Email Notifications**: Notify customer when status changes
3. **Quote History**: Track status change history
4. **Bulk Actions**: Select multiple quotes for batch operations
5. **Advanced Filters**: Filter by date range, customer, service type
6. **Search Functionality**: Search quotes by customer name, location, etc.
7. **Quote Statistics**: Dashboard widget showing quote metrics
8. **Price Calculator**: Tool to help estimate prices based on distance/service
9. **Quote Templates**: Pre-defined pricing for common routes
10. **Customer Portal**: Separate view optimized for customer experience

---

## Testing Checklist
- ✅ Admin can view all quotes from all users
- ✅ Customer can view only their own quotes
- ✅ Loading state displays correctly
- ✅ Status filtering works for all statuses
- ✅ Filter counts update correctly
- ✅ Quote details modal displays complete information
- ✅ Admin can review and update quote status
- ✅ Admin can set estimated price
- ✅ Admin can add notes
- ✅ Review form validation works
- ✅ Quote updates successfully
- ✅ Delete confirmation shows quote details
- ✅ Quote deletes successfully
- ✅ Success alerts auto-dismiss after 3 seconds
- ✅ Error alerts display and are dismissible
- ✅ Responsive table scrolls on mobile
- ✅ Status badges color-coded correctly
- ✅ Quote list refreshes after modifications
- ✅ Customer column shows only for admins
- ✅ Review button shows only for admins

---

## Security Considerations
- ✅ Backend enforces admin authorization for getAllQuotes endpoint
- ✅ Backend enforces admin authorization for updateQuote endpoint
- ✅ Backend enforces ownership for getMyQuotes endpoint
- ✅ Backend enforces ownership for deleteQuote endpoint
- ✅ Frontend hides admin features from customers
- ✅ User role verified from Redux store (server-validated)

---

**Implementation Status:** ✅ COMPLETE  
**File Location:** `client/src/pages/ViewQuotePage.jsx`  
**Lines of Code:** 653 lines  
**Protected:** Yes (via ProtectedRoute in AppRoutes.jsx)  
**Role-Based:** Yes (Admin vs Customer functionality)  
**Production Ready:** Yes
