const AWS = require('aws-sdk')
const s3Zip = require('s3-zip')
const region = 'us-east-1'

exports.handler = function (event, context) {
    console.log('Event Received',JSON.stringify(event))
    
    const bucket = event.Records[0].s3.bucket.name
    const objectKey = event.Records[0].s3.object.key
    const folder = null
    const zipFileFolder = "seedscripts/tmp/"

    try {
        return this.getFile(bucket,objectKey).then(data => {
            const downloadRequest = JSON.parse(data.Body.toString())
            console.log('Request data retrieved, records to process: ' + downloadRequest.files.length)
            const body = s3Zip.archive({ region: region, bucket: bucket }, folder, downloadRequest.files)
            const zipParams = { params: { Bucket: bucket, Key: zipFileFolder + downloadRequest.zipFileName } }
            const zipFile = new AWS.S3(zipParams)
            return zipFile.upload({ Body: body })
                .on('httpUploadProgress', function (evt) { console.log(evt) })
                .send(function (e, r) {
                    if (e) {
                        const err = 'zipFile.upload error ' + e
                        console.log(err)
                        context.fail(err)
                    }
                    console.log(r)
                    context.succeed(r)
                })
        }).catch(error => {
            console.log(error)
        })
    }
    catch (e) {
        var err = 'catched error: ' + e
        console.log(err)
        context.fail(err)
    }
}

getFile = (bucket, awsFileKey) => {
    AWS.config.update({
        region: region
    })
    const s3 = new AWS.S3()

    const params = {
        Bucket: bucket,
        Key: awsFileKey
    }
    const requestObject = s3.getObject(params).promise();
    requestObject.then(response => data)
        .catch(err => err)
    return Promise.resolve(requestObject)
}