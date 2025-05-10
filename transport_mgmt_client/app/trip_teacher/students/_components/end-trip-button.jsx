import React from "react";
import { Button } from "@/components/ui/button";

const EndTripButton = () => (
  <Button onClick={() => console.log("Ending the trip...")} className="w-full">
    End Trip
  </Button>
);

export default EndTripButton;
