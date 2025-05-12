import { DOM } from "./DOM";

export class locStorage {

  setItem(arr) {
    return localStorage.setItem('data', JSON.stringify(arr))
  }
  getItem() {
    const data = localStorage.getItem('data');
    return data ? JSON.parse(data) : [];
  }

}
class Project {
  constructor(proj) {
    this.title = proj ? proj.trim() : 'No value'
    this.todos = [];
    this.id = this.title ? `${this.title.split(' ').join('-')}-${Date.now()}` : 'No value'
  }
}
class Todo {
  constructor(title, duedate, priority, description, completed = false) {
    this.title = title ? title.trim() : 'Empty value'
    this.id = this.title ? `${this.title.split(' ').join('-')}-${Date.now()}` : Date.now()
    this.duedate = duedate
    this.completed = completed,
      this.priority = priority,
      this.description = description.trim()
  }

}
export class todoApp {
  constructor() {
    this.DOM = new DOM();
    this.locStorage = new locStorage();
    this.dataArr = this.locStorage.getItem() || [];
    this.currProj;
    this.bindButtons();
    this.render();

  }
  setCurId(id) {
    this.currProj = id
  }
  getCurId() {
    return this.currProj;
  }


  addProject() {
    const { projTitle } = this.DOM
    this.dataArr.push(new Project(projTitle.value.trim()))
    this.locStorage.setItem(this.dataArr);
    projTitle.value = '';
    this.render();
  }
  removeProj(id) {
    this.dataArr = this.dataArr.filter((item) => item.id !== id);
    this.locStorage.setItem(this.dataArr);
    this.resetTodo();
    this.render();

  }
  addTodo(id) {
    const { todoTitle, todoDuedate, todoPriority, todoDescription, projCont } = this.DOM;
    const index = this.dataArr.findIndex(item => item.id === id);
    if (index !== -1) {
      this.dataArr[index].todos.push(new Todo(todoTitle.value, todoDuedate.value, todoPriority.value, todoDescription.value));
    }
    this.locStorage.setItem(this.dataArr);
    this.render();
    this.clearTodoForm();
    const childIndex = Array.from(projCont.children).findIndex((child) => child.id === id);
    projCont.children[childIndex].click();

  }
  clearTodoForm() {
    const { todoTitle, todoDuedate, todoPriority, todoDescription } = this.DOM;
    todoTitle.value = '';
    todoDuedate.value = '';
    todoPriority.value = '';
    todoDescription.value = '';

  }

  bindButtons() {
    const { addProjBtn, confirmProjBtn, cancelProjBtn, addTodoBtn, confirmTodoBtn, cancelTodoBtn, projectTitleWind, form, todosCont } = this.DOM;
    addProjBtn.addEventListener('click', () => {
      projectTitleWind.classList.toggle('hidden');
      addProjBtn.classList.toggle('hidden');
    })
    addTodoBtn.addEventListener('click', () => {
      form.classList.toggle('hidden');
      addTodoBtn.classList.toggle('hidden');
      this.clearTodoForm();
    })
    confirmProjBtn.addEventListener('click', () => {
      projectTitleWind.classList.toggle('hidden');
      addProjBtn.classList.toggle('hidden');
      this.addProject()


    })
    cancelProjBtn.addEventListener('click', () => {
      projectTitleWind.classList.toggle('hidden');
      addProjBtn.classList.toggle('hidden');

    })
    confirmTodoBtn.addEventListener('click', () => {
      form.classList.toggle('hidden');
      addTodoBtn.classList.toggle('hidden');
      this.addTodo(this.getCurId());
    })
    cancelTodoBtn.addEventListener('click', () => {
      form.classList.toggle('hidden');
      addTodoBtn.classList.toggle('hidden');
    })


  }
  render() {
    this.createHTML();
  }
  resetTodo() {
    const { todosCont, addTodoBtn, form } = this.DOM
    while (todosCont.firstElementChild) {
      if (todosCont.firstElementChild !== addTodoBtn && todosCont.firstElementChild !== form) {
        todosCont.firstElementChild.remove();
      } else {
        break;
      }
    }
  }
  createHTML() {
    const { projCont, todosCont, addProjBtn, projectTitleWind, addTodoBtn, form } = this.DOM;
    while (projCont.firstElementChild) {
      if (projCont.firstElementChild !== addProjBtn && projCont.firstElementChild !== projectTitleWind) {
        projCont.firstElementChild.remove();
      } else {
        break;
      }
    }
    if (this.dataArr.length === 0 || !form.classList.contains('hidden')) {
      addTodoBtn.classList.add('hidden');
    } else {
      addTodoBtn.classList.remove('hidden');
    }
    this.dataArr.forEach((proj) => {
      const newProj = this.DOM.createProjLayout(proj);
      projCont.insertBefore(newProj, projCont.firstElementChild);
      const projDiv = projCont.querySelector('.project-div');
      projDiv.addEventListener('click', (e) => {
        Array.from(projCont.children).forEach((div) => {
          if (div.classList.contains('project-div')) {
            div.style.border = 'none'
          }
          e.currentTarget.style.border = '5px solid white';
          this.setCurId(e.currentTarget.id);
        })
        this.resetTodo();

        const index = this.dataArr.findIndex((item) => item.id === this.getCurId());
        this.dataArr[index].todos.forEach((todo) => {
          const newTodo = this.DOM.createTodoLayout(this.dataArr, todo, this.getCurId());
          todosCont.insertBefore(newTodo, todosCont.firstElementChild);
        })
      })
      projDiv.children[1].addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeProj(this.getCurId());
      })
      if (projCont.firstElementChild && projCont.firstElementChild.classList.contains('project-div')) {
        projCont.firstElementChild.click();
      }
    })
  }

}

















