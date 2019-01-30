import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthService {
    host = "http://54.188.202.254:3000";
    // host = "http://13.233.133.189:3000";
    constructor(private http: Http, private storage: Storage) { }
    mode: string;
    emp_dets;
    setAuth(mode, emp_dets) {
        this.mode = mode;
        this.emp_dets = emp_dets;
        this.storage.set('mode', mode);
        this.storage.set('emp_dets', emp_dets).then(data => {
            this.mode = mode;
            this.emp_dets = emp_dets;
        }
        );
    }
    getAuth() {
        this.storage.get('mode').then(data => {
            if (data && data.length > 0) {
                return true;
            } else {
                return false;
            }
        }).catch(err => { console.error(err); return false });
    }

    authenticateAdmin(obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/auth_admin', obj, { headers: header }).pipe(map(res => res.json()));
    }

    authenticateStaff(obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/auth_staff', obj, { headers: header }).pipe(map(res => res.json()));
    }

    // Add Area
    addArea(area) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/add-area', area, { headers: header }).pipe(map(res => res.json()));
    }
    // Get all areas
    getAreas() {
        return this.http.get(this.host + '/users/get-areas').pipe(map(res => res.json()));
    }
    // Edit area
    editArea(area) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/edit-area', area, { headers: header }).pipe(map(res => res.json()));
    }

    // Delete Area
    deleteArea(id) {
        return this.http.get(this.host + '/users/delete-area/' + id).pipe(map(res => res.json()));
    }
    // Add tasks
    addTaskToArea(task_obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/add-task-to-area', task_obj, { headers: header }).pipe(map(res => res.json()));
    }
    // Get tasks of area
    getTasksOfArea(area_id) {
        return this.http.get(this.host + '/users/get-tasks-of-areas/' + area_id).pipe(map(res => res.json()));
    }

    // Edit task
    editTask(task_obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/edit-task', task_obj, { headers: header }).pipe(map(res => res.json()));
    }
    // Delete Task
    deleteTask(task_id) {
        return this.http.get(this.host + '/users/delete-task/' + task_id).pipe(map(res => res.json()));
    }

    // Add child
    addChild(child_obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/add-child', child_obj, { headers: header }).pipe(map(res => res.json()));
    }
    // Get children
    getChildren() {
        return this.http.get(this.host + '/users/get-children').pipe(map(res => res.json()));
    }
    // Get child by id
    getChild(id) {
        return this.http.get(this.host + '/users/get-child/+' + id).pipe(map(res => res.json()));
    }
    // Get child by id
    updateChild(child_obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/update-child', child_obj, { headers: header }).pipe(map(res => res.json()));
    }
    // Add task to child
    addTaskToChild(obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/add-task-to-child', obj, { headers: header }).pipe(map(res => res.json()));
    }
    removeTaskToChild(obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/remove-task-to-child', obj, { headers: header }).pipe(map(res => res.json()));
    }
    // Get child's tasks
    getChildTasks(child_id) {
        return this.http.get(this.host + '/users/get-child-tasks/' + child_id).pipe(map(res => res.json()));
    }
    // Get child's tasks
    getRawChildTasks(child_id) {
        return this.http.get(this.host + '/users/get-raw-child-tasks/' + child_id).pipe(map(res => res.json()));
    }

    // Get tasks from id
    getTasksFromId(task_id) {
        return this.http.get(this.host + '/users/get-task-by-id/' + task_id).pipe(map(res => res.json()));
    }

    // Update child task
    updateChildTask(obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/update-child-task', obj, { headers: header }).pipe(map(res => res.json()));
    }

    // Get area from id
    getAreaFromId(area_id) {
        return this.http.get(this.host + '/users/get-area-by-id/' + area_id).pipe(map(res => res.json()));
    }

    // Add employee
    addEmployee(emp) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/add-emp', emp, { headers: header }).pipe(map(res => res.json()));
    }
    // Get employees
    getEmployees() {
        return this.http.get(this.host + '/users/get-emps/').pipe(map(res => res.json()));
    }

    // Edit employee
    updateEmployee(emp) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/edit-emp', emp, { headers: header }).pipe(map(res => res.json()));
    }

    // de-register child
    deRegisterEmployee(id) {
        return this.http.get(this.host + '/users/deregister-emp/' + id).pipe(map(res => res.json()));
    }

    // Get employee less children
    getUnEmpChildren() {
        return this.http.get(this.host + '/users/get-un-emp-children/').pipe(map(res => res.json()));
    }

    // Add staff to child
    addStaffToChild(obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/assign-staff-to-child', obj, { headers: header }).pipe(map(res => res.json()));
    }
    // get emp children
    getEmpChildren(emp_id) {
        return this.http.get(this.host + '/users/get-emp-children/' + emp_id).pipe(map(res => res.json()));
    }

    // de-register child
    deRegisterChild(id) {
        return this.http.get(this.host + '/users/deregister-child/' + id).pipe(map(res => res.json()));
    }

    // Edit Child task
    editChildTask(obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/edit-child-task', obj, { headers: header }).pipe(map(res => res.json()));
    }

    checkAdminPwd(obj) {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http.post(this.host + '/users/change-admin-pwd', obj, { headers: header }).pipe(map(res => res.json()));
    }
}
