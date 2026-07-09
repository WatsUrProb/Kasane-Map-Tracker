
# Kasane Safari Tracker

Kasane Safari Tracker is a React + Vite web application prototype for mapping safari activity around Kasane, Botswana. 
The app allows users to view and add recent wildlife-related map markers such as animal sightings, carcass hotspots, temporary campsites, 
film crew vehicles, and SOS alerts.

The project uses React state to manage the interface, React Leaflet to render an interactive map, a
nd Supabase as the backend database for persistent sighting storage. 

## Current Features

- Interactive map centered around Kasane
- Add wildlife sightings by selecting a point on the map
- Support for categories such as animals, carcasses, campsites, film crew vehicles, and SOS alerts
- Custom SVG-based map markers for different sighting categories
- Map type switching between regular, satellite, and hybrid views
- Mobile-responsive layout with a floating menu and compact sighting form
- Supabase PostgreSQL table for storing sightings persistently
- Row Level Security policies for public read and insert access during prototype testing

## Tech Stack

- React
- Vite
- React Leaflet / Leaflet
- Supabase
- PostgreSQL
- CSS media queries for responsive design

## Project Goal

The goal of this project is to explore how a real-time safari field tool could help users share temporary location-based information,
 such as recent animal sightings or emergency alerts, while learning frontend development, interactive maps, database integration,
  and multi-user web app architecture. */
