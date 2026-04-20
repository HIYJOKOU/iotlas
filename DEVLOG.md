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

## Day 3 - Frontend data layer and dashboard

### Thoughts

- Globe found out to be easier to implement than expected, While testing globe.gl, I used `ChatGPT` to generate custom texture for the globe. It was a fun experiment, and the results were surprisingly good. The custom texture adds a unique visual style to the globe, making it more visually appealing for users and style of the website. Also used `ChatGPT` to generate logo for iotlas.live which results in changing the project name from `iotlas` to `gIOTA.live` it was driven by `gmonads` used `g` as geo/globe prefix.
- While playing with design and layout, I realized reason why `gmonads.com` don't have white theme - its hard to achieve good readability of the website with globe in center. For now I will stick to dark theme, but components for changing themes are already in place, so it should be easy to add light theme later if needed.
- For the MVP, I will focus on building a simple dashboard shell with a header, footer, and main content area. The interactive globe will be the centerpiece of the home page, with additional sections for validator details and network statistics.

### Completed

- initialized API layer on client side with network-aware base URL
- integrated TanStack Query and added query client provider
- added home overview query hook
- added global network state with Jotai and network selector component
- rebuilt root layout into app shell with sticky header and footer
- redesigned home, about, and validators routes into card-based views
- added initial interactive 3D globe component
- added client env example file with VITE_API_URL

### Next steps

- make globe fully responsive
- add more information about chain on the `/home` api call
- work on websocket connection to get live updates from the server
