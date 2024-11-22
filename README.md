# Druid HBC Project - Team 4

This repository contains a complete setup for a headless Drupal 10 backend, integrated with Mautic for marketing automation, and a React-based frontend. Drupal and Mautic are containerized and managed using Lando, ensuring consistent local development environments.

## Screenshot

Will be added later.

## Technologies

### Backend

- Headless Drupal 10: Acts as the backend CMS, exposing data via JSON:API.
- Mautic: Handles marketing automation, form management, and lead tracking.

### Frontend

- React
- Tailwind CSS

## Setup for Local Testing

1. Clone the repository: `git clone https://github.com/nahusenayElias/Team_4.git`

### Setup Drupal

2. In project root, run `lando start`
3. Run `lando composer install`
4. Import latest Drupal database `lando db-import NAME_OF_DB_FILE.gz`
5. Import Drupal configurations `lando drush cim`
6. Run `lando info` to see which localhost address Drupal is running on

### Setup Mautic

7. cd to `mautic-lando` folder
8. Run `lando start`
9. Run `lando composer install`
10. Import mautic db `lando db-import NAME_OF_DB_FILE.gz`
11. Run `lando info` to see which localhost address Mautic is running on
12. Rename `.env example` in project root to `.env` and insert Mautic credentials

### Setup Frontend

13. cd to `frontend` folder
14. run `npm install` to install dependencies
15. Rename `.env example` to `.env` and insert localhost addresses
16. Run frontend: `npm run dev`

### Team 4 Members

- [Dana Popa](https://github.com/popadana10)
- [Elias Hagos](https://github.com/nahusenayElias)
- [Tuomas Kohvakka](https://github.com/tauoms)
- [Salla Närhi](https://github.com/sallaselina)
