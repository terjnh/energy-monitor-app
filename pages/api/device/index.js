import { ValidateDeviceProps } from "@/api-lib/constants";
import { deleteDeviceById, updateDeviceById } from "@/api-lib/db";
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nc from 'next-connect';

const upload = multer({ dest: '/tmp' });
const handler = nc(ncOpts);

if (process.env.CLOUDINARY_URL) {
    const {
        hostname: cloud_name,
        username: api_key,
        password: api_secret,
    } = new URL(process.env.CLOUDINARY_URL);

    cloudinary.config({
        cloud_name,
        api_key,
        api_secret,
    });
}

handler.use(database, ...auths);

handler.get(async (req, res) => {
    if (!req.user) return res.json({ user: null });
    return res.json({ user: req.user });
});


// handler.post(
//     async (req, res) => {
//         console.log('req.body: (post):', req.body)
//     }
// )

handler.patch(
    upload.single('photo'),
    validateBody({
        type: 'object',
        properties: {
            name: ValidateDeviceProps.device.name,
            energy: ValidateDeviceProps.device.energy
        },
        additionalProperties: true,
    }),
    async (req, res) => {
        if (!req.user) {
            req.status(401).end();
            return;
        }
        let photo;
        if (req.file) {
            const image = await cloudinary.uploader.upload(req.file.path, {
                width: 512,
                height: 512,
                crop: 'fill',
            });
            photo = image.secure_url;
        }

        const { name, energy, photoUrl, _id } = req.body;
        console.log('req.body:', req.body)
        // console.log('req.body(typeof):', typeof(req.body))

        const updateData = {
            "name": name,
            "energy": energy,
            // "photo": photo,
            "photoUrl": photoUrl
        }

        const device = await updateDeviceById(req.db, _id, {
            ...(name && { name }),
            ...(energy && { energy }),
            // ...(photo && { photo }),
            ...(photoUrl && { photoUrl })
        });

        res.json({ device })
    }
);

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;