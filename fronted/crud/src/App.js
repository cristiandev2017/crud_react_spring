import React, {useContext, useReducer, useEffect, useRef, useState, createContext} from 'react';
import './App.css';
//La variable HOST APi tendra el URL de la api generada por spring
const HOST_API = "http://localhost:8080/api"
//Aca ponemos las listas o variables que usaremos en el transcurso del programa
const initialState = {
  list : []
}

//La variable Store sera de tipo contexto y me permitira almacenar los estados internos de la aplicacion
const Store = createContext(initialState);

// Este componente servira para los datos que se van agregando en el transcurso del video mas que todo para guardar,actualizar
const Form = () =>{
    
  //Este hook nos permite identificar las propiedades de un componente en especifico. se inicializa cuando el componente es montado.
  const formRef = useRef(null);
  //Aca usaremos un estado interno por medio del Hook useState
  const {dispatch} = useContext(Store);
  const [state, setState ] = useState({});

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

    return <form ref={formRef}>
      <input type="text" name="name" onChange={(event)=>{
        setState({...state, name: event.target.value})  
      }}></input>
      <button onClick={onAdd}>Agregar</button>  
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
                       <td>{todo.isCompleted}</td>
                      </tr>
             })}
           </tbody>
       </div> 
}

  function reducer(state, action){
    switch (action.type) {
      case 'update-list':
        return {...state, list:action.list}
      case 'add-item':
        //Obtiene el estado reciente y en base a ese agrega uno nuevo con el push
        const newList = state.list;
        newList.push(action.item);
        return {...state,list:newList}
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
