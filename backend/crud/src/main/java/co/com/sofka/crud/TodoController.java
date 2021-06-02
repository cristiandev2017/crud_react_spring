package co.com.sofka.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    @Autowired
    private TodoService service;

    //Sera la lista general
    @GetMapping (value = "api/todos")
    public Iterable<Todo> list(){
        return service.list();
    }

    //Este metodo sera para guardar
    @PostMapping(value = "api/todo")
    public Todo save(@RequestBody Todo todo){
        return service.save(todo);
    }

    //Este sera para eliminar
    @DeleteMapping(value="api/{id}/todo")
    public void delete(@PathVariable Long id){
        service.delete(id);
    }

    //Actualizar
    @PutMapping(value = "api/todo")
    public Todo update(@RequestBody Todo todo){
        if(todo.getId() != null){
            return service.save(todo);
        }
        throw new RuntimeException("No existe el id para actualizar");
    }

    //Ahora obtener por id
    @GetMapping(value="api/{id}/todo")
    public Todo get(@PathVariable Long id){
        //Se le debe retornar siempre.
        return service.get(id);
    }
}
