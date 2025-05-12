

export class DOM {
  constructor() {
    this.projCont = this.query('#projects-container');
    this.todosCont = this.query('#todos-container');
    this.projCont.append(this.createProjWindow());
    this.addTodoBtn = this.query('#add-todos-btn');
    this.addProjBtn = this.query('#add-proj-btn');
    this.projectTitleWind = this.query('#proj-title-window');
    this.todosCont.append(this.createTodoWindow());
    this.form = this.query('#form');
    this.confirmProjBtn = this.query('#proj-confirm-btn');
    this.cancelProjBtn = this.query('#proj-cancel-btn');
    this.confirmTodoBtn = this.query('#todo-confirm-btn')
    this.cancelTodoBtn = this.query('#todo-cancel-btn');
    this.projTitle = this.query('.proj-title-input');
    this.todoTitle = this.query('#todo-title');
    this.todoDuedate = this.query('#duedate');
    this.todoPriority = this.query('#priority');
    this.todoDescription = this.query('#todo-description');
    this.detailsWindow = this.query('#form')
  }
  query(elem) {
    return document.querySelector(elem);
  }

  appendHTML(parent, ...child) {
    return parent.append(...child);
  }
  createProjWindow() {
    const projWindow = this.query('#proj-window');
    return document.importNode(projWindow.content, true);

  }
  createTodoWindow() {
    const todoWindow = this.query('#todo-window');
    return document.importNode(todoWindow.content, true);
  }

  createProjLayout(proj) {
    const projTemplate = this.query('#proj-div-templ');
    const projElem = document.importNode(projTemplate.content, true);
    const span = projElem.querySelector('.proj-div-span');
    span.textContent = proj.title;
    const projDiv = projElem.querySelector('.project-div');
    projDiv.setAttribute('id', `${proj.id}`);
    return projElem;
  }
  createTodoLayout(arr, todo, curId) {
    const todoTempl = this.query('#todo-div-templ');
    const todoElem = document.importNode(todoTempl.content, true);
    const todoDiv = todoElem.querySelector('.todo-div');
    todoDiv.setAttribute('id', `${todo.id}`)
    const checkbox = todoElem.querySelector('.todo-checkbox');
    const title = todoElem.querySelector('.todo-title');
    title.textContent = todo.title;
    const duedate = todoElem.querySelector('.todo-duedate')
    duedate.textContent = todo.duedate;
    checkbox.checked = todo.completed;
    const removeBtn = todoElem.querySelector('.todo-remove-btn');
    removeBtn.classList.add('disabled');
    const detailsBtn = todoElem.querySelector('.todo-details-btn')
    const completed = todoElem.querySelector('.todo-completed');
    completed.textContent = checkbox.checked ? 'Completed' : 'Not completed'
    if (checkbox.checked) {
      todoDiv.classList.add('completed');
      removeBtn.classList.remove('disabled');
    }
    checkbox.addEventListener('change', (e) => {
      const projIndex = arr.findIndex((proj) => proj.id === curId);
      const todoIndex = arr[projIndex].todos.findIndex((todo) => todo.id === e.currentTarget.parentElement.id)
      if (checkbox.checked) {
        checkbox.parentElement.children[5].classList.remove('disabled')
        todo.completed = true;
        checkbox.parentElement.classList.add('completed');
        completed.textContent = "Completed"
      }
      else {
        checkbox.parentElement.classList.remove('completed');
        todo.completed = false;
        checkbox.parentElement.children[5].classList.add('disabled')
        completed.textContent = "Not completed"
      }

      localStorage.setItem('data', JSON.stringify(arr))
    })
    removeBtn.addEventListener('click', (e) => {
      const projIndex = arr.findIndex((proj) => proj.id === curId);
      arr[projIndex].todos = arr[projIndex].todos.filter((item) => item.id !== e.currentTarget.parentElement.id);
      localStorage.setItem('data', JSON.stringify(arr))
      e.currentTarget.parentElement.remove();
    })
    const dialog = document.getElementById('details-dialog');
    const closeDialog = dialog.querySelector('.close-btn')
    detailsBtn.addEventListener('click', (e) => {

      dialog.querySelector('.details-title').textContent = todo.title;
      dialog.querySelector('.details-duedate').textContent = todo.duedate;
      dialog.querySelector('.details-priority').textContent = todo.priority;
      dialog.querySelector('.details-description').textContent = todo.description;
      dialog.showModal()
    })
    closeDialog.addEventListener('click', () => {
      dialog.close()

    })

    return todoElem;
  }

}





