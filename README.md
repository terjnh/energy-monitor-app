### Update:
- 02-03-2022
    - Render device energy chart upon update
    - Chart is more dynamic (graph length depends on largest energyConsumption array)
    - Energy consumption sum shown in Summary page
    - Added Edit & Delete Buttons on Devices List [IN PROGRESS]

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
- Delete photo from Cloudinary if not in use

## Description
Referenced from: https://github.com/hoangvvo/nextjs-mongodb-app