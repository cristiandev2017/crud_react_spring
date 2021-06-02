import React, {useContext, useReducer, useEffect, useRef, useState, createContext} from 'react';
import './App.css';
//La variable HOST APi tendra el URL de la api generada por spring
const HOST_API = "http://localhost:8080/api"
//Aca ponemos las listas o variables que usaremos en el transcurso del programa
const initialState = {
  list : [],
  item:{}
}

//La variable Store sera de tipo contexto y me permitira almacenar los estados internos de la aplicacion
const Store = createContext(initialState);

// Este componente servira para los datos que se van agregando en el transcurso del video mas que todo para guardar,actualizar
const Form = () =>{
    
  //Este hook nos permite identificar las propiedades de un componente en especifico. se inicializa cuando el componente es montado.
  const formRef = useRef(null);
  //Aca usaremos un estado interno por medio del Hook useState
  const {dispatch,state: {item}} = useContext(Store);
  const [state,setState] =useState(item);

  const onAdd = (event) =>{
    //Esto evita que se recargue la pagina y asi tener los elementos en la misma vista.
    event.preventDefault();

    //Aca le mandamos los valores que guardaremos en la base de datos
    const request = {
      name:state.name,
      id: null,
      isCompleted: false
    };
    //Este traera toda la informacion (Por medio de fectch a diferencia del listar le mandamos un body)
    fetch(HOST_API+"/todo",{
      method: "POST",
      body: JSON.stringify(request),
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(response=>response.json())
    .then((todo)=>{
      dispatch({type: "add-item",item:todo});
      setState({name:""});
      formRef.current.reset();
    });
  }

    //Este me permitira editar
    const onEdit = (event) =>{
    event.preventDefault();

    const request = {
      name:state.name,
      id: item.id,
      isCompleted: item.isCompleted
    };
    //Ejecutara el metodo PUT para actualizar los datos en el onEdit
    fetch(HOST_API+"/todo",{
      method: "PUT",
      body: JSON.stringify(request),
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(response=>response.json())
    .then((todo)=>{
      dispatch({type: "update-item",item:todo});
      setState({name:""});
      formRef.current.reset();
    });
  }

    return <form ref={formRef}>
     <input type="text" name="name" defaultValue={item.name} onChange={(event)=>{
        setState({...state, name: event.target.value})  
      }}></input>
      { item.id && <button onClick={onEdit}>Actualizar</button> }
      { !item.id &&  <button onClick={onAdd}>Agregar</button> }   
    </form>
}

//Este componente me listara todos los datos
const List = () =>{
  const {dispatch,state} = useContext(Store);

  useEffect(()=>{
    fetch(HOST_API+"/todos")
    .then(response=>response.json())
    .then((list)=>{
      dispatch({type:"update-list", list})
    })
  }, [state.list.length, dispatch]);
  //Esta constante o componente lo que hara es permitir borrar por medio de un ID
  const onDelete = (id) =>{
    fetch(HOST_API + "/"+id+"/todo",{
      method: "DELETE"
    })
    .then((list)=>{
      dispatch({type:"delete-item",id})
    })
  };
  
  const onEdit = (todo) =>{
  dispatch({type:"edit-item",item: todo})
  }
  return <div>
           <table>
             <thead>
               <tr>
                 <td>ID</td>
                 <td>Nombre</td>
                 <td>¿Esta completado?</td>
               </tr>
             </thead>
           </table>
           <tbody>
             {state.list.map((todo)=>{
               return <tr key={todo.id}>
                       <td>{todo.id}</td>
                       <td>{todo.name}</td>
                       <td>{todo.isCompleted === true ? "SI" : "NO"}</td>
                       <td><button onClick={()=>onDelete(todo.id)}>Eliminar</button></td>
                       <td><button onClick={()=>onEdit(todo)}>Editar</button></td>
                      </tr>
             })}
           </tbody>
       </div> 
}

//Una funcion reduce es una funcion pura,dado una entrada recibira la misma salida de esa entrada
//Argumentos son entrada  
function reducer(state,action){
  switch(action.type){
    case 'update-item':
      const listUpdateEdit = state.list.map((item)=>{
        if(item.id === action.item.id){
           return action.item;
        }
        return item;
      });
      return {...state,list: listUpdateEdit, item: {}}        
    case 'delete-item':
      const listUpdate = state.list.filter((item)=>{
        return item.id !== action.id;
      });
      return {...state,list:listUpdate}
    case 'update-list':
      return {...state,list:action.list}
    case 'edit-item':
      return {...state,item:action.item}
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return {...state,list: newList}
    default:
      return state;
  }
}

const StoreProvider = ({ children}) => {
  
  const [state,dispatch] = useReducer(reducer,initialState);

  return <Store.Provider value={{ state,dispatch}}>
      {children}
    </Store.Provider>
}

//Este me tendra toda la logica anterior
function App() {
  return <StoreProvider>
    <Form />
    <List />
  </StoreProvider> 
}

//Se exporta la clase para ser usada en el index como componente
export default App;