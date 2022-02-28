import { ValidateDeviceProps } from "@/api-lib/constants";
import { findDeviceById } from "@/api-lib/db";

import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {

    const device = await findDeviceById(req.db, req.query.deviceId);
    // console.log("get--device:", device)
    if (!device) {
        return res.status(404).json({ error: { message: 'Device is not found.' } });
    }

    return res.json({device});
})


export default handler;