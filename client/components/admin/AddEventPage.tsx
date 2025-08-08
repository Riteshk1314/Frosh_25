"use client";

import type React from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FormData {
  name: string;
  mode: "offline" | "online";
  location?: string;
  slots: number;
  startTime: string;
  totalSeats: number;
  eventDescription?: string;
  isLive?: boolean;
}

const AddEventPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      mode: "offline",
      location: "",
      slots: 1,
      startTime: "",
      totalSeats: 0,
      eventDescription: "",
      isLive: false,
    },
  });

  const mode = watch("mode");

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        location: data.mode === "offline" ? data.location : "",
      };

      const response = await fetch(`http://localhost:8080/createEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        reset();
        alert("Event added successfully!");
      } else {
        const error = await response.json();
        alert("Failed to create event: " + error.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Could not create event. Try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="w-full max-w-3xl mx-auto bg-gray-900 text-white">
        <CardHeader>
          <CardTitle>Add New Event</CardTitle>
          <CardDescription>
            Fill in the details to create a new event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Event name is required" }}
              render={({ field }) => (
                <div>
                  <Label htmlFor="name">Event Name *</Label>
                  <Input {...field} className="mt-1 bg-gray-800" />
                  {errors.name && (
                    <span className="text-red-500 text-sm">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              name="mode"
              control={control}
              rules={{ required: "Mode is required" }}
              render={({ field }) => (
                <div>
                  <Label htmlFor="mode">Mode *</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full bg-gray-800">
                      <SelectValue placeholder="Select event mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mode && (
                    <span className="text-red-500 text-sm">
                      {errors.mode.message}
                    </span>
                  )}
                </div>
              )}
            />

            {mode === "offline" && (
              <Controller
                name="location"
                control={control}
                rules={{ required: "Location is required for offline events" }}
                render={({ field }) => (
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input {...field} className="mt-1 bg-gray-800" />
                    {errors.location && (
                      <span className="text-red-500 text-sm">
                        {errors.location.message}
                      </span>
                    )}
                  </div>
                )}
              />
            )}

            <Controller
              name="slots"
              control={control}
              rules={{ required: "Slots are required" }}
              render={({ field }) => (
                <div>
                  <Label htmlFor="slots">Slots *</Label>
                  <Input
                    type="number"
                    {...field}
                    className="mt-1 bg-gray-800"
                  />
                  {errors.slots && (
                    <span className="text-red-500 text-sm">
                      {errors.slots.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              name="startTime"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({ field }) => (
                <div>
                  <Label htmlFor="startTime">Start Date & Time *</Label>
                  <Input
                    type="datetime-local"
                    {...field}
                    className="mt-1 bg-gray-800"
                  />
                  {errors.startTime && (
                    <span className="text-red-500 text-sm">
                      {errors.startTime.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              name="totalSeats"
              control={control}
              rules={{ required: "Total seats are required" }}
              render={({ field }) => (
                <div>
                  <Label htmlFor="totalSeats">Total Seats *</Label>
                  <Input
                    type="number"
                    {...field}
                    className="mt-1 bg-gray-800"
                  />
                  {errors.totalSeats && (
                    <span className="text-red-500 text-sm">
                      {errors.totalSeats.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              name="eventDescription"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="eventDescription">Event Description</Label>
                  <Textarea {...field} className="mt-1 bg-gray-800" rows={4} />
                </div>
              )}
            />
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-transparent border border-white duration-300 hover:bg-purple-700"
          >
            Add Event
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AddEventPage;
