# Transport Communication - Components & Architecture

## Overview

This document details the key React components, custom hooks, and architectural patterns used in the transport communication feature.

## Core Components

### 1. Trip Management Components

#### `TripStudents` (`/trip_teacher/trip-students/page.jsx`)
**Purpose**: Main orchestrator for student management during trips

**Key Responsibilities**:
- Fetches students by route using `useStudentsByRoute(routeId)`
- Manages student state through `useStudentStore`
- Handles trip completion and cancellation workflows
- Coordinates with ongoing trip state

**High-Leverage Logic**:
```javascript
// Trip completion logic
const handleEndTrip = () => {
  const expected_students = students.map((s) => s.id);
  const boarded_students = students.filter((s) => s.sent).map((s) => s.id);
  
  const updatedData = {
    trip_status: "completed",
    expected_students,
    boarded_students,
    // ... other trip fields
  };
  
  updateTrip.mutate({ tripId: ongoingTrip.id, updatedData });
}
```

**Dependencies**:
- `useOngoingTripStore` - Active trip state
- `useStudentStore` - Student management
- `useUpdateTrip` - Trip update mutations
- `useStudentsByRoute` - Route-based student fetching

#### `TripStudentsBoarding` (`/trip_teacher/trip-students-boarding/page.jsx`)
**Purpose**: Specialized component for evening dropoff boarding phase

**Key Responsibilities**:
- Manages boarding phase for evening dropoff trips
- Initializes boarding students from route data
- Handles boarding completion and transition to dropoff phase

**State Management**:
```javascript
const {
  boardingStudents,
  initializeBoardingStudents,
  updateBoardingStatus,
} = useBoardingStudentsStore();
```

#### `TripStudentsDropoff` (`/trip_teacher/trip-students-dropoff/page.jsx`)
**Purpose**: Manages student dropoff phase for evening trips

**Key Responsibilities**:
- Displays only boarded students for dropoff
- Handles student alighting status updates
- Manages trip completion from dropoff perspective

### 2. Data Display Components

#### `DataTable` (`/trip_teacher/trip-students/_components/data-table.jsx`)
**Purpose**: Reusable data table for student management with selection and actions

**Key Features**:
- Multi-select functionality with checkboxes
- Status-based filtering (boarded/not boarded)
- Batch message sending capabilities
- Context-aware rendering (boarding vs dropoff phase)

**High-Leverage Logic**:
```javascript
const handleSendMessages = () => {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedStudents = selectedRows.map((row) => row.original);
  const studentIds = selectedStudents.map((s) => s.id);

  const payload = {
    tripId: ongoingTrip.id,
    studentIds,
  };

  if (isDropoffPhase) {
    // Mark as alighted without sending messages
    const updatedStudents = data.map((student) => {
      const updatedStudent = selectedStudents.find(s => s.id === student.id);
      return updatedStudent ? { ...student, alighted: true } : student;
    });
    setStudents(updatedStudents);
  } else {
    // Send messages and mark as boarded
    sendMessagesToParents(payload);
  }
};
```

#### `BoardingDataTable` & `DropoffDataTable`
**Purpose**: Specialized data tables for specific trip phases

**Key Differences**:
- Different column configurations
- Phase-specific status indicators
- Specialized action handlers

### 3. UI Components

#### Column Definitions (`columns.jsx`)
**Purpose**: Defines table column structure and cell renderers

**Key Columns**:
- **Selection**: Checkbox with conditional disable logic
- **Name**: Student full name with click handlers
- **Grade**: Student class/grade information  
- **Status**: Dynamic status badges based on trip phase

**Status Logic**:
```javascript
// Dynamic status rendering based on trip phase
const cell = ({ row, table }) => {
  const isSent = row.getValue("sent");
  const isAlighted = row.original.alighted;
  const isDropoffPhase = table.options.meta?.isDropoffPhase;

  if (isDropoffPhase) {
    return (
      <Badge className={isAlighted ? "success" : "warning"}>
        {isAlighted ? "✅ Alighted" : "Boarded"}
      </Badge>
    );
  }

  return (
    <Badge className={isSent ? "success" : "muted"}>
      {isSent ? "✅ Boarded" : "Not Boarded"}
    </Badge>
  );
};
```

## Custom Hooks & Services

### 1. State Management Hooks

#### `useOngoingTripStore`
**Purpose**: Zustand store for managing active trip state

**Key Methods**:
- `setOngoingTrip(trip)` - Set current active trip
- `clearOngoingTrip()` - Clear trip on completion
- `ongoingTrip` - Current trip state

#### `useBoardingStudentsStore`
**Purpose**: Manages student boarding/dropoff status during trips

**Key Methods**:
- `initializeBoardingStudents(students)` - Setup from route data
- `updateBoardingStatus(studentId)` - Toggle boarding
- `updateAlightedStatus(studentId)` - Toggle dropoff
- `resetBoardingStudents()` - Clear state

### 2. API Integration Hooks

#### `useStudentsByRoute(routeId)`
**Purpose**: Fetches students assigned to a specific route

```javascript
export const useStudentsByRoute = (routeId) => {
  return useQuery({
    queryKey: ["studentsByRoute", routeId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/students/`, {
        params: { station__route: routeId }
      });
      return response.data;
    },
    enabled: !!routeId,
  });
};
```

#### `useCreateTrip()` & `useUpdateTrip()`
**Purpose**: Mutations for trip lifecycle management

**Create Trip**:
```javascript
export const useCreateTrip = () => {
  const setOngoingTrip = useOngoingTripStore.getState().setOngoingTrip;

  return useMutation({
    mutationFn: async (tripData) => {
      const response = await axios.post(`${API_BASE_URL}/trips/`, tripData);
      return response.data;
    },
    onSuccess: (data) => {
      setOngoingTrip(data); // Auto-update store
    },
  });
};
```

#### `useSendTripMessages()`
**Purpose**: Sends messages to parents for selected students

```javascript
const payload = {
  tripId: string,
  studentIds: string[]
};
```

## Architectural Patterns

### 1. State Management Strategy

**Centralized Trip State**: Single source of truth for active trip
**Distributed Feature State**: Individual stores for specific features
**Optimistic Updates**: Immediate UI updates with server sync

### 2. Component Composition

**Container Components**: Handle data fetching and state management
**Presentation Components**: Pure UI components with props
**Custom Hooks**: Reusable state and API logic

### 3. Error Handling

**Graceful Degradation**: Fallback UI states for errors
**User Feedback**: Toast notifications for success/error states
**Retry Logic**: Automatic retry for transient failures

## Performance Considerations

### 1. Query Optimization
- Conditional queries with `enabled` flags
- Proper dependency arrays for `useEffect`
- Memoized selectors for store subscriptions

### 2. Re-render Optimization
- React.memo for expensive components
- Stable references for callbacks
- Optimized store selectors

### 3. Data Loading
- Loading states for async operations
- Progressive data loading for large student lists
- Efficient data transformation patterns
