import addEvent from './event'
/* eslint-disable eqeqeq */
import { REACT_TEXT,REACT_FORWARDREF} from "./type"

function render(vdom,container){
    mount(vdom,container)
}
function mount(vdom,container){
    let Newdom = createDom(vdom)
    container.appendChild(Newdom)
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
    let classNode = new type(props)
    if(ref) ref.current = classNode
    let classVnode = classNode.render()
    classNode.oldVnode = classVnode
    return createDom(classVnode)
}
function mountFunctionComponent(vdom){
    const { type,props } = vdom
    let funcVnode =  type(props)
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
export function twoVnode(dom,oldnode,newnode){
    let newdom = createDom(newnode)
    let olddom = oldnode.dom
    dom.replaceChild(newdom,olddom)
}
export default ReactDOM