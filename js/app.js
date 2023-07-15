var body=document.querySelector('main');
var todo_list=document.querySelector('.todo-list');
var finished_list=document.querySelector('.finished-list');
var form=document.querySelector('form');

if(localStorage.getItem('todo_list')==null){
    add_li('todo_list','Lorem ipsum dolor sit amet.',(new Date()).getTime());
    add_li('todo_list','Lorem ipsum dolor sit amet.',(new Date()).getTime());
    add_li('finished_list','Lorem ipsum dolor sit amet.',(new Date()).getTime());
}

show_from_storage();
todo_list.addEventListener('click',todo_delete_del);
todo_list.addEventListener('click',todo_edit);
todo_list.addEventListener('click',todo_tick);
finished_list.addEventListener('click',finished_tick);
finished_list.addEventListener('click',finished_delete_del);
body.addEventListener('click',todo_edit_close);
form.addEventListener('submit',add_to_todoList);


function getStorage(list_number) {   //get last arrey in local storage (list_number:  finished_list   or   todo_list)
    var oldNames;
    oldNames = JSON.parse(localStorage.getItem(list_number));

    if (oldNames == null) {
        return [];
    }

    return oldNames;
}

function show_from_storage(){   //put li from storage to ul in html
    var todo_storage=getStorage('todo_list');
    var finished_storage=getStorage('finished_list');

    todo_list.innerHTML='';
    finished_list.innerHTML='';
    for(let i=0;i<todo_storage.length;i++){
        todo_list.innerHTML+=`     <li>
                                     <div class="todo-list_li" data-id="${todo_storage[i].id}">
                                        <i id="tick" class="fa-regular fa-square"></i>
                                        <span>${todo_storage[i].value}</span>
                                        <div class="icons">
                                            <i class="fa-solid fa-pen"></i>
                                        </div>
                                     </div>
                                     <div class="delete-icon">
                                        <i class="fa-solid fa-trash"></i>
                                     </div>
                                    </li>`;

    }
    for(let i=0;i<finished_storage.length;i++){
                finished_list.innerHTML+=`  <li class="finished-list_li" data-id="${finished_storage[i].id}">
                                                <i id="tick" class="fa fa-check-square" aria-hidden="true"></i>
                                                <span>${finished_storage[i].value}</span>
                                                <div class="icons">
                                                     <i class="fa-sharp fa-solid fa-xmark"></i>
                                                </div>
                                             </li>`;
    }
}
function add_li(list_name,valuep,idp){    //name:  finished_list   or   todo_list
    var list;
    if(list_name=="finished_list"){
        list= finished_list;
    }
    else if(list_name=="todo_list"){
        list= todo_list;
    }
    var storage=getStorage(list_name);
    list.innerHTML+=`  <li class="${list_name}_li" data-id="${idp}">
                            <i id="tick" class="fa-regular fa-square"><
                            <span>${valuep}</span>
                            <div class="icons">
                                <i class='bx bx-edit'></i>
                                <i class='bx bx-x-circle'></i>
                            </div>
                        </li>`;
    storage.push({id:idp,value:valuep});
    localStorage.setItem(list_name,JSON.stringify(storage)); 
}
function todo_delete_del(e){
    if(e.target.classList.contains('fa-trash')){
    e.target.parentElement.parentElement.style.animation='delete .8s forwards';
    setTimeout(todo_delete, 1000, e);
    }
}

function todo_delete(e){  // deleteing an li from todo list
    var storage=getStorage('todo_list');
        var target_id=e.target.parentElement.parentElement.children[0].dataset.id;
        for(let i=0;i<storage.length;i++){
            if(storage[i].id==target_id){
                storage.splice(i, 1);
                localStorage.setItem('todo_list',JSON.stringify(storage)); 
                break;
            }
        }
        show_from_storage();
}

function finished_delete_del(e){
    if(e.target.classList.contains('fa-sharp')){
    e.target.parentElement.parentElement.style.animation='delete .8s forwards';
    setTimeout(finished_delete, 1000, e);
    }
}
function finished_delete(e){  // deleteing an li from finished list
    var storage=getStorage('finished_list');
        var target_id=e.target.parentElement.parentElement.dataset.id;
        for(let i=0;i<storage.length;i++){
            if(storage[i].id==target_id){
                storage.splice(i, 1);
                localStorage.setItem('finished_list',JSON.stringify(storage)); 
                break;
            }
        }
        show_from_storage();
}
function todo_edit(e){     //when you click on edit button, this function replaces the input instead  of span
    var active_input=document.querySelector('.todo-list input');
    if(e.target.classList.contains('fa-pen') && active_input==null){
         var element= e.target.parentElement.parentElement.children[1];
         var newInput = document.createElement('input');
         newInput.setAttribute('type', 'text');
         newInput.value =  element.textContent;
         element.parentElement.insertBefore(newInput, element.parentElement.children[1]);
         element.remove();
    }
    
}
function todo_edit_close(e){   //after editing input, click on window to save new value
    if(e.target.nodeName== 'I' || e.target.nodeName== 'INPUT'){
        return 0;
    }else{
        var active_input=document.querySelector('.todo-list input');
        var storage=getStorage('todo_list');

        for(let i=0;i<storage.length;i++){
            if(storage[i].id==active_input.parentElement.dataset.id){
                storage[i].value=active_input.value;
            }
        }
        localStorage.setItem('todo_list',JSON.stringify(storage));
        show_from_storage();
    }
}
function todo_tick(e){
    var storage_todo=getStorage('todo_list');
    var storage_finished=getStorage('finished_list');
    // console.log(e.target.parentElement.children[1].textContent);
    if(e.target.id=='tick'){
        var target_id=e.target.parentElement.dataset.id;
        var obg={id:target_id,value:e.target.parentElement.children[1].textContent};
        storage_finished.push(obg);
        localStorage.setItem('finished_list',JSON.stringify(storage_finished)); 

        for(let i=0;i<storage_todo.length;i++){
            if(storage_todo[i].id==target_id){
                storage_todo.splice(i, 1);
                localStorage.setItem('todo_list',JSON.stringify(storage_todo)); 
                break;
            }
        }
        show_from_storage();
    }
}
function finished_tick(e){
    var storage_finished=getStorage('finished_list');
    var storage_todo=getStorage('todo_list');
    // console.log(e.target.parentElement.children[1].textContent);
    if(e.target.id=='tick'){
        var target_id=e.target.parentElement.dataset.id;
        var obg={id:target_id,value:e.target.parentElement.children[1].textContent};
        storage_todo.push(obg);
        localStorage.setItem('todo_list',JSON.stringify(storage_todo)); 

        for(let i=0;i<storage_finished.length;i++){
            if(storage_finished[i].id==target_id){
                storage_finished.splice(i, 1);
                localStorage.setItem('finished_list',JSON.stringify(storage_finished)); 
                break;
            }
        }
        show_from_storage();
    }
}

function add_to_todoList(e){
    // e.preventDefault();
    add_li('todo_list',form.children[0].value,(new Date()).getTime());
}
