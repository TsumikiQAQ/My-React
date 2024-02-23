import {findDom, twoVnode} from './react-dom'

export const updataQueue ={
    isBatchData :false,

    updaters:[],
    batchUpdata(){
        updataQueue.updaters.forEach(updater => updater.updateComponent())
        updataQueue.isBatchData = false
        updataQueue.updaters.length = 0
    }
}
class Updater{
    constructor(classInstance){
        this.classInstance = classInstance;
        this.peddingState = []
    }
    addState(particlstate){
        this.peddingState.push(particlstate)
        this.emitUpdate()
    }
    emitUpdate(){
        if(updataQueue.isBatchData){
            updataQueue.updaters.push(this)
        }else{
        this.updateComponent()
    }
    }
    updateComponent(){
        let {peddingState,classInstance,nextProps} = this
        if(peddingState.length>0){
            shouldUpdate(classInstance,nextProps,this.getState())
        }
    }
    getState(){
        let {peddingState,classInstance} = this
        let {state} = classInstance
        peddingState.forEach(nextState=>{
            state = {...state,...nextState}
        })
        peddingState.length = 0
        return state
    }
}

function shouldUpdate(classInstance,nextProps,nextstate){
    let willUpdate = true
    if(classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps,nextstate)){
        willUpdate = false
    }
    classInstance.state = nextstate
    if(willUpdate && classInstance.componentWillUpdate){
        classInstance.componentWillUpdate()
    }
    if(willUpdate){
        classInstance.forceUpdate()
    }
}

class Component{
    static isReactComponent = true
    constructor(props){
        this.props = props
        this.state = {}
        this.updater = new Updater(this)
    }
    setState(particlstate){
        this.updater.addState(particlstate)
    }
    forceUpdate(){
        let newVnode = this.render()
        let oldVnode = this.oldVnode
        let dom = findDom(oldVnode)
        twoVnode(dom.parentNode,oldVnode,newVnode)
        this.oldVnode = newVnode
        if(this.componentDidUpdate){
            this.componentDidUpdate()
        }
    }
}

export default Component