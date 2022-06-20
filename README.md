This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Tripmeister
&nbsp;
## Here you get to the [**LIVE APP**](https://tripmeister.vercel.app/)
![screenshot2](https://user-images.githubusercontent.com/86207164/171490459-087c1140-fe5f-4300-8c10-ff6c26dcd4dd.PNG)

## Description

Tripmeister is a mobile-friendly itinerary builder for multi-day road trips. Tripmeister lets you create, update and delete routes, accommodations and activities as well as store travel documents for each stage of your road trip. You can save multiple trips to the database with your user account and edit and delete them afterwards. The route and markers for each stop are displayed on a topographical map. You also have a list view where you can lookup information on each stage of the trip.

## Why I built this app

Planning and organizing trips is a true passion of mine. So, building an easy and intuitive itinerary app which I would use myself for travelling really sounded like a great idea for my project portfolio. From a developer standpoint, building this app helped me to gain more experience with handling complex data structures and state management. It was also in this project that I put a lot of functionality into custom React Hooks which made my code cleaner and easier to debug. As for the styling, I used for the first time styled components in combination with tailwind css syntax (tailwind styled components library) which makes the CSS very readable and fast to write at the same time.

## Tech Stack
- Javascript ES6
- ReactJS
- NextJS
- Mapbox GL SDK
- Tailwind CSS
- Material UI
- Google Firebase


## Features
- destination input with autocomplete function
- route calculation and visualization based on starting point and endpoint
- individual route sections can be updated and deleted
- visualization of stops on topographical map
- visualization of route on topographical map
- the app shows hotel/hostel suggestions in a list and on the map
- the app lets the user select an accommodation from the list of suggestions
- the app lets the user add activities to each stage of the trip
- file upload for travel documents for each trip stage
- trip statistics (total driving time, avg. driving time, etc.)
- signin and signup with google and facebook
- signed in users can save multiple trips to the database

## How to install and run the project

1) Clone the project, running git **clone https://github.com/Larence0401/tripmeister.git**

2) Create a free account with mapbox.com 

3) Set up a new project with Google Firebase

4) Create an .env.local file in your local repository. Use the keys which you find inside of the env object in the next.config.js file and assign to them your credentials for the Mapbox GL API and Firebase API

5) Install dependencies running **npm i** or **yarn add** in your terminal

## How to use the project

Some ideas for additional feature you could add to the app:

- the user can select between several topographical maps
- route building for hikes and cycling tours on each stop
- more detailed info an accommodations provided by Google Places Api
- the user can add flights to the trip

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

AIzaSyCslMeCOzjhzgJlzG6mMD-kWb3nfbEDtLs
