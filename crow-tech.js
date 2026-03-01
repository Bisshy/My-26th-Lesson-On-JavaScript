class StorageBulb{
    constructor(storage, name){
        this.storage = storage;
        this.name = name;
    }

    readStorage(name, callback){
        setTimeout(()=>{
            const result = this.storage[name];
            callback(result);
        }, 100);

    };

    send(targetName, type, content, responseCallback){
        console.log(`sending "${type}" to ${targetName}: ${content}`);

        setTimeout(()=> {responseCallback();}, 1000)
    };
}

const data = {
    "food caches":["cache1", "cache2"],
    "cache1":{location:"under tree",
                items:["nuts", "berries"]
    },
    "cache2":{location:"inside hollow log",
                items:["seeds"]
    }
};

export const bigOak = new StorageBulb(data);

function createNest(name){
    const handlers = {};

    function defineRequestType(type, handler){
        handlers[type] = handler;
    }

    function receiveRequest (type, content, source, done){
        if (handlers[type]){
            handlers[type]({name}, content, source, done);
        }else{
            console.log(`${name} has no handler for request type "${type}"`);

            done();
        }
    }

    return {defineRequestType, receiveRequest, name};
}

