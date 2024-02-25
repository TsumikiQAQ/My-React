import { REACT_CONTEXT, REACT_ELEMENT, REACT_FORWARDREF, REACT_MEMO, REACT_PROVIDER } from "./type"
import { toObject,shallEqual } from "./utils"
import Component from "./component"
import {useState,useReducer,useMemo,useCallback,useEffect,useLayoutEffect,useRef} from './react-dom'
function createElement (type,config,children){
    let key,ref
    if(config){
        key = config.key
        ref = config.ref
        delete config.key
        delete config.ref
    }
    let props = {...config}
    if(config)
    {if(arguments.length > 3){
        props.children = Array.prototype.slice.call(arguments,2).map(toObject)
    }else if(arguments.length ===3){
        props.children = toObject(children)
    }
    }

    
    return{
        $$typeof:REACT_ELEMENT,
        key,
        ref,
        type,
        props
    }
}
function createRef(props){
    let ref = {current:props}
    return ref
}
function forwardRef(render){
    return {
        $$typeof:REACT_FORWARDREF,
        render
    }
}
function CreateContext(){
    let context = {
        $$typeof:REACT_CONTEXT,
        _currentValue:undefined
    }
    context.Provider = {
        $$typeof:REACT_PROVIDER,
        _context:context
    }
    context.Consumer ={
        $$typeof:REACT_CONTEXT,
        _context:context
    }
}
function cloneElement(oldElement,props,children){
    if(arguments.length > 3){
        props.children = Array.prototype.slice.call(arguments,2).map(toObject)
    }else if (arguments.length === 3){
        props.children = toObject(children)
    }
    return {
        ...oldElement,
        props
    }
}
class PureComponent extends Component{
    shouldComponentUpdate(nextProps, nextState){
        return !shallEqual(this.props,nextProps) || !shallEqual(this.state,nextState)
    }
}
function memo(type,compare = shallEqual){
    return{
        $$typeof:REACT_MEMO,
        compare,
        type
    }
}
function useImperativeHandle(ref,factory){
    ref.current = factory()
}
const React = {
    createElement,
    Component,
    createRef,
    forwardRef,
    CreateContext,
    cloneElement,
    PureComponent,
    memo,
    useState,
    useReducer,
    useMemo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useImperativeHandle
}

export default React