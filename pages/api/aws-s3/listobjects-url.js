import aws from 'aws-sdk';

export default async function handler(req, res) {
    aws.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        region: process.env.REGION,
        signatureVersion: 'v4',
    });

    const s3 = new aws.S3();

    const allKeys = await getAllKeys({ 
        Bucket: process.env.BUCKET_NAME,
        Prefix: "devices/"
    });


    async function getAllKeys(params, allKeys = []) {
        const response = await s3.listObjectsV2(params).promise();
        response.Contents.forEach(obj => {
            allKeys.push(obj)
        });

        if (response.NextContinuationToken) {
            params.ContinuationToken = response.NextContinuationToken;
            await getAllKeys(params, allKeys); // RECURSIVE CALL
        }
        // console.log('allKeys:', allKeys)
        return allKeys;
    }

    // let allKeys = []
    // const listAllKeys = (params, out = []) => new Promise((resolve, reject) => {
    //     s3.listObjectsV2(params).promise()
    //         .then(({ Contents, IsTruncated, NextContinuationToken }) => {
    //             out.push(...Contents);
    //             !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, { ContinuationToken: NextContinuationToken }), out));
    //         })
    //         .catch(reject);
    // });

    // listAllKeys({
    //     Bucket: process.env.BUCKET_NAME,
    //     Prefix: "devices/"
    // }, allKeys)
    //     .then(console.log)
    //     .catch(console.log)


    res.status(200).json(allKeys);
}
