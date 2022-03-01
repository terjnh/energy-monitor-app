### Update:
- 01-03-2022
    - `/api/device`, sent PATCH body using FormData()
        - Added handler.get in `/api/device`
    - Summary Page:
        - Graph updates with data modification in MongoDB

## Dependencies
- `ajv` - validates request body (JSON)
- `next.js` v9.3 or above required for API routes:
    - new data fetching method: https://nextjs.org/docs/basic-features/data-fetching/overview#getserversideprops-server-side-rendering
- Modern UI frameworks:
    - `chakra-ui`
    - `material-ui`
- `recharts`
    - $ npm install recharts
- `cloudinary` - for image/media handling
- `clsx`- a utility for constructing 'className' strings conditionally
- `lukeed/ms` - utility to convert milliseconds to and from strings


### TODO:
- When user selects a device from list-of-devices,
  - redirect them to the appropriate (`/user/<user>/device/<deviceId>`)
  - User should only be allowed to edit a device which they created?

## Description
Referenced from: https://github.com/hoangvvo/nextjs-mongodb-app