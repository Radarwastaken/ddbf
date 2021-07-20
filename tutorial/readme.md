# Tutorial

Let's begin making a bot

First let's install stuff we need,

- Node.js & npm (https://nodejs.org)
- ddbf & eris (run `npm i --save ddbf eris` in bot directory.)

All this framework extends from eris is the Client class and to keep it oriented, it only adds a manager property which is how things are handled i the framework.

Basically you add extensions to manager, which can be done by either adding them through teh constructor (Manager Options) (by providing it via the third argument in client's constructor) OR by adding them manually.

Extensions can be anything you want, it should follow the extension interface (TypeScript), or for js users, just make sure it has a load function (can be async) and an unload function.

## Making a client

Let's start with making a Client,

```ts
// index.js
const { Client } = require('ddbf')

const client = new Client("my-bot-token") // Additionally options for manager and client can also be specified but they are optional so are avoided atm.

// Do not forget to do this or your bot won't login.
client.connect.then(console.log).catch(console.error)
```

You will notice your bot is online!


## Listeners & ListenerHandler

Now let's add an event listener for ready event.

For convenience sake, let's add a listeners directory to store all our listeners.

```ts
// listeners/ready.js, you can put any file name though.
module.exports = {
    event: "ready",
    emitter: "client",
    run(client) {
        console.timeLog(`${client.user.name} Logged in successfully.`)
    }
}
```

```ts
// listeners/index.js
const { ListenerHandler } = require('ddbf') // The ListenerHandler class has static methods so there is no need to create an instance to use it, though you will have to initialize it once by calling ListenerHandler.init

module.exports = {
    load: ListenerHandler.loadFrom(__dirname) // There is a filter added,by default so that'll load only js files excluding index.js (this file since it is not a listener)
    unload: () => {} // atm Listeners cannot be unloaded, i am looking to add that feature soon.
}
```

```ts
// index.js
const { Client } = require('ddbf')

const client = new Client("my-bot-token")
client.manager.loadExtension('./listeners')

client.connect.then(console.log).catch(console.error)
```

You will notice that once the client is ready, it'll do what your ready listener's run function was supposed to do.

# Commands & CommandHandler

Let's add a ping command.

Make a commands directory

```ts
// commands/ping.js
module.exports = {
    id: "ping", // This is necessary, and will help you know what command actually are you looking at.
    triggers: ["ping", "ding"], // These are triggers, if the command matches any of these, it'll run the command.
    run(msg/*, args, lexureArgs*/) { // The lexureArgs is for advanced use (flags and options and all, but we won't be using it atm so it's commented out with args since we only need msg (Message) for this command.)
        try {
            msg.channel.createMessage("Pong!")
        } catch {} // We simply do not want to do anything since the bot won't have sendMessages permission, we can add a blockIf to prevent running the command if bot does not have permissions.
    }
}
```

Let's get a command handler to make this work. CommandHandler is also a static class so no need to instantiate.

```ts
const { CommandHandler } = require('ddbf')

module.exports = {
    load: CommandHandler.loadFrom(__dirname), // Same as ListenerHandler.loadFrom, this also filters out files.
    unload: CommandHandler.unloadFrom(__dirname) // Luckily CommandHandler.unloadFrom is done and ready for use.
}
```

Now that we have 2 extensions to load (commands & listeners), it might be great to just add them in the constructor.

```ts
// index.js
const { Client, CommandHandler } = require('ddbf')

const client = new Client("my-bot-token", {}, {extensions: ["./commands", "./listeners"]})// Notice an empty object? it's added because managerOptions is third argument so an empty options object was specified, also filepaths work for extensions.
// client.manager.loadExtension('./listeners') This is no longer needed!

// Let's also add a prefix for the CommandHandler, It's better to do that before connecting the client.
CommandHandler.prefixes.add("!")

client.connect.then(console.log).catch(console.error)
```

Let's make a command that takes an infinite amount of numbers provided as command arguments

```ts
// commands/add.js
const { Argument } = require('ddbf')

module.exports = {
    id: 'add',
    triggers: ["add", "sum"],
    parseArgs: (msg, args) => {return args.forEach(Argument.Number).filter((arg) => arg === null)}, // Notice this function? now before running the command args will be parsed, acc to our code, this will check if after resolving to a number, the argument exists, if not we won't add null to the array.
    run(msg, args) {
        if(!args) return message.channel.createMessage("You need to provide numbers for this command")// Checking if args actually exists.
        const sum = 0
        args.forEach((arg) => sum = sum + arg) // Adding all numbers together
        return message.channel.createMessage(`The sum is \`${sum}\``)
    }
}
```

After you start the client send a command to the bot by sending a message like this

!ping
>>> pong

!add
>>> You need to provide numbers for this command

!add 1 2 3
>>> The sum is `6`

And now, you have a fully functioning bot! GG!
