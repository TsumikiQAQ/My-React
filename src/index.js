import React from './react/react';
import ReactDOM from './react/react-dom';

// const element1 = React.createElement('h1',{
//   className:'title',
//   style:{
//     color:'red',
//   }
// },'test',React.createElement('div',{},'test2'))
// function Element2(props) {
//   return React.createElement('h1',{},'hello')
// }
// const element = <Element2 name={'admin'}></Element2>
// let element2 = React.createElement(Element2,{
//   name: 'test'
// })
function TextInput(props,ref){
  return <input ref={ref}></input>
}
let ForWardTextInput = React.forwardRef(TextInput)
// class Element3 extends React.Component {

//   render(){
//     return <h1>test2</h1>
//   }
// }
class element extends React.Component{
  constructor(props) {
    super(props)
    this.state = {num:0,id:1}
    this.a = React.createRef()
  }
  handleClick = (event)=>{
    console.log(this.a.current);
    this.setState({num:this.state.num + 1 })
    this.setState({num:this.state.num + 1 })
  }
  render(){
    return <div>
      <ForWardTextInput ref={this.a}></ForWardTextInput>
    <h1 >hello {this.state.num}</h1>
    <button onClick={this.handleClick}>+</button>
    </div>
  }
}
let element2 = React.createElement(element,{name:'1',count:'0'})
ReactDOM.render(element2,document.getElementById('root'));
