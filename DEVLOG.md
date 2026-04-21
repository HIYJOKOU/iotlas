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

## Day 4 - Websocket connection and live updates

### Completed

- Added realtime home updates over WebSocket.
- Implemented a per-network WebSocket hub on the server and a client-side realtime flow for snapshots and checkpoint activity. `/ws/:network/home` path.
- Updated the home page to display live validator status and recent activity.
- Added file `vite-env.d.ts` with custom types for Vite environment variables.
- Extract common TypeScript types into a shared package/folder and reuse them across the backend and frontend to avoid duplicated type definitions.
- Create a dedicated validators page.
- Pimped the about page with more project details and a technology stack overview.

### Thoughts

- During the implementation, I realized that I should have compared the IOTA network model with Monad’s architecture much earlier.
  -In Monad, each block is produced by a single validator, which makes it relatively straightforward to track block production and visualize it on a globe in real time. IOTA works differently — blocks/checkpoints are created through a more complex validator set and consensus process, so mapping “live block creation” directly to a single validator/location is not as clear or meaningful.
- Because of that, I think the globe should not try to behave like a real-time block production map. Instead, it makes more sense to use it as an infrastructure/validator distribution view showing where validators are located, how they are grouped.
- I also got a bit lost during the implementation when deciding which blockchain metrics should actually be displayed on the home page. I was trying to mirror some ideas from Monad-style dashboards, but I realized that not all of those metrics translate well to IOTA. Since I’m still learning the deeper network-level concepts, I need to be more careful about which data is meaningful, technically accurate, and useful for users.
- I’m also still not fully confident about the differences between checkpoints, transactions, blocks, and snapshots, and how each of them should be interpreted or visualized in the UI. Because of that, I need to better understand the data model before deciding what belongs in the real-time activity stream and what should stay as a static or periodically refreshed network metric.

### Same day update - Validator globe interactions and layout polish

#### Completed

- Replaced the prototype globe with `ValidatorGlobe` and connected it to real validator location data.
- Added marker rendering for single validators and cluster markers with count badges.
- Implemented distance-based validator clustering that updates dynamically with camera zoom level.
- Added a validator cluster dropdown (desktop anchored to marker, mobile as bottom sheet) with validator cards, location and voting power.
- Improved globe responsiveness.
- added configurable backend CORS allowlist
- added rate limiting for validators endpoint
- added short in-memory cache for validators responses
- added basic websocket hardening

#### Thoughts

- The validator globe is now much closer to the intended MVP experience, but this part of the implementation also became one of the messier areas of the codebase.
- There are not many ready-made examples or references for combining `react-globe.gl`, custom HTML markers, responsive layout behavior, clustering, anchored dropdowns, in one flow, so a lot of the solution had to be discovered by testing and iteration.
- I also used AI support during this part, mostly to explore possible implementation approaches, debug edge cases, and rethink the structure when the globe interactions became harder to reason about. It helped speed up experimentation, but the final behavior still required manual testing and adjustment.
- Because of that, some parts of the globe logic are still more improvised than I would like. The current version works, but it may need another cleanup pass once the expected interaction model becomes fully stable.

## Final outcome

The project reached the planned MVP scope. The application now has a working monorepo structure with a React + Vite + TypeScript frontend, an Express + TypeScript backend, and a real data flow between the client and server.

The main MVP feature is the validator infrastructure globe. Validators are fetched from the IOTA network, enriched with geolocation data, grouped into dynamic clusters, and displayed on an interactive 3D globe. The globe works both on desktop and mobile, with marker interactions, validator details, location data, and voting power information.

The home page also includes live network updates through WebSocket, basic snapshot/checkpoint activity, validator status. The app supports switching between networks.

Overall, the project became a functional MVP of `gIOTA.live`: a geo-focused IOTA network dashboard that visualizes validator and provides a foundation for future real-time network insights.

### What went well

- The core idea of using a globe as the visual centerpiece works well `visually`.
- Validator geolocation coverage was much better than expected after switching to the `ip-api.com` batch endpoint.
- Dynamic clustering made the globe more readable and helped avoid marker overload in dense validator regions.
- The WebSocket flow made the dashboard feel more alive.
- AI tools were useful for fast prototyping, design exploration, debugging, and generating visual assets.
- My blockchain knowledge increased drastically during the project, highlighting the difference between visually impressive data and technically meaningful network metrics.

### What could be improved later

- Refactor the `ValidatorGlobe` logic into smaller, clearer parts.
- Improve retry logic for geolocation lookups.
- Decide more carefully which IOTA metrics are technically meaningful to show in real time.
- Improve the activity stream once checkpoints, transactions, blocks, and snapshots are better understood.
- Add more detailed validator pages and possibly historical/network statistics.
- Consider persistent caching if validator geolocation lookups or network data become heavier.
