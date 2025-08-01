# OdinBookEngine
This is my implementation of The Odin Project's OdinBook Project

## Details

This project is part of the Odin Project's Curriculum. It is the final project for the JS full stack path as well as the NodeJS curriculum. The aim of the project is to build a Jamstack based Social media app that decouples the frontend and backend into seperate parts, with the backend being an Express REST API. This project is the Backend API which implements authentication using passport.js(local) and passport-js (Google), as well as uses other tools including Cors(to enable cross-origin access), socket.io (for real time communication with the frontend), Express, Postgres, ORM, and bcrypt among others. Areas of practice include real-time communication and data fetching, sessions, authentication, routing, API response, validation, postgres set-up and manipulation techniques, prisma ORM usage, e.t.c.

## Features
   Features of OdinBookEngine include:

   * Routing - The OdinBookEngine Provides Access to numerous endpoints.

   * Clear API Responses: The API provides clear non-ambiguous responses to users whether in cases  of success or failure.

   * Data persistence: The app uses postgres to store and retrieve data.

   * Real-time data fetching - The API uses websockets ( via socket.io) to establish and maintain real-time responses for activities such as creating and deleting of posts, comments as well as liking and unliking posts.

   * ORM based: The app uses Prisma ORM to interface with and manipulate the postgres db instead of using raw SQL.

   * User Accounts - The API features endpoints for creating user accounts.

   * Fetching Users - The API provides endpoint for fetching all users in the db.

   * Friends - The API provides routes for adding, removing and viewing, friends.

   * Posts - The API provides routes for creating, deleting, liking, removing and viewing (CRUD) posts.

   * Comments - The API provides routes for creating, deleting, liking, removing and viewing (CRUD) comments.

   * User Profiles - The API provides routes for viewing as well as editing user profiles.

## Top Level Routes

   * /api/v1/

   * /api/v1/posts

   * /api/v1/profiles



   
 
  
   