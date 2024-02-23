import { updataQueue } from "./component"

export default function addEvent(dom,eventType,handler){
    let store = dom.store || (dom.store ={})

    store[eventType] = handler
    if(store[eventType]){
        document[eventType] = dispatchEvent
    }
}

function dispatchEvent(event){
    let {target,type} = event
    let eventType = `on${type}`
    let {store} = target
    let handler = store && store[eventType]
    updataQueue.isBatchData = true
    handler && handler(createBaseEvent(event))
    updataQueue.isBatchData = false
    updataQueue.batchUpdata()

}

function createBaseEvent(nativeEvent){
    let syntheticBaseEvent = {}
    for(let key in nativeEvent){
        syntheticBaseEvent[key] = nativeEvent[key]
    }
    syntheticBaseEvent.nativeEvent = nativeEvent
    syntheticBaseEvent.preventDefault = preventDefault
    return syntheticBaseEvent
}

function preventDefault(event){
    if(!event){
        window.event.returnValue = false
    }
    if(event.preventDefault){
        event.preventDefault()
    }
}