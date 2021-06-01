package co.com.sofka.crud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoService {

    @Autowired
    private TodoRepository repository;
    //Sera la lista general
    public Iterable<Todo> list(){
        return repository.findAll();
    }
    //Este metodo sera para guardar
    public Todo save( Todo todo){
        return repository.save(todo);
    }

    //Este sera para eliminar
    public void delete(Long id){
        repository.delete(get(id));
    }

    //Ahora obtener por id
    public Todo get(Long id){
        //Se le debe retornar siempre.
        return repository.findById(id).orElseThrow();
    }
}
