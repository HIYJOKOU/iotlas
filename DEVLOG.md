# Devlog

## Day 1 – Project setup

### Completed

- initialized repository structure
- created monorepo-style layout with `client` and `server`
- bootstrapped frontend with React + Vite + TypeScript
- bootstrapped backend with Express + TypeScript
- prepared initial TypeScript configuration for the server
- added base project documentation files
- initialized tanstack@router
- initialized tailwind, shadcn/ui
- initalized a simple theme mode toggle component
- merge client and main gitignore files
- added basic eslint and prettier configuration

## Day 2 – Exploring the IOTA SDK and validator geolocation

### Thoughts

- The main issue I found today is that the IOTA API does not provide validator location data such as city, country, latitude, or longitude.
- Because of that, I need to derive validator locations from their network addresses using an external geolocation service.
- For the MVP, an in-memory cache should be enough. If geolocation lookups become a bottleneck later, this can be moved to a more persistent storage solution.

### Outcome

- Achieved full location coverage for the current validator set using the `ip-api.com` batch endpoint.
- This is a significant improvement compared to the initial attempt, where only 62 out of 72 validator locations were resolved.
- During testing, 1 out of 10 batch requests resulted in a timeout.
- This suggests that the batch endpoint is effective, but retry logic is needed to improve reliability.

### Completed

- Implemented a geolocation service using the `ip-api.com` batch endpoint.
- Added hostname-to-IP resolution for validator network addresses.
- Created a simple in-memory cache for geolocation data to reduce repeated API calls.
- Updated the backend endpoint to include geolocation data for validators.

### Next steps

- Initialize TanStack Query.
- Create a simple page to display validator data.
- Add loading and error states.
