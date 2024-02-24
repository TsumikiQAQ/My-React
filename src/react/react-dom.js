import addEvent from './event'
/* eslint-disable eqeqeq */
import { REACT_TEXT,REACT_FORWARDREF, MOVE, REACTNEXT, REACT_PROVIDER, REACT_CONTEXT, REACT_MEMO} from "./type"

let hooksState = []
let hookIndex = 0
let schellUpdate
function render(vdom,container){
    mount(vdom,container)
    schellUpdate = ()=>{
        hookIndex = 0
        twoVnode(container,vdom,vdom)
    }
}
export function useState(inistalState){
    hooksState[hookIndex] = hooksState[hookIndex] || inistalState
    let currentIndex = hookIndex
    function setState(newState){
        hooksState[currentIndex] = newState
        schellUpdate()
    }
    return [hooksState[hookIndex++], setState]
}
function mount(vdom,container){
    let Newdom = createDom(vdom)
    if(Newdom) container.appendChild(Newdom)
    if(Newdom&&Newdom.componentDidMount){
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

    if(type && type.$$typeof == REACT_MEMO){
        return mountMemoComponent(vdom)
    }else if(type && type.$$typeof == REACT_CONTEXT){
        return mountContextComponent(vdom)
    }else if(type.$$typeof == REACT_PROVIDER){
        return mountProviderComponent(vdom)
    }else if(type && type.$$typeof == REACT_FORWARDREF){
        return mountForWardRefComponent(vdom)
    }else if(type === REACT_TEXT){
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
            changeChildren( children,dom,props)
        }
    }
    vdom.dom = dom
    if(ref) ref.current = dom
    return dom
}
function mountMemoComponent(vdom){
    let {type, props} = vdom
    let renderVdom = type.type(props)
    vdom.prevProps = props
    vdom.oldVnode = renderVdom
    return createDom(renderVdom)
}
function mountContextComponent(vdom){
    let {type, props} = vdom
    let context = type._context
    let renderVdom = props.children(context._currentValue)
    vdom.oldVnode = renderVdom
    return createDom(renderVdom)
}
function mountProviderComponent(vdom){
    let {type, props} = vdom
    let context = type._context
    context._currentValue = props.value
    let renderVdom = props.children
    vdom.oldVnode = renderVdom
    return createDom(renderVdom)
}

function mountForWardRefComponent(vdom){
    const { type,props,ref} = vdom
    let refVnode = type.render(props,ref)
    return createDom(refVnode)
}
function mountClassComponent(vdom){
    const {type,props,ref} = vdom
    let classInstance = new type(props)
    if(type.contextType){
        classInstance.context = type.contextType._currentValue
    }
    if(ref) ref.current = classInstance
    if(classInstance.componentWillMount){
        classInstance.componentWillMount()
    }
    let classVnode = classInstance.render()
    vdom.oldVnode = classInstance.oldVnode = classVnode
    if(!classVnode) return null
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
function changeChildren( children,dom,props){
    if(typeof children == 'string' || typeof children == 'number'){
        children = {type: REACT_TEXT, content: children}
        mount(children, dom)
    }
    else if(typeof children == 'object' && children.type){
        props.children.mountIndex = 0
        mount(children, dom)
    }else if(Array.isArray(children)){
        children.forEach((item,index)=>{
            item.mountIndex = index
            mount(item, dom)
        })
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
    if(oldVnode.type.$$typeof == REACT_MEMO){
        updateMemoComponent(oldVnode,newVnode)
    }else if(oldVnode.type.$$typeof == REACT_PROVIDER){
        updateProviderComponent(oldVnode,newVnode)
    }else if(oldVnode.type.$$typeof == REACT_CONTEXT){
        updateContextComponent(oldVnode,newVnode)
    }else if(oldVnode.type == newVnode.type == REACT_TEXT){
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
function updateMemoComponent(oldVdom,newVdom){
    let {type,prevProps} = oldVdom
    if(!type.compare(prevProps,newVdom.props)){
        let oldDom = findDom(oldVdom)
        let parentDom = oldDom.parentNode
        let {type,props} = newVdom
        let renderVdom = type.type(props)
        twoVnode(parentDom,oldVdom.oldVnode,renderVdom)
        newVdom.prevProps = props
        newVdom.oldVnode = renderVdom
    }else{
        newVdom.prevProps = prevProps
        newVdom.oldVnode = oldVdom.oldVnode
    }
    
    
}
function updateContextComponent(oldVnode,newVnode){
    let oldDom = findDom(oldVnode)
    let parentDom = oldDom.parentNode
    let {type,props} = newVnode
    let context = type._context

    let renderVdom = props.children(context._currentValue)

    twoVnode(parentDom,oldVnode.oldVnode,renderVdom)
    oldVnode.oldVnode = renderVdom

}
function updateProviderComponent(oldVnode,newVnode){
    let oldDom = findDom(oldVnode)
    let parentDom = oldDom.parentNode
    let {type,props} = newVnode
    let context = type._context

    context._currentValue = props.value
    let renderVdom = props.children
    twoVnode(parentDom,oldVnode.oldVnode,renderVdom)
    oldVnode.oldVnode = renderVdom

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
    // let maxLength = Math.max(oldChildren.length,newChildren.length)
    // for(let i=0;i<maxLength;i++){
    //     let newVdom = oldChildren.find((item,index)=>index>i&&item&&findDom(item))
    //     twoVnode(parentDom,oldChildren[i],newChildren[i],newVdom&&findDom(newVdom))
    // }
    let keyOldMap = {}
    oldChildren.forEach((oldChild,index)=>{
        let oldKey = oldChild.key?oldChild.key:index
        keyOldMap[oldKey] = oldChild
    })
    let lastPlaceIndex = 0
    let patch = []
    newChildren.forEach((newChild,index)=>{
        newChild.mountIndex = index
        let newKey = newChild.key?newChild.key:index

        let oldVchild = keyOldMap[newKey]
        if(oldVchild){
            updateElement(oldVchild,newChild)
            if(oldVchild.mountIndex<lastPlaceIndex){
                patch.push({
                    type:MOVE,
                    oldVchild,
                    newChild,
                    mountIndex:index
                })
                delete keyOldMap[newKey]
            lastPlaceIndex = Math.max(oldVchild.mountIndex,newChild.mountIndex)
            }else{
                patch.push({
                    type:REACTNEXT,
                    newChild,
                    mountIndex:index
                })

            }
        }
    })

    let moveChildern = patch.filter(action=>action.type == MOVE).map(action=>action.oldVchild)

    Object.values(keyOldMap).concat(moveChildern).forEach(oldChildren=>{
        let currentDom = findDom(oldChildren)
        parentDom.removeChild(currentDom)
    })
    patch.forEach(action=>{
        let {type,oldVchild,newChild,mountIndex} = action
        let childNodes = parentDom.childNodes
        if(type == REACTNEXT){
            let newDOM = createDom(newChild)
            let childNode = childNodes[mountIndex]
            if(childNode){
                parentDom.insertBefore(newDOM, childNode)
            }else{
                parentDom.appendChild(newDOM)
            }
        }else if(type ==MOVE){
            let oldDom = findDom(oldVchild)
            let childNode = childNodes[mountIndex]
            if(childNode){
                parentDom.insertBefore(oldDom,childNode)
            }else{
                parentDom.appendChild(oldDom)
            }
        }
    })

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
const ReactDOM = {
    render,
    createPortal:render
}
export default ReactDOM