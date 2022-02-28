import { ValidateDeviceProps } from "@/api-lib/constants";
import { updateDeviceById } from "@/api-lib/db";
import { ncOpts } from '@/api-lib/nc';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(database, ...auths);

handler.patch(
    validateBody({
        type: 'object',
        properties: {
            content: ValidateDeviceProps.device.name,
        },
        additionalProperties: true,
    }),
    async (req, res) => {
        console.log("Device patch user:", req.user)
        if (!req.user) {
            req.status(401).end();
            return;
        }

        const { name, _id } = req.body;
        const updateData = {
            "name": name
        }

        const device = await updateDeviceById(req.db, _id, updateData);

        res.json({ device })
    }

)



export default handler;