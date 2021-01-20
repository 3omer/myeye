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


// TODO: accept cb to handle full buffer case instead of rejecting
const queueImage = async (inputPath, outputPath) => {
    payload = JSON.stringify({
        inputPath: inputPath,
        outputPath: outputPath
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
        reject(`Failed to send image ${inputPath} channel buffer is full. Create new channel or try latter`)
    })
}

module.exports = queueImage