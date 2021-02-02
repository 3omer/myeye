require("dotenv").config()
const QUEUE_NAME = process.env.QUEUE_NAME
const q = QUEUE_NAME

const amqlib = require('amqplib')
let channel

const getChannel = async () => {
    return new Promise((resolve, reject) => {
        if (channel) {
            return resolve(channel)
        }

        amqlib.connect(process.env.AMQP_URL).then(conn => {
            conn.createChannel().then(ch => {
                console.log('Channel created')
                channel = ch
                return resolve(channel)
            })
        }).catch((err) => reject(err))
    })
}


/**
 * Queue new image processing request
 * @param {string} orignalImageURL The worker will use this URL to get the image for processing
 * @param {string} uploadTo After processing, The worker upload the result image to this URL
 */
const queueImage = async (orignalImageURL, uploadTo) => {
    payload = JSON.stringify({
        downloadFrom: orignalImageURL,
        uploadTo
    })

    const channel = await getChannel()
    return new Promise((resolve, reject) => {
        channel.assertQueue(q, { durable: true })
        // false when buffer is full 
        const isSent = channel.sendToQueue(q, Buffer.from(payload))
        if (isSent) {
            console.log("queueImage()", "success");
            return resolve(isSent)
        }
        // TODO: accept cb to handle full buffer case instead of rejecting
        reject(`Failed to send image ${inputPath} channel buffer is full. Create new channel or try latter`)
    })
}

module.exports = queueImage