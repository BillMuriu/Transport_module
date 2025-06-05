"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Users, Car, User, Clock } from "lucide-react";
import { useOngoingTripStore } from "@/stores/useOngoingTripStore"; // import the store

// Mock data for demonstration - replace with your actual query
const mockTrip = {
  id: "1",
  name: "Science Museum Field Trip",
  trip_type: "educational_trip",
  start_location: "Lincoln High School",
  end_location: "National Science Museum",
  departure_time: "2024-03-15T09:00:00Z",
  arrival_time: "2024-03-15T15:30:00Z",
  trip_status: "completed",
  trip_action: "return",
  driver_name: "John Smith",
  driver: "driver123",
  trip_teacher_name: "Ms. Sarah Johnson",
  trip_teacher: "teacher456",
  vehicle_name: "School Bus A1",
  vehicle: "vehicle789",
  expected_students: Array(24)
    .fill(null)
    .map((_, i) => ({ id: i + 1, name: `Student ${i + 1}` })),
  boarded_students: Array(22)
    .fill(null)
    .map((_, i) => ({ id: i + 1, name: `Student ${i + 1}` })),
};

export default function TripSummaryPage() {
  const [isDataProcessed, setIsDataProcessed] = useState(false);
  const params = useParams();
  const tripId = params.id;

  // Mock loading states - replace with your actual query logic
  const trip = mockTrip;
  const isLoading = false;
  const isError = false;
  const isSuccess = true;

  const ongoingTrip = useOngoingTripStore((state) => state.ongoingTrip);
  const clearOngoingTrip = useOngoingTripStore(
    (state) => state.clearOngoingTrip
  );

  useEffect(() => {
    console.log("🚩 Current ongoingTrip from store:", ongoingTrip);
  }, [ongoingTrip]);

  useEffect(() => {
    if (isSuccess && trip && !isDataProcessed) {
      setIsDataProcessed(true);
      // Your cleanup logic here
    }
  }, [isSuccess, trip, isDataProcessed]);

  useEffect(() => {
    setIsDataProcessed(false);
  }, [tripId]);

  if (!tripId)
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        No trip ID provided.
      </div>
    );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );

  if (isError || !trip)
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        Trip not found
      </div>
    );

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        variant: "default",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      ongoing: {
        variant: "default",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      pending: { variant: "outline", className: "text-muted-foreground" },
      cancelled: { variant: "destructive" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const attendanceRate =
    trip.expected_students.length > 0
      ? (
          (trip.boarded_students.length / trip.expected_students.length) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Trip Summary
            </h1>
            {getStatusBadge(trip.trip_status)}
          </div>
          <p className="text-muted-foreground">
            Complete overview of your trip details and student attendance
          </p>
        </div>

        <Separator />

        {/* Trip Overview Card */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              {trip.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Trip Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Car className="h-4 w-4" />
                  Trip Type
                </div>
                <p className="font-medium capitalize text-foreground">
                  {trip.trip_type.replace("_", " ")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Start Location
                </div>
                <p className="font-medium text-foreground">
                  {trip.start_location}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  End Location
                </div>
                <p className="font-medium text-foreground">
                  {trip.end_location}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Departure Time
                </div>
                <p className="font-medium text-foreground">
                  {formatDateTime(trip.departure_time)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Arrival Time
                </div>
                <p className="font-medium text-foreground">
                  {trip.arrival_time
                    ? formatDateTime(trip.arrival_time)
                    : "Pending"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Trip Action
                </div>
                <Badge variant="outline" className="capitalize">
                  {trip.trip_action}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants and Vehicle Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Driver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {trip.driver_name ?? "N/A"}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  ID: {trip.driver ?? "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Trip Teacher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {trip.trip_teacher_name ?? "N/A"}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  ID: {trip.trip_teacher ?? "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Car className="h-5 w-5 text-primary" />
                Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {trip.vehicle_name ?? "N/A"}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  ID: {trip.vehicle ?? "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Attendance Summary */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              Student Attendance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Attendance rate: {attendanceRate}%
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-muted/30">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {trip.expected_students.length}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Expected Students
                </div>
              </div>

              <div className="text-center p-6 rounded-lg bg-green-50 border border-green-200">
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {trip.boarded_students.length}
                </div>
                <div className="text-sm font-medium text-green-600">
                  Students Boarded
                </div>
              </div>

              <div className="text-center p-6 rounded-lg bg-red-50 border border-red-200">
                <div className="text-3xl font-bold text-red-700 mb-2">
                  {trip.expected_students.length - trip.boarded_students.length}
                </div>
                <div className="text-sm font-medium text-red-600">
                  Students Missing
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Attendance Progress
                </span>
                <span className="text-sm font-medium text-foreground">
                  {attendanceRate}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
