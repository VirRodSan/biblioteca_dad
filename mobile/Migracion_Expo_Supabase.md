# Migración a React Native Expo y Supabase

Este documento recoge el proceso de migración del proyecto Biblioteca desde una arquitectura web basada en React, Spring Boot y MySQL/XAMPP hacia una aplicación móvil desarrollada con React Native mediante Expo y una base de datos gestionada en Supabase.

## Estado inicial

El proyecto actual se mantiene como versión estable y funcional.

Arquitectura actual:

- Frontend: React con Vite.
- Backend: Spring Boot.
- Base de datos: MySQL gestionada con XAMPP.

## Nueva arquitectura objetivo

La nueva versión móvil utilizará:

- React Native con Expo para la aplicación móvil.
- Supabase como plataforma de base de datos, autenticación y API.
- PostgreSQL como sistema de base de datos.
- Supabase Auth para la gestión de usuarios.
- Row Level Security para controlar permisos desde la base de datos.

## Organización prevista

```txt
backend/   → proyecto Spring Boot actual
frontend/  → proyecto React web actual
mobile/    → nueva aplicación móvil Expo



        
