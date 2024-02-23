import addEvent from './event'
/* eslint-disable eqeqeq */
import { REACT_TEXT,REACT_FORWARDREF} from "./type"

function render(vdom,container){
    mount(vdom,container)
}
function mount(vdom,container){
    let Newdom = createDom(vdom)
    container.appendChild(Newdom)
    if(Newdom.componentDidMount){
        Newdom.componentDidMount()
    }
}
function createDom(vdom){
    if(typeof vdom == 'string' || typeof vdom == 'number'){
        vdom = {
            type: REACT_TEXT,
            content: vdom
        }
    }
    let {type,props,content,ref} = vdom
    let dom
    if(type && type.$$typeof == REACT_FORWARDREF){
        return mountForWardRefComponent(vdom)
    }
    if(type === REACT_TEXT){
        dom = document.createTextNode(content)
    }else if(typeof type == 'function'){
        if(type.isReactComponent){
        return mountClassComponent(vdom)
        }else{
        return mountFunctionComponent(vdom)
    }
    }

    else{
        dom = document.createElement(type)  
    }

    if(props){
        updateProps(dom, {},props)

        let children = props.children
        if(children){
            changeChildren(dom, children)
        }
    }
    vdom.dom = dom
    if(ref) ref.current = dom
    return dom
}
function mountForWardRefComponent(vdom){
    const { type,props,ref} = vdom
    let refVnode = type.render(props,ref)
    return createDom(refVnode)
}
function mountClassComponent(vdom){
    const {type,props,ref} = vdom
    let classInstance = new type(props)
    if(ref) ref.current = classInstance
    if(classInstance.componentWillMount){
        classInstance.componentWillMount()
    }
    let classVnode = classInstance.render()
    vdom.oldVnode = classInstance.oldVnode = classVnode
    let dom = createDom(classVnode)
        if(classInstance.componentDidMount){
            dom.componentDidMount = classInstance.componentDidMount
        }
    return dom
}
function mountFunctionComponent(vdom){
    const { type,props } = vdom
    let funcVnode =  type(props)
    vdom.oldVnode = funcVnode
    return createDom(funcVnode)
}
function changeChildren(dom, children){
    if(typeof children == 'string' || typeof children == 'number'){
        children = {type: REACT_TEXT, content: children}
        mount(children, dom)
    }
    else if(typeof children == 'object' && children.type){
        mount(children, dom)
    }else if(Array.isArray(children)){
        children.forEach(item=>mount(item, dom))
    }
}
function updateProps(dom,oldProps,newProps){
    // createDom
    for(let key in newProps){
        if(key == 'children'){
            continue
        }else if(key == 'style'){
            let styleObject = newProps[key]
            for(let style in styleObject){
                dom.style[style] = styleObject[style]
            }
    }else if(key.startsWith('on')){
        addEvent(dom,key.toLocaleLowerCase(),newProps[key])
    }
    else{
        dom[key] = newProps[key]
    }
    // delete oldProps
    for(let key in oldProps){
        if(!newProps[key]){
            dom[key] = null
        }
    }
}}
const ReactDOM = {
    render
}
export function twoVnode(parentDom,oldVnode,newVnode,nextDom){
    if(!oldVnode&&!newVnode){
        return
    }else if(oldVnode && !newVnode){
        unMountVnode(oldVnode)
    }else if(!oldVnode && newVnode){
        let newDom = createDom(newVnode)
        if(nextDom){
            parentDom.insertBefore(newDom, nextDom)
        }else{
            parentDom.appendChild(newDom)
        }

        if(newDom.componentDidMount){
            newDom.componentDidMount()
        }
    }else if(oldVnode&&newVnode && oldVnode.type !== newVnode.type){
        unMountVnode(oldVnode) 
        mountVdom(parentDom,newVnode,nextDom)
    }else {
        updateElement(oldVnode,newVnode)
    }
}
function updateElement(oldVnode,newVnode){
    if(oldVnode.type == newVnode.type == REACT_TEXT){
        let currentDom = newVnode.dom = findDom(oldVnode)
        currentDom.textContent = newVnode.content
    }else if (typeof oldVnode.type == 'string'){
        let currentDom = newVnode.dom = findDom(oldVnode)
        updateProps(currentDom,oldVnode.props,newVnode.props)

        updateChildren(currentDom,oldVnode.props.children,newVnode.props.children)
    }else if (typeof oldVnode.type === 'function'){
        if(oldVnode.type.isReactComponent){
            newVnode.classInstance = oldVnode.classInstance

            updateClassComponent(oldVnode,newVnode)
        }else{
            updateFunctionComponent(oldVnode,newVnode)
        }
    }
}

function updateClassComponent(oldVnode,newVnode){
    let classInstance = newVnode.classInstance = oldVnode.classInstance

    if(classInstance.componentWillReceiveProps){
        classInstance.componentWillReceiveProps(newVnode.props)
    }
    classInstance.updater.emitUpdate(newVnode.props)
}

function updateFunctionComponent(oldVnode, newVnode){
    let parentDom = findDom(oldVnode).parentDom
    let {type,props} = newVnode
    let newRenderVdom = type(props)
    twoVnode(parentDom, oldVnode.oldVnode, newRenderVdom)
}

function updateChildren(parentDom,oldChildren,newChildren){
    oldChildren = Array.isArray(oldChildren)?oldChildren:[oldChildren]
    newChildren = Array.isArray(newChildren)?newChildren:[newChildren]
    let maxLength = Math.max(oldChildren.length,newChildren.length)
    for(let i=0;i<maxLength;i++){
        let newVdom = oldChildren.find((item,index)=>index>i&&item&&findDom(item))
        twoVnode(parentDom,oldChildren[i],newChildren[i],newVdom&&findDom(newVdom))
    }
}
function mountVdom(parentDom,newVnode,nextDom){
    let newDom = createDom(newVnode)
    if(nextDom){
        parentDom.insertBefore(newDom,nextDom)
    }else{
        parentDom.appendChild(newDom)
    }

    if(newDom.componentDidMount){
        newDom.componentDidMount()
    }
}
function unMountVnode(vdom){
    let {type,props,ref} = vdom
    let currentDom = findDom(vdom)
}
export function findDom(vdom){
    if(!vdom){
        return null
    }
    if(vdom.dom){ 
        return vdom.dom
    }else {
        return findDom(vdom.oldVnode)
    }
}
export default ReactDOM