const youtube = require('ytdl-core-discord')

const queue = []
let connection, isPlaying = false, textChannel

const playMusic = async (message, url) => {

    const voiceChannel = message.member.voice.channel;
    textChannel = message.channel
    queue.push(url)

    if (!voiceChannel) {
        message.channel.send('Join a voice channel to play music you fucking retard.')
        return
    }

    if (!connection) {
        connection = await voiceChannel.join()
    }

    if (connection.channel !== voiceChannel) {
        message.channel.send('Jesus Christ lord of hentai, you need to be WITH ME in the channel. ||stoopid fuck||')
        return
    }

    message.channel.send('Added to queue')
    if (!isPlaying)
        await play()

}

const play = async () => {
    if (!connection || queue.length === 0) return

    const url = queue.shift()
    textChannel.send('I\'m playing the song you wanted me to play, like I\'m a fucking slave.')
    const dispatcher = connection.play(await youtube(url), { type: 'opus' })

    dispatcher.on('speaking', async (isSpeaking) => {
        isPlaying = isSpeaking
        if (!isSpeaking) {
            await play()
        }
    })

}

const stopMusic = async (message) => {

    message.guild.voice.connection.disconnect()
    connection = null

    message.channel.send('Suck pp loser')

}

const getQueue = (message) => {
    if (queue.length)
        message.channel.send(queue.join('\n'))
    else
        message.channel.send('Suck pp')
}

module.exports = {
    playMusic,
    stopMusic,
    getQueue,
}