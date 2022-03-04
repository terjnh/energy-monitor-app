import { ValidateDeviceProps } from "@/api-lib/constants";
import { deleteDeviceById, updateDeviceById } from "@/api-lib/db";
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import multer from 'multer';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(database, ...auths);

handler.get(async (req, res) => {
    if (!req.user) return res.json({ user: null });
    return res.json({ user: req.user });
});

handler.delete(async(req, res) => {
    console.log("req.query:", req.query)

    const del = await deleteDeviceById(req.db, {
        deviceId: req.query.deviceId
    })

    // return res.status(200).send("Device deleted")
    return res.json({ message: "Device deleted successfully!"})
});


export default handler;