# Transport Communication - API Endpoints

## Overview

This document details the backend API endpoints used by the transport communication feature, including request/response formats and key integration points.

## Trip Management Endpoints

### Create Trip
**Endpoint**: `POST /trips/`

**Purpose**: Creates a new trip and initiates the transport workflow

**Request Body**:
```javascript
{
  "name": "Morning Pickup - Route A",
  "trip_type": "morning_pickup" | "evening_dropoff",
  "trip_action": "pickup" | "dropoff",
  "trip_status": "ongoing",
  "school": "school_id",
  "vehicle": "vehicle_id", 
  "driver": "driver_id",
  "trip_teacher": "teacher_id",
  "route": "route_id",
  "start_location": "School",
  "end_location": "School",
  "departure_time": "2025-07-03T08:00:00Z",
  "arrival_time": null
}
```

**Response**:
```javascript
{
  "id": "trip_id",
  "name": "Morning Pickup - Route A",
  "trip_type": "morning_pickup",
  "trip_status": "ongoing",
  // ... all trip fields
  "created_at": "2025-07-03T08:00:00Z",
  "updated_at": "2025-07-03T08:00:00Z"
}
```

**Frontend Integration**:
- Triggered from trip creation form
- Response automatically stored in `useOngoingTripStore`
- User redirected to trip management interface

### Update Trip
**Endpoint**: `PUT /trips/{tripId}/`

**Purpose**: Updates trip status and student tracking data

**Request Body**:
```javascript
{
  "trip_status": "completed" | "cancelled",
  "expected_students": ["student_id_1", "student_id_2"],
  "boarded_students": ["student_id_1"],
  "arrival_time": "2025-07-03T09:30:00Z",
  // ... other trip fields to update
}
```

**Key Use Cases**:
- Trip completion with student attendance data
- Trip cancellation with reason tracking
- Status updates during trip execution

### Get Trip by ID
**Endpoint**: `GET /trips/{tripId}/`

**Purpose**: Retrieves detailed trip information

**Response**: Same as create trip response

## Student Data Endpoints

### Get Students by Route
**Endpoint**: `GET /students/`

**Query Parameters**:
- `station__route`: Route ID to filter students
- `page`: Pagination page number
- `page_size`: Results per page

**Request Example**:
```
GET /students/?station__route=route_123&page=1&page_size=10
```

**Response**:
```javascript
{
  "count": 25,
  "next": "http://api/students/?page=2&station__route=route_123",
  "previous": null,
  "results": [
    {
      "id": "student_id",
      "first_name": "John",
      "last_name": "Doe", 
      "class_name": "Grade 5",
      "parent_name": "Jane Doe",
      "parent_phone": "+1234567890",
      "parent_email": "jane.doe@email.com",
      "station": {
        "id": "station_id",
        "name": "Station A",
        "route": "route_123"
      }
    }
  ]
}
```

**Frontend Integration**:
- Used by `useStudentsByRoute(routeId)` hook
- Enables infinite scrolling for large student lists
- Filters students by route assignment

## Communication Endpoints

### Send Trip Messages
**Endpoint**: `POST /trips/send-messages/`

**Purpose**: Sends SMS notifications to parents for selected students

**Request Body**:
```javascript
{
  "tripId": "trip_id",
  "studentIds": ["student_id_1", "student_id_2"],
  "messageType": "boarding" | "dropoff" | "arrival",
  "customMessage": "Optional custom message text"
}
```

**Response**:
```javascript
{
  "success": true,
  "messages_sent": 2,
  "failed_messages": 0,
  "message_details": [
    {
      "student_id": "student_id_1",
      "parent_phone": "+1234567890",
      "status": "sent",
      "message_id": "msg_123"
    }
  ]
}
```

**Message Templates**:
- **Boarding**: "Your child [Name] has boarded the school bus for [Trip Type]"
- **Dropoff**: "Your child [Name] has been dropped off safely"
- **Arrival**: "The school bus is arriving at [Location] in approximately [Time]"

### Get Message History
**Endpoint**: `GET /trips/{tripId}/messages/`

**Purpose**: Retrieves message history for a specific trip

**Response**:
```javascript
{
  "results": [
    {
      "id": "message_id",
      "student": "student_id",
      "parent_phone": "+1234567890",
      "message_type": "boarding",
      "message_text": "Your child John has boarded the school bus",
      "status": "delivered",
      "sent_at": "2025-07-03T08:15:00Z",
      "delivered_at": "2025-07-03T08:15:30Z"
    }
  ]
}
```

## Authentication & Authorization

### Required Headers
All API requests require authentication:

```javascript
headers: {
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

### Role-Based Access

**Trip Teacher**:
- Can create and manage trips they are assigned to
- Can send messages for their trips
- Can view students on their assigned routes

**School Admin**:
- Can view all trips for their school
- Can manage trip assignments
- Can access message history and analytics

**Super Admin**:
- Full access to all trips across schools
- System-wide analytics and management

## Error Handling

### Common Error Responses

**400 Bad Request**:
```javascript
{
  "error": "validation_error",
  "details": {
    "trip_type": ["This field is required"],
    "route": ["Invalid route ID"]
  }
}
```

**403 Forbidden**:
```javascript
{
  "error": "permission_denied",
  "message": "You don't have permission to access this trip"
}
```

**404 Not Found**:
```javascript
{
  "error": "not_found", 
  "message": "Trip with ID 'trip_123' not found"
}
```

**500 Internal Server Error**:
```javascript
{
  "error": "internal_error",
  "message": "An unexpected error occurred",
  "request_id": "req_123456"
}
```

## Rate Limiting

### Message Sending Limits
- **Per Trip**: Maximum 100 messages per trip
- **Per Hour**: Maximum 500 messages per user per hour
- **Per Day**: Maximum 2000 messages per school per day

### API Rate Limits
- **General APIs**: 1000 requests per hour per user
- **Trip Creation**: 10 trips per hour per user
- **Student Queries**: 100 requests per hour per user

## Integration Examples

### Frontend Hook Integration

```javascript
// Create trip with error handling
const { mutate: createTrip } = useCreateTrip();

const handleCreateTrip = (formData) => {
  createTrip(formData, {
    onSuccess: (trip) => {
      // Trip automatically stored in ongoing trip store
      router.push('/trip_teacher/trip-students');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create trip');
    }
  });
};
```

```javascript
// Send messages with optimistic updates
const { mutate: sendMessages } = useSendTripMessages();

const handleSendMessages = (studentIds) => {
  // Optimistic update
  updateStudentStatus(studentIds, { sent: true });
  
  sendMessages({ tripId, studentIds }, {
    onSuccess: () => {
      toast.success('Messages sent successfully');
    },
    onError: () => {
      // Rollback optimistic update
      updateStudentStatus(studentIds, { sent: false });
      toast.error('Failed to send messages');
    }
  });
};
```
