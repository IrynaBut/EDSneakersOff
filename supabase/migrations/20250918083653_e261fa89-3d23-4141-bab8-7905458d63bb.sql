-- Add new fields to profiles table for enhanced client management
ALTER TABLE public.profiles 
ADD COLUMN birth_date DATE,
ADD COLUMN address TEXT;