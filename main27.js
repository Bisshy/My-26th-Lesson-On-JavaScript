//Asychronuous Programming

//Callbacks
// setTimeout(()=> console.log("Tick"), 500);

// import { bigOak } from "./crow-tech.js";



// bigOak.readStorage("food caches", caches => {
//     let firstcache = caches[0];
//     bigOak.readStorage(firstcache, info =>{
//         console.log(info);
//     });
// });

// bigOak.send("Cow Pasture", "note", "Lets caw loudly at 7pm", 
//             ()=> console.log("Note delivered")
// );

// import {defineRequestType} from "./crow-tech";

// defineRequestType("note", (nest, content, source, done)=>{

//     console.log(`${nest.name} received note: ${content}`);
//     done();
// })

//Promises
// let fifteen = Promise.resolve(15);
// fifteen.then(value => console.log(`Got ${value}`));

// const myPromise = new Promise((resolve, reject)=>{
//     setTimeout(()=> {
//         const success = true;

//         if(success){
//             resolve("operation completed successfully");
//         }else{
//             reject("operation failed.");
//         }
//     }, 2000);
// });

// myPromise.then (result =>{
//     console.log("promise fulfilled:", result);
// })
// .catch(error => {
//     console.error("promise rejected:", error); 
// })

// const anotherPromise = new Promise((resolve, reject)=>{
//     setTimeout(()=>{resolve ("promise fulfilled successfully")

//     }, 2000);
// });

// anotherPromise.then(result => {
//     console.log("First handler:", result);
// });

// anotherPromise.then(result =>{
//     console.log("Second handler:", result);
// });

// setTimeout(()=> {
//     anotherPromise.then(result=>{
//         console.log("Third handler (registered late):",result );
//     });
// }, 3000);

// const promise = Promise.resolve(5);

// const newPromise = promise.then(value =>{
//     console.log("original value:", value);
//     return value * 2; 
// });

// newPromise.then(newValue =>{
//     console.log("New resolved value:", newValue);
// });

//Using Promise as a constructor.

// new Promise((resolve, reject)=>{

// })

//Creating a promise based interface for the readStorage function:

// function storage(nest, name){
//     return new Promise(resolve=>{
//         nest.readStorage(name, result => resolve(result));
//     });
// }

// storage(bigOak, "enemies").then(value => console.log("Got", value));

//Failure

// new Promise((_, reject)=> reject(new Error("Fail")
// ))
// .then(value=> console.log("Handler 1"))
// .catch(reason=>{
//     console.log("Caught failure " + reason );
//     return "nothing";
// })
// .then(value => console.log("Handler 2", value));

//Networks are bad

// class Timeout extends Error {}

// function request(nest, target, type, content){
//     return new Promise((resolve, reject)=>{
//         let done = false;
//         function attempt(n){
//             nest.send(target, type, content, (failed, value)=>{
//                 done =true;
//                 if(failed) reject(failed);
//                 else resolve(value);
//             });
//             setTimeout(()=>{
//                 if(done) return;
//                 else if (n < 3) attempt (n + 1);
//                 else reject(new Timeout("Timed out"));
//             }, 250)
//         }
//         attempt(1);
//     });
// };

// function requestType(name, handler){
//     defineRequestType(name, (nest, content, source, callback)=>{
//         try{
//             Promise.resolve(handler(nest, content, source))
//             .then(response => callback(null, response), 
//                     failure => callback(failure));
//         }catch(exception){
//             callback(exception);
//         }
//     })
// }



// Collection of Promises


// function availableNeighbors(nest){
//     let requests = nest.neighbors.map(neighbor =>{
//         return request(nest, neighbor, "ping")
//             .then(() => true, () => false);
//     });
//     return promise.all(requests).then(result =>{
//         return nest.neighbors.filter((_, i) => result[i]);
//     });
// }


//Network Flooding

// import {everywhere} from "./crow-tech";

// everywhere(nest => {
//     nest.state.gossip = [];
// });

// function sendGossip(nest, message, exceptFor = null){
//     nest.state.gossip.push(message);
//     for(let neighbor of nest.neighbors){
//         if(neighbor == exceptFor) continue;
//         request(nest, neighbor, "gossip", message);
//     }
// }

// requestType("gossip", (nest, message, source)=>{
//     if(nest.state.gossip.includess(message)) return;
//     console.log(`${nest.name} received gossip '${message} from ${source}`);
//     sendGossip(nest, message, source);
// })

//Message Routing

// requestType("connections", (nest, {name, neighbors}, source)=>{
//     let connections = nest.state.connections;
//     if(JSON.stringify(connections.get(name))== JSON.stringify(neighbors)) return;
//     connections.set(name, neighbors);
//     broadcastConnections(nest, name, source);
// });

// function broadcastConnections(nest, name, exceptFor = null){
//     for(let neighbor of nest.neighbors){
//         if(neighbor == exceptFor) continue;
//         request(nest, neighbor, "connections", {
//             name,
//             neighbors: nest.state.connections.get(name)
//         });
//     }
// }

// everywhere(nest =>{
//     nest.state.connections = new Map;
//     nest.state.connections.set(nest.name, nest.neighbors);
//     broadcastConnections(nest, nest.name);
// });

// function findRoute(from, to, connections){
//     let work = [{at:from, via:null}];
//     for(let i = 0; i < work.length; i++){
//         let{at, via} = work[i];
//         for(let next of connections.get(at) || []){
//             if(next == to) return via;
//             if(!work.some(w => w.at == next)){
//                 work.push({at:next, via:via} || next);
//             }
//         }
//     }
//     return null;
// };

// function routeRequest(nest, target, type, content){
//     if(nest.neighbors.includes(target)){
//         return request(nest, target, type, content);
//     }else{
//         let via = findRoute(nest.name, target, nest.state.connections);
//         if(!via) throw new Error(`No route to ${target}`);
//         return request(nest, via, "route", {target, type, content});
//     }
// }

// requestType("route", (nest, {target, type, content})=>{
//     return routeRequest(nest, target, type, content);
// });

//Async Functions

// requestType("storage", (nest, name)=> Storage(nest, name));

// function findInStorage(nest, name){
//     return Storage(nest, name).then(found =>{
//         if(found != null) return found;
//         else return findInRemoteStorage(nest, name);
//     });
// }

// function network(nest){
//     return Array.from(nest.state.connections.keys());
// }

// function findInRemoteStorage(nest, name){
//     let sources = network(nest).filter(n => n != nest.name);
//     function next(){
//         if (sources.length == 0){
//             return Promise.reject(new Error ("Not Found"));
//         }else{
//             let source = sources[Math.floor(Math.random() * sources.length)];
//             sources = sources.filter(n => n != source)
//             return routeRequest(nest, source, "storage", name)
//             .then(value => value != null ? value : next(), next);

//         }
//     }
//     return next();
// }

//rewriting async function

// async function findInStorage(nest, name) {
//     let local = await storage(nest, name);
//     if(local != null) return local;

//     let sources = network(nest).filter(n => n != nest.name);
//     while(sources.length > 0){
//         let source = sources[Math.floor(Math.random()*sources.length)];

//         sources = sources.filter( n => n != source);

//         try{
//             let found = await routeRequest(nest, source, "storage",

//                                 name);
//             if (found != null) return found;
//         }catch(_){}
//     }
//     throw new Error("Not found");
// }

//Generators
function* powers(n){
    for(let current = n; ; current *=n){
        yield current;
    }
}

for(let power of powers(4)){
    if (power > 100 ) break;
    console.log(power);
}

class Group {
    #members = [];

    add(value){
        if(!this.has(value)){
            this.#members.push(value);
        }
    }

    delete(value){
        this.#members = this.#members.filter(v => v !== value );
    }
    
    has(value){
        return this.#members.includes(value);
    }

    static from (collection){
        let group = new Group;
        for(let value of collection){
            group.add(value);
        }
        return group;
    }

    [Symbol.iterator] = function*() {

        for (let i = 0; i < this.#members.length; i++){
            yield this.#members[i];
        }
    }
}

for (let value of Group.from(["a", "b", "c"])){
    console.log (value);
}
// Group.prototype[Symbol.iterator] = function*(){
//     for(let i = 0; i < this.members.length; i++){
//         yield this.members[i];
//     }
// };

//The Event Loop

// try{
//     setTimeout(()=>{
//         throw new Error("Woosh");
//     }, 20);
// }catch(_){
//     console.log("caught");
// }

// let start = Date.now();
// setTimeout(()=>{
//     console.log("Timeout ran at", Date.now() - start);
// }, 20);
// while(Date.now() < start + 50) {}
// console.log("Wasted time until", Date.now() - start);

Promise.resolve("Done").then(console.log);
console.log("Me first!");

//Asynchronous Bugs

function anyStorage(nest, source, name){
    if (source == nest.name) return Storage(nest, name);

    else return routeRequest(nest, source, "storage", name);
}

async function chicks(nest, year) {
    let list = "";
    await Promise.all(network(nest).map(async name =>{
        list += `${name} : ${
            await anyStorage(nest, name, `chicks in ${year}`)
        }\n`;
    }));
    return list;
}

async function chicks2(nest, year) {
    let lines = network(nest).map(async name => {
        return name + ": " +
        await anyStorage(nest, name, `chicks in ${year}`);
    });
    return (await Promise.all(lines)).join("\n");
}

//Exercise

//Tracking the scapel

function anystorage(nest, source, name){
    if(source == nest.name) return storage(nest, name);
    else return routeRequest(nest, source, "storage", name);
}
async function locateScapel(nest) {
    let location = await anyStorage(nest, "scapel");
    if(location == nest) return nest;
    else return locateScapel(location); 
    
}

function locateScapel(nest){
    return anyStorage(nest, "scapel").then(location => {
        if(location == nest) return nest;
        else return locateScapel(location)
    })
}

function locateScapel(nest){
    return new Promise((resolve, reject)=>{
        anyStorage(nest, "scapel").then(location =>{
            if(location == nest) resolve(nest);
            else locateScapel(location).then(resolve).catch(reject);
        }).catch(reject);
    })
}

//Correction

async function locateScapel(nest) {
    let current = nest.name;

    for(;;){
        let next = await anyStorage(nest, "scapel")
        if(next == current) return current;
        current = next;
    }
}

function locateScapel(nest){
    function loop(current){
        return anyStorage(nest, "scapel", current).then(next =>{
            if(next == current) return current;
            else return loop(next);
        });
    }
    return loop(nest.name);
}

function promise_all(promises){
    return new Promise((resolve, reject)=>{
        let results = [];
        let pending = promises.length;
        for(let i = 0; i < promises.length; i++){
        promises[i].then(result =>{
            results[i] = result;
            pending --;
            if(pending == 0) resolve (results);
            }).catch(reject);
        }
        if(promises.length == 0) resolve(reject);
    })
}