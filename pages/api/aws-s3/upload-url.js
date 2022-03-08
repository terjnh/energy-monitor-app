import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();
  //// Upload Object
  console.log("req.query.field:", req.query.field)
  const post = await s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: "devices/" + req.query.file,
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  //// Delete Object
  // var params = {
  //   Bucket: process.env.BUCKET_NAME,
  //   Key: 'printer.jpeg'
  // }
  // s3.deleteObject(params, function(err, data) {
  //   if (err) console.log(err, err.stack);  // error
  //   else     console.log("DELETED!");                 // deleted
  // });


  res.status(200).json(post);
}
