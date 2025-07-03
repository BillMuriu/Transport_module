# Transport Communication - Data Flow

## Overview

This document outlines the complete data flow for the transport communication feature, covering trip lifecycle, state management, and communication workflows.

## Core Data Stores

### 1. Ongoing Trip Store (`useOngoingTripStore`)
**Purpose**: Manages the current active trip state across the application

**Key State**:
```javascript
{
  ongoingTrip: {
    id: string,
    name: string,
    trip_type: "morning_pickup" | "evening_dropoff",
    trip_action: "pickup" | "dropoff",
    trip_status: "ongoing" | "completed" | "cancelled",
    school: string,
    vehicle: string,
    driver: string,
    trip_teacher: string,
    route: string,
    start_location: string,
    end_location: string,
    departure_time: string,
    arrival_time: string,
    expected_students: array,
    boarded_students: array
  }
}
```

**Key Actions**:
- `setOngoingTrip(trip)` - Set active trip
- `clearOngoingTrip()` - Clear active trip on completion

### 2. Boarding Students Store (`useBoardingStudentsStore`)
**Purpose**: Tracks student boarding/dropoff status during evening dropoff trips

**Key State**:
```javascript
{
  boardingStudents: [
    {
      id: string,
      first_name: string,
      last_name: string,
      Grade: string,
      parent_phone: string,
      boarded: boolean,    // Set during boarding phase at school
      alighted: boolean    // Set during alighting phase at dropoff points
    }
  ]
}
```

**Key Actions**:
- `initializeBoardingStudents(students)` - Initialize from route data with boarded: false
- `updateBoardingStatus(studentId)` - Toggle boarding status (at school)
- `updateAlightedStatus(studentId)` - Toggle alighting status (at dropoff points)
- `resetBoardingStudents()` - Clear on trip completion

**Usage Pattern**:
- **Evening Dropoff**: Used for both boarding and alighting phases
- **Morning Pickup**: Not used (uses legacy student store)

### 3. Student Store (`useStudentStore`)
**Purpose**: Legacy store for trip-students management

## Trip Lifecycle Data Flow

### 1. Trip Creation Flow
```
Trip Teacher → Create Trip Form → API Call → Trip Created → 
Ongoing Trip Store Updated → Navigation Based on Trip Type
```

**Data Flow**:
1. User fills trip creation form with:
   - Trip type (morning_pickup/evening_dropoff)
   - Vehicle selection
   - Driver assignment
   - Route selection
   - Trip teacher assignment

2. `useCreateTrip` mutation called with trip data
3. Backend creates trip record
4. Response triggers `setOngoingTrip(data)` in store
5. User redirected based on trip type:
   - **Morning Pickup**: → `/trip_teacher/trip-students`
   - **Evening Dropoff**: → `/trip_teacher/trip-students-boarding`

### 2. Student Data Initialization Flow

#### For Morning Pickup Trips
```
Route Selected → Fetch Students by Route → Initialize Student Store → 
Display Student List → Ready for Boarding/Message Sending
```

#### For Evening Dropoff Trips  
```
Route Selected → Fetch Students by Route → Initialize Boarding Store → 
Display Student List → Ready for Boarding Phase (at School)
```

**Data Flow**:
1. Route ID extracted from ongoing trip
2. `useStudentsByRoute(routeId)` query fetches route students
3. Students initialized in appropriate store:
   - **Morning Pickup**: Uses legacy `useStudentStore` with `sent: false`
   - **Evening Dropoff**: Uses `useBoardingStudentsStore` with `boarded: false, alighted: false`
4. Data table displays students with action controls

## Trip Type Specific Workflows

### Morning Pickup Workflow (Single Phase)
**Location**: Student pickup points → School  
**Store Used**: `useStudentStore` (legacy)  
**Page**: `/trip_teacher/trip-students`

```
Trip Creation → Student List Display → Select Students → 
Send Messages → Mark as Boarded → Complete Trip
```

**Key Characteristics**:
- Single-phase process
- Uses `sent` status to track boarded students
- Messages sent when students board at pickup points
- Trip completed when all students processed

### Evening Dropoff Workflow (Two Phases)

#### Phase 1: Boarding at School
**Location**: School (departure point)  
**Store Used**: `useBoardingStudentsStore`  
**Page**: `/trip_teacher/trip-students-boarding`

```
Trip Creation → Boarding Page → Mark Students as Boarded → 
Complete Boarding Phase → Navigate to Dropoff
```

**Key Characteristics**:
- Students marked as `boarded: true` at school
- No messages sent during boarding phase (currently disabled)
- Tracks which students got on the bus at school
- Must complete before proceeding to dropoff

#### Phase 2: Alighting at Dropoff Points  
**Location**: Student dropoff points  
**Store Used**: `useBoardingStudentsStore` (same store, different status)  
**Page**: `/trip_teacher/trip-students-dropoff`

```
Boarded Students Display → Mark Students as Alighted → 
Complete Trip with Full Data
```

**Key Characteristics**:
- Only shows students marked as `boarded: true`
- Students marked as `alighted: true` at dropoff points
- Final trip data includes both boarding and alighting information
- Trip completion includes comprehensive student tracking data
## Detailed Data Flow by Trip Type

### 3. Morning Pickup Data Flow (Single Phase)
```
Select Students → Send Messages → Update Status → 
Parent Notifications → Continue Trip
```

**Data Flow**:
1. Trip teacher selects students from data table
2. `handleSendMessages()` triggered with selected student IDs
3. `useSendTripMessages` mutation called:
   ```javascript
   payload: {
     tripId: ongoingTrip.id,
     studentIds: [selectedIds]
   }
   ```
4. Backend processes message sending and updates student status
5. Frontend updates local student state to reflect boarding (`sent: true`)
6. Parents receive SMS notifications

### 4. Evening Dropoff Flow (Two-Phase Process)

#### Phase 1: Boarding at School
```
Trip Created → Navigate to Boarding Page → Initialize Students → 
Mark Students as Boarded → Complete Boarding Phase → Navigate to Dropoff
```

**Data Flow**:
1. Evening dropoff trip redirects to `/trip_teacher/trip-students-boarding`
2. Route students fetched via `useStudentsByRoute(routeId)`
3. Students initialized in boarding store with `boarded: false`
4. Trip coordinator marks students as boarded at school:
   ```javascript
   // Student marked as boarded
   updateBoardingStatus(studentId) // Updates boarded: true
   ```
5. Boarding phase completed with "Complete Boarding Phase" button
6. User navigated to `/trip_teacher/trip-students-dropoff`

#### Phase 2: Alighting/Dropoff
```
Boarded Students Displayed → Select for Alighting → 
Mark as Alighted → Update Status → Trip Completion
```

**Data Flow**:
1. Only boarded students from boarding store displayed
2. Trip teacher marks students as alighted at dropoff points:
   ```javascript
   // Student marked as alighted  
   updateAlightedStatus(studentId) // Updates alighted: true
   ```
3. Status changes reflected in UI immediately
4. Final trip update includes both boarding and alighting data:
   ```javascript
   updatedData: {
     expected_students: allStudentIds,
     boarded_students: boardedStudentIds,
     alighted_students: alightedStudentIds,
     // ... other trip fields
   }
   ```

### 5. Trip Completion Flow

#### Morning Pickup Completion
```
Complete Trip Action → Update Trip Status → 
Send Final Data → Clear Stores → Navigation
```

**Data Flow**:
1. Trip teacher triggers "End Trip" action
2. Final trip data compiled:
   ```javascript
   updatedData: {
     trip_status: "completed",
     expected_students: allStudentIds,
     boarded_students: studentsWithSentTrue, // Based on 'sent' status
     // ... other trip fields
   }
   ```
3. `useUpdateTrip` mutation updates trip record
4. Stores cleared: `clearOngoingTrip()`, student store reset
5. User redirected to trip dashboard

#### Evening Dropoff Completion
#### Evening Dropoff Completion
```
Complete Trip Action → Compile Comprehensive Data → 
Update Trip Status → Clear Stores → Navigation
```

**Data Flow**:
1. Trip teacher triggers "End Trip" action from dropoff page
2. Comprehensive trip data compiled:
   ```javascript
   updatedData: {
     trip_status: "completed",
     expected_students: allStudentIds,           // All students on route
     boarded_students: boardedStudentIds,       // Students who boarded at school
     alighted_students: alightedStudentIds,     // Students who alighted at dropoff
     // ... other trip fields
   }
   ```
3. `useUpdateTrip` mutation updates trip record with full tracking data
4. Stores cleared: `clearOngoingTrip()`, `resetBoardingStudents()`
5. User redirected to trip summary page: `/trip_teacher/trips/summary/${tripId}`

## Communication Data Flow

### Message Sending Workflow
```
Student Selection → Batch Message Preparation → 
API Call → Backend Processing → SMS Delivery → Status Update
```

**Key Components**:
- **Frontend**: Student selection and batch preparation
- **Backend**: Message queue and SMS service integration
- **Database**: Message logs and delivery status tracking

### Real-time Status Updates
The system maintains real-time status through:
1. **Optimistic Updates**: Immediate UI updates on user actions
2. **Server Sync**: Periodic synchronization with backend state
3. **Error Handling**: Rollback on API failures

## Error Handling & Edge Cases

### Network Failures
- Local state preservation during offline periods
- Automatic retry mechanisms for failed API calls
- User feedback for connection issues

### Data Inconsistencies
- Server state validation on critical operations
- Conflict resolution for concurrent updates
- Data integrity checks on trip completion

### User Experience
- Loading states during async operations
- Clear error messages for failed operations
- Graceful degradation for partial failures
