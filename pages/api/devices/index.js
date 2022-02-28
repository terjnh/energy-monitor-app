import { ValidateDeviceProps } from '@/api-lib/constants';
import { findDevices, insertDevice } from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
    const devices = await findDevices(
        req.db,
        req.query.before ? new Date(req.query.before) : undefined,
        req.query.by,
        req.query.limit ? parseInt(req.query.limit, 10) : undefined
    );

    res.json({ devices });
})

handler.post(
    ...auths,
    validateBody({
        type: 'object',
        properties: {
            content: ValidateDeviceProps.device.name,
        },
        required: ['name'],
        additionalProperties: true,
    }),
    async (req, res) => {
        console.log("devices-POST")

        if (!req.user) {
            return res.status(401).end();
        }
        console.log("name:", req.body.name)
        const device = await insertDevice(req.db, {
            name: req.body.name,
            creatorId: req.user._id,
        });

        return res.json({ device });
    }
);

export default handler;