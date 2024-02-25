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
// function TextInput(props,ref){
//   return <input ref={ref}></input>
// }
// let ForWardTextInput = React.forwardRef(TextInput)
// class Element3 extends React.Component {

//   render(){
//     return <h1>test2</h1>
//   }
// }
// class element extends React.Component{
//   constructor(props) {
//     super(props)
//     this.state = {num:0,id:1}
//     this.a = React.createRef()
//   }
//   handleClick = (event)=>{
//     console.log(this.a.current);
//     this.setState({num:this.state.num + 1 })
//     this.setState({num:this.state.num + 1 })
//   }
//   render(){
//     return <div>
//       <ForWardTextInput ref={this.a}></ForWardTextInput>
//     <h1 >hello {this.state.num}</h1>
//     <button onClick={this.handleClick}>+</button>
//     </div>
//   }
// }
// class One extends React.Component{
//   constructor(props){
//     super(props)
//     this.state = {
//       num : 1
//     }
//     setTimeout(()=>{
//       this.setState({num:2})
//     },1000)
//   }
//   render(){
//     return <Two num={this.state.num}></Two>
//   }
// } 

// class Three extends React.Component {
//   render(){
//     return <h1>hello {this.props.num}</h1>
//   }
// }
// function Two(props){
//   return <Three num={props.num}></Three>  
// }

// class Element extends React.Component{
//   constructor(props){
//     super(props)
//     this.state = {num:1}
//     console.log('1:初始化');
//   }
//   handleClick=()=>{
//     this.setState({num:this.state.num + 1 })
//   }
//   render(){
//     console.log('3:将要渲染');
//     return <div><h1>num:{this.state.num}</h1> 
//         <button onClick={this.handleClick}>+</button></div>

//   }

//   componentWillMount(){
//     console.log('2:将要挂载');
//   }
//   componentDidMount(){
//     console.log('4:挂载完成');
//   }
//   shouldComponentUpdate(nextProps,nextState){
//     console.log('5:是否更新');
//   }
//   componentWillUpdate(){
//     console.log('6:将要更新');
//   }
//   componentDidUpdate(){
//     console.log('7:更新完毕');
//   }
// }
// class Element extends React.Component{
//     constructor(props) {
//       super(props)
//       this.state = {arr:['a','b','c','d','e','f','g','h','i','j']}
//     }
//     handleClick = (event)=>{
//       this.setState({arr:['a','e','f','g','b']})
//     }
//     render(){
//       return <div>
//         <ul>
//           {this.state.arr.map((item, index)=>{
//            return <li key={index}>{item}</li>
//           })}
//         </ul>
//         <button onClick={this.handleClick}>+</button>
//       </div>
//     }
//   }
function Element(){
  const ref1 = React.useRef()
  console.log(ref1);
  React.useEffect(()=>{
    ref1.current.innerHTML = 'hello'
  })
  return(
    <h1 ref={ref1}> test</h1>
)
}
let element2 = React.createElement(Element,{})
ReactDOM.render(element2,document.getElementById('root'));
