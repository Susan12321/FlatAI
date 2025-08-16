-- Migration script to add missing tables for bookings and reviews
-- This will be applied after running prisma db push

-- Add booking status enum values if not exists
-- ALTER TABLE Booking MODIFY status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';

-- Add constraints for review ratings
-- ALTER TABLE Review ADD CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_city ON Property(city);
CREATE INDEX IF NOT EXISTS idx_property_rent ON Property(rent);
CREATE INDEX IF NOT EXISTS idx_booking_status ON Booking(status);
CREATE INDEX IF NOT EXISTS idx_review_rating ON Review(rating);
