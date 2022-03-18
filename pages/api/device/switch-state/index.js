import { ValidateDeviceProps } from "@/api-lib/constants";
import { updateDeviceSwitchStateById } from "@/api-lib/db";
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nc from 'next-connect';

const upload = multer({ dest: '/tmp' });
const handler = nc(ncOpts);
handler.use(database, ...auths);


handler.get(async (req, res) => {
    if (!req.user) return res.json({ user: null });
    return res.json({ user: req.user });
});

handler.patch(
    // validateBody({
    //     type: 'object',
    //     properties: {
    //         switchState: ValidateDeviceProps.device.switchState
    //     },
    //     additionalProperties: true,
    // }),
    async (req, res) => {
        if (!req.user) {
            req.status(401).end();
            return;
        }

        const { switchState, _id } = req.body;

        const switchData = await updateDeviceSwitchStateById(req.db, _id, switchState);

        // res.json({"switchState": switchState})
        res.json(switchData)
    }
);


export default handler;