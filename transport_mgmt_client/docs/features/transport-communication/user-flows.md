# Transport Communication - User Flows

## Overview

This document outlines the complete user interaction flows for the transport communication feature, covering all user personas and their typical workflows.

## Trip Teacher Workflows

### 1. Morning Pickup Flow

#### Step 1: Trip Initiation
1. **Navigate to Trip Creation**
   - Trip teacher logs into system
   - Goes to `/trip_teacher/trips/create`
   - Sees trip creation form

2. **Fill Trip Details**
   ```
   Trip Type: "Morning Pickup"
   Vehicle: Select from dropdown (school vehicles)
   Driver: Select from dropdown (school drivers)  
   Route: Select from dropdown (school routes)
   Trip Teacher: Auto-filled (current user)
   ```

3. **Submit Trip**
   - Click "Start Trip" button
   - System creates trip record via `POST /trips/`
   - Trip stored in ongoing trip store
   - Redirected to `/trip_teacher/trip-students`

#### Step 2: Student Management
1. **View Student List**
   - System fetches students by route via `useStudentsByRoute(routeId)`
   - Students displayed in data table with checkboxes
   - All students show "Not Boarded" status initially

2. **Mark Students as Boarded**
   - Select multiple students using checkboxes
   - Click "Send Messages" action button
   - Confirmation dialog appears

3. **Send Boarding Notifications**
   - Confirm message sending
   - System calls `useSendTripMessages` with student IDs
   - Students marked as "✅ Boarded" in real-time
   - Parents receive SMS notifications

#### Step 3: Trip Completion
1. **Complete Trip**
   - All relevant students marked as boarded
   - Click "End Trip" button in trip actions
   - System compiles final trip data:
     ```javascript
     {
       trip_status: "completed",
       expected_students: [all_student_ids],
       boarded_students: [boarded_student_ids],
       arrival_time: current_timestamp
     }
     ```

2. **Finalization**
   - Trip updated via `PUT /trips/{tripId}/`
   - Ongoing trip store cleared
   - User redirected to trip dashboard
   - Trip completion notifications sent

### 2. Evening Dropoff Flow

#### Step 1: Trip Initiation (Same as Morning)
1. Create trip with type "Evening Dropoff"
2. Select vehicle, driver, route
3. Submit and navigate to student management

#### Step 2: Boarding Phase Management
1. **Navigate to Boarding Interface**
   - System redirects to `/trip_teacher/trip-students-boarding`
   - Students fetched and initialized in boarding store

2. **Mark Students as Boarded**
   - Select students who are present at pickup
   - Mark as boarded using checkboxes or name clicks
   - System updates `useBoardingStudentsStore`
   - Boarded students tracked for dropoff phase

3. **Complete Boarding Phase**
   - Click "Complete Boarding" button
   - System transitions to dropoff phase
   - Redirected to `/trip_teacher/trip-students-dropoff`

#### Step 3: Dropoff Phase Management
1. **View Boarded Students**
   - Only students marked as boarded are displayed
   - Students show "Boarded" status initially

2. **Mark Students as Dropped Off**
   - Select students being dropped off
   - Click checkbox or student name
   - Status changes to "✅ Alighted"
   - Parents receive dropoff notifications

3. **Complete Trip**
   - All students processed for dropoff
   - Click "End Trip" button
   - Final trip data compiled with boarding and dropoff info
   - Trip marked as completed

## Parent Experience Flow

### 1. Boarding Notifications
1. **Initial Trip Start**
   - Receive SMS: "School transport has started for [Route Name]"
   - SMS includes estimated arrival time at pickup point

2. **Boarding Confirmation**
   - Receive SMS: "Your child [Name] has boarded the school bus"
   - SMS includes departure time and estimated school arrival

3. **Arrival Notification**
   - Receive SMS: "Your child [Name] has arrived safely at school"
   - SMS includes actual arrival time

### 2. Dropoff Notifications
1. **Departure Notification**
   - Receive SMS: "School transport has departed for dropoff"
   - SMS includes estimated arrival time at dropoff point

2. **Dropoff Confirmation**
   - Receive SMS: "Your child [Name] has been dropped off safely at [Location]"
   - SMS includes actual dropoff time

## School Administrator Oversight

### 1. Trip Monitoring
1. **Dashboard Overview**
   - View all active trips across school
   - Monitor trip progress and status
   - See real-time student boarding/dropoff counts

2. **Communication Oversight**
   - View message delivery statistics
   - Monitor failed message notifications
   - Access trip communication history

### 2. Issue Resolution
1. **Handle Failed Messages**
   - Identify failed SMS deliveries
   - Initiate manual parent contact
   - Update parent contact information

2. **Trip Interventions**
   - Cancel trips due to emergencies
   - Reassign trip teachers if needed
   - Communicate delays or changes

## Error Handling Flows

### 1. Network Connectivity Issues
1. **Offline Detection**
   - System detects network loss
   - Shows offline indicator
   - Preserves local state changes

2. **Reconnection Handling**
   - Automatic retry of failed operations
   - Sync local changes with server
   - User notification of sync status

### 2. Failed Message Delivery
1. **Message Failure Detection**
   - System identifies failed SMS deliveries
   - Marks students with delivery failure status
   - Provides retry options for trip teacher

2. **Manual Resolution**
   - Trip teacher can retry message sending
   - Alternative contact methods suggested
   - School admin notified of persistent failures

### 3. Trip Cancellation Flow
1. **Emergency Cancellation**
   - Trip teacher clicks "Cancel Trip" button
   - Confirmation dialog with reason selection
   - Trip status updated to "cancelled"

2. **Notification Cascade**
   - Parents notified of trip cancellation
   - School admin receives cancellation report
   - Driver and vehicle freed for reassignment

## Edge Case Scenarios

### 1. Student Absence Handling
1. **Expected Student Not Present**
   - Student listed but not at pickup point
   - Trip teacher marks as "Not Boarded"
   - Parent receives absence notification
   - School attendance system updated

### 2. Late Student Arrival
1. **Student Arrives After Departure**
   - Trip already in progress
   - Parent contacts school directly
   - Alternative transport arrangements made
   - System updated with absence reason

### 3. Route Changes
1. **Emergency Route Modification**
   - Trip teacher notified of route change
   - Updated student list provided
   - Parents notified of pickup changes
   - Navigation system updated

## Performance Considerations

### 1. Large Student Lists
- Progressive loading for routes with 50+ students
- Batch operations for message sending
- Optimized rendering for data tables

### 2. Peak Usage Times
- System handles concurrent trip creation
- Message queuing during high-traffic periods
- Real-time status updates with minimal latency

### 3. Mobile Optimization
- Touch-friendly interfaces for trip teachers
- Offline capability for core functions
- Efficient data usage for mobile networks
