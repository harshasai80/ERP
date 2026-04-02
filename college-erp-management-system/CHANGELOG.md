# Project Setup and Change Tracker

This document will track all the ongoing changes, feature implementations, and bug fixes made to the College ERP Management System.

## Upcoming Changes
*(Any upcoming changes will be listed here)*

## Completed Changes
### 2026-03-16
- Initialized the Change Tracker document.
- Implemented automatic SGP SMS notification system for student absenteeism.
  - Added `NotificationService` for asynchronous SMS delivery.
  - Integrated SGP Sender ID and Fast2SMS/Twilio configuration in `application.properties`.
  - Added parent contact fields to `Student` model.
  - Added "Parent Mobile Number" and "Parent Email" fields to "Add Student" forms for HOD and Principal dashboards.
  - Linked `AttendanceService` to trigger notifications immediately after saving attendance.
