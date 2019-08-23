const express = require('express');
const router = express.Router();
const admin = require('../models/admin');
const Staff = require('../models/staff');
const Area = require('../models/area');
const Task = require('../models/task');
const Child = require('../models/child');
const ChildTasks = require('../models/child_tasks');
const moment = require('moment');
const deChild = require('../models/de-child');
const DeStaff = require('../models/de-staff')
const Dummy = require('../models/dummy');
var async = require("async");
const ImageThumbnail = require('image-thumbnail');
const Counter = require('../models/counter');
const MasterData= require('./masterData');


router.post('/update-child-task', (req, res, next) => {
    task_id = req.body.task_id;
    status = req.body.status;
    child_id = req.body.child_id;
    area_id = req.body.area_id;
    task_name = req.body.task_name;
    ChildTasks.update({
        child_id: child_id
    }, {
        "$pull": {
            "tasks": {
                task_id: task_id
            }
        }
    }, (err, done) => {
        if (done) {
            ChildTasks.update({
                child_id: child_id
            }, {
                "$push": {
                    "tasks": {
                        task_id: task_id,
                        task_name: task_name,
                        area_id: area_id,
                        status: status,
                        added_time: moment.now()
                    }
                }
            }, (err, added) => {
                if (added) {
                    res.json({
                        success: true,
                        msg: added
                    });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
            });
        } else {
            res.json({
                success: false,
                msg: err
            });
        }
    })
});

// authenticate admin
router.post("/auth_admin", (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let branchCode=req.headers.branchcode;
    let query={
      email: email,
      password: password
    }
    if(branchCode == "undeined"){
      res.json({
        success: false,
        msg: 'No Branch Code found'
      });
    }else if(branchCode != 'All'){
      query={
        email: email,
        password: password,
        branchCode:branchCode}
    }
    admin.find(query, (err, found) => {
        if (found.length > 0) {
            res.json({
                success: true,
                msg: found
            });
        } else {
            res.json({
                success: false,
                msg: 'No admin found'
            });
        }
    })

});

// authenticate admin
router.post("/auth_staff", (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let branchCode=req.headers.branchcode;
    let query={
      email: email,
      password: password
    }
    if(branchCode == "undeined"){
      res.json({
        success: false,
        msg: 'No Branch Code found'
      });
    }else{
      query={
        email: email,
        password: password,
        branchCode:branchCode}
    }
    Staff.find(query, (err, found) => {
        if (found.length > 0) {
            res.json({
                success: true,
                msg: found
            });
        } else {
            res.json({
                success: false,
                msg: 'No admin found'
            });
        }
    })

});

// Add staff
router.post('/add-emp', (req, res, next) => {
    name = req.body.name;
    mobile = req.body.mobile;
    email = req.body.email;
    password = req.body.password;
    number = req.body.number;
    branchCode= req.headers.branchcode;
    imageData= req.body.image;
    const emp = new Staff({
        email: email,
        mobile: mobile,
        password: password,
        name: name,
        number: number,
        image:imageData,
        branchCode:branchCode
    });
    Counter.findByIdAndUpdate(
        {_id: 'STAFF'},
        {$inc:{sequence_value:1}},
        function (er, data) {
          if(data){
            emp.number=data.sequence_value;
            emp.save((err, saved) => {
                if (saved) {
                    res.json({
                        success: true,
                        msg: saved
                    });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
            });
          }else{
            res.json({
                success: false,
                msg: er
            });
          }
        });
    });

// Edit staff
router.post('/edit-emp', (req, res, next) => {
    id = req.body.id;
    name = req.body.name;
    mobile = req.body.mobile;
    email = req.body.email;
    password = req.body.password;
    number = req.body.number;
    branchCode = req.headers.branchcode;
    Staff.findById({
        _id: req.body.id,
        branchCode: req.headers.branchcode
      }, (er, found) => {
        if(found){
          found.name=name;
          found.mobile=mobile;
          found.email=email;
          found.password=password;
          found.number=number;
          found.branchCode=branchCode;
          updateEmployee(id,branchCode,found,res,next);
        }else{
          res.json({
              success: false,
              msg: er
          });
        }
      });
});

// Get employee
router.get('/get-emps', (req, res, next) => {

        Staff.find({branchCode:req.headers.branchcode},null,{sort:{name:1}}, (err , staff) => {
                if (staff) {
                  var staffs;
                  staff.forEach(st =>{
                    st.image="";
                  })
                    res.json({
                        success: true,
                        msg: staff.sort(function(a,b){
                          return a.name.trim().toUpperCase().localeCompare(b.name.trim().toUpperCase())
                        })
                    });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
            }
        )
});

//get childrena and staff count
router.get('/get-counts', (req, res, next) => {
        Staff.countDocuments({branchCode:req.headers.branchcode}, (err , staff) => {
                if (staff!= undefined) {
                  Child.countDocuments({branchCode:req.headers.branchcode},(error,child)=>{
                    if(child!=undefined){
                      res.json({
                        success:true,
                        staffcount:staff,
                        childcount:child
                      });
                    }else{
                      res.json({
                        success: false,
                        msg: error
                      });
                    }
                  });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
      });
});

//get employee Thumbnail Images
router.get('/get-emp-thumbnail/:id', (req, res, next) => {
  Staff.findById({
      _id: req.params.id,
      branchCode: req.headers.branchcode
    }, (er, found) =>{
      if(found){
        if(found.image!= undefined && found.image!= ''){
        let options = { percentage: 25, responseType: 'base64',width :100,height:100 }
        found.image=found.image.replace("data:image/jpeg;base64,", "");
         ImageThumbnail(found.image, options)
          .then(thumbnail => { res.send('data:image/jpeg;base64,'+thumbnail) })
          .catch(err => {
            res.json({
              success:false,
              msg:err
            })
          });
        }else{
          let options = { percentage: 25, responseType: 'base64',width :100,height:100 }
          ImageThumbnail(defaultImage.replace("data:image/jpeg;base64,", ""), options)
           .then(thumbnail => { res.send('data:image/jpeg;base64,'+thumbnail) })
           .catch(err => {
             res.json({
               success:false,
               msg:err
             })
           });
        }
      }else if(er){
        res.json({
          success:false,
          msg:er
        })
      }
    })
});

//get child Thumbnail Images
router.get('/get-child-thumbnail/:id', (req, res, next) => {
  Child.findById({
      _id: req.params.id,
      branchCode: req.headers.branchcode
    }, (er, found) =>{
      if(found){
        if(found.image!= undefined && found.image!= ''){
        let options = { percentage: 25, responseType: 'base64',width :100,height:100 }
        found.image=found.image.replace("data:image/jpeg;base64,", "");
         ImageThumbnail(found.image, options)
          .then(thumbnail => { res.send('data:image/jpeg;base64,'+thumbnail) })
          .catch(err => {
            res.json({
              success:false,
              msg:err
            })
          });
        }else{
          let options = { percentage: 25, responseType: 'base64',width :100,height:100 }
          ImageThumbnail(defaultImage.replace("data:image/jpeg;base64,", ""), options)
           .then(thumbnail => { res.send('data:image/jpeg;base64,'+thumbnail) })
           .catch(err => {
             res.json({
               success:false,
               msg:err
             })
           });
        }
      }else if(er){
        res.json({
          success:false,
          msg:er
        })
      }
    })
});

//get actual image 

//get childrena and staff count
router.post('/update-emp-image/:id', (req, res, next) => {
  id = req.params.id;
  branchCode = req.headers.branchcode;
  Staff.findById({
      _id: req.params.id,
      branchCode: req.headers.branchcode
    }, (er, found) => {
      if(found){
          found.image=req.body.image;
          updateEmployee(id,branchCode,found ,res,next)
      }else{
        res.json({
          success:false,
          msg: er
        })
      }
    })
})

function updateEmployee(id,branchCode,found,res,next){
  Staff.findOneAndUpdate({
      _id: id,
      branchCode:branchCode
  },found,(err,result)=>{
    if(result){
      result.image="";
      res.json({
        success:true,
        msg:result
      })
    }else{
      res.json({
        success:false,
        msg:err
      })
    }
  })
}

// deregister staff
router.get('/deregister-emp/:id', (req, res, next) => {
    Staff.findById({
        _id: req.params.id,
		branchCode: req.headers.branchcode
    }, (er, found) => {
        if (found) {
            const c = new DeStaff({
                name: found.name,
                mobile: found.mobile,
                email: found.email,
                password: found.password,
                number: found.number,
                de_time: moment.now(),
				branchCode:found.branchCode

            });
            found.remove();
            c.save((err, saved) => {
                if (saved) {
                    Child.updateMany({
                        staff: req.params.id
                    }, {
                        staff: null
                    }, (err, saved) => {
                        if (saved) {
                            res.json({
                                success: true,
                                msg: saved
                            });
                        } else {
                            res.json({
                                success: false,
                                msg: er
                            });
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
            })
        } else {
            res.json({
                success: false,
                msg: er
            });
        }
    })
});


router.get('/get-un-emp-children', (req, res, next) => {

    Child.find({
        staff: null,
		branchCode:req.headers.branchcode
    },{},{sort:{first_name:1,last_name:1}}, (er, children) => {
        if (children) {
            res.json({
                success: true,
                msg: children
            });
        } else {
            res.json({
                success: false,
                msg: er
            });
        }
    })
});

router.post('/assign-staff-to-child', (req, res, next) => {
    child_id = req.body.c_id;
    emp_id = req.body.e_id;
    Child.findByIdAndUpdate({
        _id: child_id,
		branchCode:req.headers.branchcode
    }, {
        staff: emp_id
    }, (err, saved) => {
        if (saved) {
            res.json({
                success: true,
                msg: saved
            });
        } else {
            res.json({
                success: false,
                msg: er
            });
        }
    });
});

router.post('/deassgin-staff-for-child',(req,res,next) =>{
  child_id=req.body.c_id;
  Child.findByIdAndUpdate({
      _id: child_id,
	branchCode:req.headers.branchcode
  }, {
      staff: null
  }, (err, saved) => {
      if (saved) {
          res.json({
              success: true,
              msg: saved
          });
      } else {
          res.json({
              success: false,
              msg: er
          });
      }
  });
})

// Get children of employee
router.get('/get-emp-children/:emp_id', (req, res, next) => {
    id = req.params.emp_id;
    Child.find({
        staff: id,
		branchCode:req.headers.branchcode
    },{},{sort:{first_name:1,last_name:1}}, (err, child) => {
        if (child) {
            res.json({
                success: true,
                msg: child
            });
        } else {
            res.json({
                success: false,
                msg: er
            });
        }
    })
});

// deregister child
router.get('/deregister-child/:id', (req, res, next) => {
    Child.findById({
        _id: req.params.id,
		branchCode:req.headers.branchcode
    }, (er, found) => {
        if (found) {
            const c = new deChild({
                first_name: found.first_name,
                last_name: found.last_name,
                age: found.age,
                parent_name: found.parent_name,
                parent_mobile: found.parent_mobile,
                added_time: found.added_time,
                staff: found.staff,
				branchCode:req.headers.branchcode,
                de_time: moment.now()
            });
            found.remove();
            c.save((err, saved) => {
                if (saved) {
                    res.json({
                        success: true,
                        msg: saved
                    });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
            })
        } else {
            res.json({
                success: false,
                msg: er
            });
        }
    })
});

// Authenticate staff
router.post('/authenticate-staff', (req, res, next) => {
    res.json({
        success: true,
        msg: {
            email: req.body.email,
            password: req.body.password
        }
    });
});

// Add area
router.post('/add-area', (req, res, next) => {
    area_name = req.body.area_name;
    added_time = moment.now();
    const area = new Area({
        name: area_name,
        added_time: added_time
    });
    area.save((err, area) => {
        if (err) {
            res.json({
                success: false,
                msg: err
            });
        } else {
            res.json({
                success: true,
                msg: area
            });
        }
    });
});

// Edit area

router.post('/edit-area', (req, res, next) => {
    Area.findByIdAndUpdate({
        _id: req.body.id
    }, {
        name: req.body.name
    }, (err, status) => {
        if (err) {
            res.json({
                success: false,
                msg: err
            });
        } else {
            if (status) {
                res.json({
                    success: true,
                    msg: status
                });
            } else {
                res.json({
                    success: false,
                    msg: 'Something went wrong'
                });
            }
        }
    });
});

// Get all areas
router.get('/get-areas', (req, res, next) => {
    Area.find({},null,{sort:{number:1}},(err, areas) => {
        if (err) {
            res.json({
                success: false,
                msg: err
            });
        } else {
          console.log(areas)
            if (areas.length > 0) {
                res.json({
                    success: true,
                    msg: areas
                });
            } else {
                res.json({
                    success: false,
                    msg: 'No areas found'
                });
            }
        }
    });
});


// Delete area
router.get('/delete-area/:id', (req, res, next) => {
    Area.findByIdAndRemove({
        _id: req.params.id
    }, (err, stat) => {
        if (stat) {
            res.json({
                success: true,
                msg: stat
            });
        } else {
            res.json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });
});


// Add task in area
router.post('/add-task-to-area', (req, res, next) => {
    // res.json({ success: false, msg: moment.now() });
    const task_name = req.body.name;
    const area_id = req.body.area_id;
    const m = moment.now();
    const task = new Task({
        name: task_name,
        area_id: area_id,
        added_time: moment
    });
    task.save((err, t) => {
        if (t) {
            res.json({
                success: true,
                msg: t
            });
        } else {
            res.json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });

});


// Get all tasks in category
router.get('/get-tasks-of-areas/:area_id', (req, res, next) => {
    area_id = req.params.area_id;
    Task.find({
        area_id: area_id
    },null,{sort:{number:1}}, (err, tasks) => {
        if (tasks.length > 0) {
            res.json({
                success: true,
                msg: tasks
            });
        } else {
            res.json({
                success: false,
                msg: 'No tasks found'
            });
        }
    })
});

// Edit task
router.post('/edit-task', (req, res, next) => {
    const task_id = req.body.task_id;
    const name = req.body.new_name;

    Task.findByIdAndUpdate({
        _id: task_id
    }, {
        name: name
    }, (err, task) => {
        if (task) {
            res.json({
                success: true,
                msg: task
            });
        } else {
            res.json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });
});

router.get('/delete-task/:id', (req, res, next) => {
    id = req.params.id;
    Task.findByIdAndRemove({
        _id: id
    }, (err, status) => {
        if (status) {
            res.json({
                success: true,
                msg: status
            });
        } else {
            res.json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });
});

router.post('/add-child', (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const parent_name = req.body.parent_name;
    const parent_mobile = req.body.parent_mobile;
    const age = req.body.age;
    const number = req.body.number;

    const time_slot = req.body.time_slot;
    const child = new Child({
        number: number,
        first_name: first_name,
        last_name: last_name,
        age: age,
        parent_name: parent_name,
        parent_mobile: parent_mobile,
        time_slot: time_slot,
		branchCode:req.headers.branchcode

    });
    child.save((err, saved) => {
        if (saved) {
            res.json({
                success: true,
                msg: saved
            });
        } else {
            res.json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });
});

// Get all children
router.get('/get-children', (req, res, next) => {
     Child.find({branchCode:req.headers.branchcode},null,{sort:{first_name:1,last_name:1}},(err, children) => {
        if (children) {
            res.json({
                success: true,
                msg: children.sort(function(a,b){
                   return a.first_name.trim().toUpperCase().localeCompare(b.first_name.trim().toUpperCase())
                })


            });







        } else {
            res.json({
                success: false,
                msg: err
            });
        }
    });
});

// Get child by id
router.get('/get-child/:id', (req, res, next) => {
    child_id = req.params.id;
    Child.findById({
        _id: child_id,
		branchCode:req.headers.branchcode
    }, (er, child) => {
        if (child) {
          if(child.staff!=null){
            Staff.findById({_id:child.staff},(err,staff)=>{
              if(staff){
                const obj={
                  _id:child._id,
                  first_name:child.first_name,
                  last_name:child.last_name,
                  age:child.age,
                  parent_name:child.parent_name,
                  parent_mobile:child.parent_mobile,
                  time_slot:child.time_slot,
                  staff:staff,
				  branchCode:req.headers.branchcode
                }
                res.json({
                    success: true,
                    msg: obj
                });
              }else{
                res.json({
                    success: false,
                    msg: 'Something went wrong'
                });
              }
            })
          }else{
            res.json({
                success: true,
                msg: child
            });
          }
        } else {
            res.json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });
});

// Update child
router.post('/update-child', (req, res, next) => {
    const id = req.body.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const age = req.body.age;
    const parent_name = req.body.parent_name;
    const parent_mobile = req.body.parent_mobile;
    const time_slot = req.body.time_slot;


    Child.findByIdAndUpdate({
        _id: id,
		branchCode:req.headers.branchcode
    }, {
        first_name: first_name,
        last_name: last_name,
        age: age,
        parent_name: parent_name,
        parent_mobile: parent_mobile,
        time_slot: time_slot,
		branchCode:req.headers.branchcode

    }, {
        new: true
    }, (err, child) => {
        if (child) {
            res.json({
                success: true,
                msg: child
            });
        } else {
            res.json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });
});

// Add task to child
router.post('/add-task-to-child', (req, res, next) => {
    task_id = req.body.task_id;
    child_id = req.body.child_id;
    area_id = req.body.area_id;
    Task.findById({
        _id: task_id
    }, (er, found) => {
        if (found) {
            task_name = found.name;
            options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            };

            ChildTasks.update({
                child_id: child_id
            }, {
                "$push": {
                    "tasks": {
                        task_id: task_id,
                        task_name: task_name,
                        area_id: area_id,
                        status: 'goal',
                        added_time: moment.now()
                    }
                }
            }, options, (err, found) => {
                if (found) {
                    res.json({
                        success: true,
                        msg: 'found'
                    });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
            })
        } else {
            res.json({
                success: false,
                msg: er
            });
        }
    });
});

// Remove task from child
router.post('/remove-task-to-child', (req, res, next) => {
    task_id = req.body.task_id;
    child_id = req.body.child_id;
    ChildTasks.update({
        child_id: child_id
    }, {
        "$pull": {
            "tasks": {
                task_id: task_id
            }
        }
    }, (err, rem) => {
        if (rem) {
            res.json({
                success: true,
                msg: rem
            });
        } else {
            res.json({
                success: false,
                msg: 'Something went wrong'
            });
        }
    });
});


router.get('/get-raw-child-tasks/:id', (req, res, next) => {
    const id = req.params.id;

    ChildTasks.find({
        child_id: id
    }, (err, t) => {
        console.log(t);
        if (!err && t) {
            res.json({
                success: true,
                msg: t
            });
        } else {
            res.json({
                success: false,
                msg: err
            });
        }
    });
});

router.get('/get-child-tasks/:id', (req, res, next) => {
    const id = req.params.id;

    let tasks_array = [];
    let areas = [];
    let final_array;

    async.waterfall([
        function (callback) {

            ChildTasks.find({
                child_id: id
            }, (err, tasks) => {
                if (!err && tasks) {
                    if (tasks.length > 0) {
                        callback(null, tasks[0].tasks)
                    } else {
                        callback(null, tasks[0])
                    }
                }
            });
        },
        function (tasks, callback) {
            let arr = [];
            if (tasks && tasks.length > 0) {
                async.forEach(tasks, function (t, callback) {
                    Task.findById({
                        _id: t.task_id
                    }, (err, tsk) => {
                        if (tsk) {
                            Area.findById({
                                _id: t.area_id
                            }, (e, area) => {
                                console.log(area);
                                if (area) {
                                    const obj = {
                                        area_name: area.name,
                                        task_number: tsk,
                                        task_name: t.task_name,
                                        task_id: t.task_id,
                                        area_id: area._id,
                                        area_number: area.number,
                                        status: t.status
                                    };
                                    arr.push(obj);
                                }
                                callback(null, arr);
                            });
                        }
                    });
                }, function (err) {
                    callback(null, arr)
                });
            } else {
                callback(null, null)
            }
            // res.json({ success: true, msg: tasks });
        },
        function (arr, callback) {
            if (arr !== null) {
                goals = [];
                acheived = [];
                async.forEach(arr, (item, callback) => {
                    if (item.status == 'goal') {
                        // push to goal
                        goals.push(item);
                    } else {
                        acheived.push(item);
                    }
                    callback(null, goals, acheived);
                }, function (err) {
                    callback(null, goals, acheived);
                });
            } else {
                callback(null, [], []);
            }
        },
        function (goals, done, callback) {
            res.json({
                success: true,
                msg: [ goals.sort(function(a,b) {
                    return a.task_number.number - b.task_number.number;
                }),
                done.sort(function(a,b) {
                    return a.task_number.number - b.task_number.number;
                })]
            });
        }
    ]);
});

router.get('/get-task-by-id/:id', (req, res, next) => {
    id = req.params.id;
    Task.findById({
        _id: id
    }, (err, t) => {
        if (t) {
            res.json({
                success: true,
                msg: t
            });
        } else {
            res.json({
                success: false,
                msg: err
            });
        }
    });
});

/*router.post('/update-child-task', (req, res, next) => {
    task_id = req.body.task_id;
    status = req.body.status;
    child_id = req.body.child_id;
    area_id = req.body.area_id;
    ChildTasks.update({
        child_id: child_id
    }, {
        "$pull": {
            "tasks": {
                task_id: task_id
            }
        }
    }, (err, done) => {
        if (done) {
            ChildTasks.update({
                child_id: child_id
            }, {
                "$push": {
                    "tasks": {
                        task_id: task_id,
                        task_name: task_name,
                        area_id: area_id,
                        status: status,
                        added_time: moment.now()
                    }
                }
            }, (err, added) => {
                if (added) {
                    res.json({
                        success: true,
                        msg: added
                    });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
            });
        } else {
            res.json({
                success: false,
                msg: err
            });
        }
    })
});*/


// Edit child task
router.post('/edit-child-task', (req, res, next) => {
    child_id = req.body.child_id;
    task_id = req.body.task_id;
    task_name = req.body.task_name;
    task_status = req.body.task_status;

    console.log(task_name);

    Task.findById({
        _id: task_id
    }, (t_err, t_found) => {
        if (t_found) {
            console.log(t_found.area_id);
            ChildTasks.update({
                child_id: child_id
            }, {
                "$pull": {
                    "tasks": {
                        task_id: task_id
                    }
                }
            }, (err, done) => {
                if (done) {
                    ChildTasks.update({
                        child_id: child_id
                    }, {
                        "$push": {
                            "tasks": {
                                task_id: task_id,
                                area_id: t_found.area_id,
                                task_name: task_name,
                                status: task_status,
                                added_time: moment.now()
                            }
                        }
                    }, (err, added) => {
                        if (added) {
                            res.json({
                                success: true,
                                msg: added
                            });
                        } else {
                            res.json({
                                success: false,
                                msg: err
                            });
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        msg: err
                    });
                }
            })
        }
    });
});


// Get area by id
router.get('/get-area-by-id/:id', (req, res, next) => {
    const id = req.params.id;
    Area.findById({
        _id: id
    }, (err, found) => {
        if (found) {
            res.json({
                success: true,
                msg: found
            });
        } else {
            res.json({
                success: false,
                msg: err
            });
        }
    });
});
// Test
router.get('/help', (req, res, next) => {
    res.json({
        success: 'awesome'
    });
});

router.post('/change-admin-pwd', (req, res) => {
    old = req.body.old;
    n = req.body.new;
    admin.find((er, ad) => {
        console.log(ad[0].password);

        if (ad[0].password === old) {
            // Update password
            admin.findOneAndUpdate({
                _id: ad[0]._id
            }, {
                password: n
            }, (uer, up) => {
                if (up) {
                    res.json({
                        success: true
                    });
                } else {
                    res.json({
                        success: false
                    });
                }
            });
        } else {
            res.json({
                success: false
            });
        }
    })
})
const defaultImage='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4Sg0RXhpZgAATU0AKgAAAAgADgALAAIAAAAmAAAIwgEOAAIAAAAuAAAI6AESAAMAAAABAAEAAAEaAAUAAAABAAAJFgEbAAUAAAABAAAJHgEoAAMAAAABAAIAAAExAAIAAAAmAAAJJgEyAAIAAAAUAAAJTAITAAMAAAABAAEAAIdpAAQAAAABAAAJYJybAAEAAABCAAAU1JyeAAEAAAGQAAAVFpyfAAEAAABaAAAWpuocAAcAAAgMAAAAtgAAFwAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFdpbmRvd3MgUGhvdG8gRWRpdG9yIDEwLjAuMTAwMTEuMTYzODQAVmVjdG9yIEZsYXQgU3R5bGUgQ2hhcmFjdGVyIEF2YXRhciBJY29uIE1hbGUAAAAAAEgAAAABAAAASAAAAAFXaW5kb3dzIFBob3RvIEVkaXRvciAxMC4wLjEwMDExLjE2Mzg0ADIwMTk6MDg6MjMgMTI6NTE6MTkAAAqQAwACAAAAFAAAEeqQBAACAAAAFAAAEf6ShgAHAAACwAAAEhKSkAACAAAABDc1NgCSkQACAAAAAzAwAACSkgACAAAAAzAwAACgAQADAAAAAQABAACgAgAEAAAAAQAAE4igAwAEAAAAAQAAE4jqHAAHAAAIDAAACd4AAAAAHOoAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDE5OjA4OjIzIDEyOjUwOjQ4ADIwMTk6MDg6MjMgMTI6NTA6NDgAQVNDSUkAAABTU1VDdjNINHNJQUFBQUFBQUVBSDJVeTY2Yk1CQ0c5NVg2RGhIcjBIQXo0QzY3Nks1cUY5MGRuY1ZnVDhDTndjZzJxYUtqdkh2TkpZbEJxQnZFelBCL25ndmpqOCtmRG9lZ0FpTlk4UFh3TVZyT0ZsSU94bXF3UW5YT0hSOFhQM0pobFJZZ25UTWFmZmNwRWhnTGRqQm9Sc1RpWW1DeGR0L096a1gvT09kdHRnK1B3QlIwQ2hjS2ZpTnJPaVZWZlF1T1h0UU0xUmo5SVF4REthRkROWmpnRWI4Zi93UDhOaGpSb1RHbjc2S0RqdUVlOWhlcVh1S0xONys4UCtxR0dqdDJleFV5Q3B2Qld0VEdLbmJ4SzNLaHVIaUMzcDluQldkbGxSU3cvVGJLMHVTTGUyYmwrTXpKbnBScmhOWlkwZUpXVGN0Vk5Tc2p6dE05V0NYcUtlbStjUWx0ZUVzYmZNclA2Zzh5YTNiVHdsNFpZU2VRMlpBU3VxS2syUjdnNnNocXQ0VWtXOG16Y2s5ZWErZ2J3YlM0b3Q3b0YvS0pOYUNCalhNNjllc1JleHlRME40MkFFNHFYaVNBSWFOUkZHWUZwMkdWMERUa0dKOHA0MldVeGVzS2N4Y21LUy9DcEN5VE1JdUlFMFFwRFhsU1VGNm1jWnhXZk85dzVtWnJYUVV0NkF2YWJSZnpsMlIrdVh0YnAxRWl6RnYzTmhPRHkxOVhhK3Z2NFZWd1ZKNE5BeGZLVzhtcllpQkhRZXFSZXkyWTZHcFBwbXd6TmZtNTN1NStVSzNuNkpTZE1sbit3WUM3L1IvTk9JMEp6VWxTRkhsQktDVkpGRHp1RERkMndmMWNCUjhWQlQwVFpLNTFycDk1bUVHSklZM2NKRGlXUUVtYzVHYytMdGo5SHliSW5nRzdCQUFBAAAAAEYAbABhAHQAIABTAHQAeQBsAGUAIABDAGgAYQByAGEAYwB0AGUAcgAgAEEAdgBhAHQAYQByACAASQBjAG8AbgAAAGkAYwBvAG4AOwAgAGEAdgBhAHQAYQByADsAIABhAHYAYQA7ACAAcwB5AG0AYgBvAGwAOwAgAGYAbABhAHQAOwAgAGMAaABhAHIAYQBjAHQAZQByADsAIABwAHIAbwBmAGkAbABlACAAaQBjAG8AbgA7ACAAZgBsAGEAdAAgAGQAZQBzAGkAZwBuADsAIABiAHUAcwBpAG4AZQBzAHMAIABwAGUAbwBwAGwAZQA7ACAAcABlAG8AcABsAGUAOwAgAHMAaQBnAG4AOwAgAGkAcwBvAGwAYQB0AGUAZAA7ACAAdgBlAGMAdABvAHIAOwAgAGYAYQBjAGUAOwAgAGMAYQBzAHUAYQBsADsAIABoAHUAbQBhAG4AOwAgAGEAZAB1AGwAdAA7ACAAcABvAHIAdAByAGEAaQB0ADsAIABwAGUAcgBzAG8AbgA7ACAAbQBvAGQAZQBsADsAIABzAGkAbQBwAGwAZQA7ACAAbQBhAG4AOwAgAG0AYQBsAGUAOwAgAHQALQBzAGgAaQByAHQAAABWAGUAYwB0AG8AcgAgAEYAbABhAHQAIABTAHQAeQBsAGUAIABDAGgAYQByAGEAYwB0AGUAcgAgAEEAdgBhAHQAYQByACAASQBjAG8AbgAgAE0AYQBsAGUAAAAABgEDAAMAAAABAAYAAAEaAAUAAAABAAAXTgEbAAUAAAABAAAXVgEoAAMAAAABAAIAAAIBAAQAAAABAAAXXgICAAQAAAABAAAQzQAAAAAAAABgAAAAAQAAAGAAAAAB/9j/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEAAP8DASEAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+igAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACk3D1FABuHqKWgAooAKKACigAooAKKACigAooAKKACigAooAKKACigApCQOtADDJ6Cm7ie9UkQ2JRVCCigBQxHenCQ9xUtDTHhgelLUlhRQAUUAFFABRQAUUAFFABRQAUUAFFABRQBGz+n50yrSIbuFFMQUjMqgliAB1JNIBsc0UwJikR8ddrA0+hNNXQNNOzCimAU5XI680mrgnYkBBGRS1BoFFABRQAUUAFFABRQAUUAFFABRQAhIAyaiZi1UkTJiUVRIVTutVsLLcLi7hRlGSpcbvy61nUqQprmm7IqEJTdoq5xeq+M7u5Zo7AfZ4em8jLt/h+H51zk081xIZJ5Xlc9WdiT+Zr5jF4ueIl5dj6HDYWNGPn3JotSv4IxHDe3EaDoqSsAPwBq3aeIdStpdzXty69wZM/+hAj9Kzp4qtBq0nZeZc8NSmneK1Oq0nxbbXDiK7m8pjwDKoHPuw4/QV04IYAggg8givpM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RX/xo+s1e4fVaXb8w/4RfRv+fP8A8iv/AI0f8Ivo3/Pn/wCRX/xo+s1e4fVaXb8w/wCEX0b/AJ8//Ir/AONH/CL6N/z5/wDkV/8AGj6zV7h9VpdvzD/hF9G/58//ACK/+NQw+DtBgeR47Da0hyx85zk/99e9H1mr3H9Wpdib/hF9G/58/wDyK/8AjR/wi+jf8+f/AJFf/Gj6zV7i+q0u35h/wi+jf8+f/kV/8au2WnWunRtHaReWrHJG4nn8TUyr1Jq0mXChTg7xRaorI1CigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigD/9kA/+E7LWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4NCgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6TWljcm9zb2Z0UGhvdG89Imh0dHA6Ly9ucy5taWNyb3NvZnQuY29tL3Bob3RvLzEuMC8iPg0KCQkJPGRjOmRlc2NyaXB0aW9uPg0KCQkJCTxyZGY6QWx0Pg0KCQkJCQk8cmRmOmxpIHhtbDpsYW5nPSJ4LXJlcGFpciI+VmVjdG9yIEZsYXQgU3R5bGUgQ2hhcmFjdGVyIEF2YXRhciBJY29uIE1hbGU8L3JkZjpsaT4NCgkJCQk8L3JkZjpBbHQ+DQoJCQk8L2RjOmRlc2NyaXB0aW9uPg0KCQkJPGRjOnRpdGxlPg0KCQkJCTxyZGY6QWx0Pg0KCQkJCQk8cmRmOmxpIHhtbDpsYW5nPSJ4LXJlcGFpciI+RmxhdCBTdHlsZSBDaGFyYWN0ZXIgQXZhdGFyIEljb248L3JkZjpsaT4NCgkJCQk8L3JkZjpBbHQ+DQoJCQk8L2RjOnRpdGxlPg0KCQkJPGRjOnN1YmplY3Q+DQoJCQkJPHJkZjpCYWc+DQoJCQkJCTxyZGY6bGk+aWNvbjwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPmF2YXRhcjwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPmF2YTwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPnN5bWJvbDwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPmZsYXQ8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5jaGFyYWN0ZXI8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5wcm9maWxlIGljb248L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5mbGF0IGRlc2lnbjwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPmJ1c2luZXNzIHBlb3BsZTwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPnBlb3BsZTwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPnNpZ248L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5pc29sYXRlZDwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPnZlY3RvcjwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPmZhY2U8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5jYXN1YWw8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5odW1hbjwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPmFkdWx0PC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+cG9ydHJhaXQ8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5wZXJzb248L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5tb2RlbDwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPnNpbXBsZTwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPm1hbjwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPm1hbGU8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT50LXNoaXJ0PC9yZGY6bGk+DQoJCQkJPC9yZGY6QmFnPg0KCQkJPC9kYzpzdWJqZWN0Pg0KCQkJPGRjOmNyZWF0b3I+DQoJCQkJPHJkZjpTZXE+DQoJCQkJCTxyZGY6bGk+VmVjdG9yU3RvY2suY29tLzE5MzY3NTExPC9yZGY6bGk+DQoJCQkJPC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPg0KCQkJPHBob3Rvc2hvcDpIZWFkbGluZT4NCgkJCQk8cmRmOkFsdD4NCgkJCQkJPHJkZjpsaT5GbGF0IFN0eWxlIENoYXJhY3RlciBBdmF0YXIgSWNvbjwvcmRmOmxpPg0KCQkJCTwvcmRmOkFsdD4NCgkJCTwvcGhvdG9zaG9wOkhlYWRsaW5lPg0KCQkJPE1pY3Jvc29mdFBob3RvOkxhc3RLZXl3b3JkWE1QPg0KCQkJCTxyZGY6QmFnPg0KCQkJCQk8cmRmOmxpPmljb248L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5hdmF0YXI8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5hdmE8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5zeW1ib2w8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5mbGF0PC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+Y2hhcmFjdGVyPC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+cHJvZmlsZSBpY29uPC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+ZmxhdCBkZXNpZ248L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5idXNpbmVzcyBwZW9wbGU8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5wZW9wbGU8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5zaWduPC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+aXNvbGF0ZWQ8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT52ZWN0b3I8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5mYWNlPC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+Y2FzdWFsPC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+aHVtYW48L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5hZHVsdDwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPnBvcnRyYWl0PC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+cGVyc29uPC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+bW9kZWw8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5zaW1wbGU8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5tYW48L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT5tYWxlPC9yZGY6bGk+DQoJCQkJCTxyZGY6bGk+dC1zaGlydDwvcmRmOmxpPg0KCQkJCTwvcmRmOkJhZz4NCgkJCTwvTWljcm9zb2Z0UGhvdG86TGFzdEtleXdvcmRYTVA+DQoJCTwvcmRmOkRlc2NyaXB0aW9uPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdG9yVG9vbD5XaW5kb3dzIFBob3RvIEVkaXRvciAxMC4wLjEwMDExLjE2Mzg0PC94bXA6Q3JlYXRvclRvb2w+PHhtcDpDcmVhdGVEYXRlPjIwMTktMDgtMjNUMTI6NTA6NDg8L3htcDpDcmVhdGVEYXRlPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj4NCjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/tAfBQaG90b3Nob3AgMy4wADhCSU0EBAAAAAABuBwBAAACAAQcAVoAAxslRxwCBQAgRmxhdCBTdHlsZSBDaGFyYWN0ZXIgQXZhdGFyIEljb24cAmkAIEZsYXQgU3R5bGUgQ2hhcmFjdGVyIEF2YXRhciBJY29uHAJ4ACxWZWN0b3IgRmxhdCBTdHlsZSBDaGFyYWN0ZXIgQXZhdGFyIEljb24gTWFsZRwCGQAEaWNvbhwCGQAGYXZhdGFyHAIZAANhdmEcAhkABnN5bWJvbBwCGQAEZmxhdBwCGQAJY2hhcmFjdGVyHAIZAAxwcm9maWxlIGljb24cAhkAC2ZsYXQgZGVzaWduHAIZAA9idXNpbmVzcyBwZW9wbGUcAhkABnBlb3BsZRwCGQAEc2lnbhwCGQAIaXNvbGF0ZWQcAhkABnZlY3RvchwCGQAEZmFjZRwCGQAGY2FzdWFsHAIZAAVodW1hbhwCGQAFYWR1bHQcAhkACHBvcnRyYWl0HAIZAAZwZXJzb24cAhkABW1vZGVsHAIZAAZzaW1wbGUcAhkAA21hbhwCGQAEbWFsZRwCGQAHdC1zaGlydBwCNwAIMjAxOTA4MjMcAjwACzEyNTA0OCswMDAwOEJJTQQlAAAAAAAQv6fXtD7bKEcQnqrgQJGBcv/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQFhARExQVFRUMDxcYFhQYEhQVFP/bAEMBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIA+QD4AMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1TooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAopMio2lRerAfjQBLRVdrtB0yfoKY14ey/marlZHPEt0mRVI3Mh7gfQU0zSH+M1XIyfaIv5FIWC1nnJ6sT+NJT9n5i9p5GgZFHcfnR5yf3l/Os+in7MXtPIv+Yn95fzpfOT+8v51n0UezD2j7Gh5i+o/OlDBqzqKPZ+Ye08jSyKMis4M394j8aUSuOjml7Nj9ojRoqiLmT1B+opwvD3X8jU8jK9pEuUVXW8RhzkfUVIsyN0YfnU2aKUk9iSikyKWkUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUU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rxD4H2xuPiZpZ7RLNL+UZH9a91+LwJ+GviDj/lgD/wCPrXkn7Odn5/jS+uSOLeyYZ93dR/IGvjcxhz5th16fg2z6DBy5cBV+f4pI+odH1N/MWCViytwrHqD6Vug5FcdkoQw6jkV10MnmRq394A1+oYGq5xcJdD86zGiqclOPUfRRRXqnjhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABV21fdEPUcVSqa0ba5X1rOexcHZl2iiisDqCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEbpWc7bmZvU1cmbbGx9sVRArWmuphUfQWiiitjEKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK4rXBjVrnP94fyFdrXJeJofL1IP2kQH8RxXm49XpJ+Z6uWySrNPqjJr5+/aFsjD4qsrkDi4stpPurMP5EV9A15D+0Vp3naTo98B/qp3gY+gdcj9VNfB55T9pgZ+Vn+P8AkfdZZPkxUfO6PTtPTy7G1TpthQfkoqxUduNsEQByAij9BUle5HSKPOe7CiiiqEFFFFABRRRQAUUUUAFFFFABRRRQBe0/7r/UVdqlp/3X+oq7UsAooopAFFFFABRRRQAUUUUAFFFFABRRRQBxvxdbHw18Qf8AXuB/4+tcR+zZppj03W78j/XTxwKfZVLH9XFdp8ZG2fDTXugzEg595FqP4M6OdJ+HelBhtkuQ103/AANsj/x0LXgVKXtM2hJ/Zhf8Wj04VOXAyj3l+iZ3DV1dmMWsI/2F/lXKqpeRVH8RxXXIuxQo6AYr7bL1rJnx+aSVoRHUUUV7h8+FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFKrbJFPoaSikBpL0pahhbdGp9qmrlOxO4UUUUDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopG6UAVrxsKo9TVapbr5pMegqKuiKsjlm7yCiiirICiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACsbxNaGayEqjLQnJ/3T1/pWzTXQOpDAMpGCD3FZVYKpBwfU1o1HSmproefVxvxf0r+1fh7qyqu57dBdKP8AcOT/AOO7q73VNPbTrpozkxnlG9RWdeWsd9Zz20o3RzRtGw9QwIP86+OxVF1Kc6MuqaPuMPWSlGrHyZDbkNbQEdDEh/8AHRUlMt7c2tlbRMdxiiWMkd8KB/Sn1pHZXDqFFFFUAUUUUAFFFFABRRRQAUUUUAFFFFAF7T/uv9RV2qWn/df6irtSwCiiikAUUUUAFFFFABRRRQAUUUUAFFFFAHG/Fixk1TwLeWEIJlu5re3XHq0yCurs7WOwtYLaIYigjWJB/sqMD9BRcWsd15fmKGEciyrnsw6H8KmVSxCqMsTgAd6xjSSqur1aS+67/Utz9xQ6Jt/fb/Iu6Lb/AGi8DkfLH8349q6SqunWYs7cIfvnlj71ar63C0vZU7PdnxmMre2qtrZbBRRRXYcQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAWrNvlK+hqzVG0bEuPUVdXpXPJanVD4RaKKKgsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkbpS01jgZ9KAKErbpmPvTaOpzRXUcQUUUUwCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCtf2MV/AYpRx1DDqp9RXJ32j3Nixyhkj7SIMj8fSu1orjrYaFbV6M7cPi54fRarseeNC8ittRm2jJwDxiq9ekyIHQq3KsMEe1edXEBtriWFuqMV/I14+Iw/sEne9z38Ji/rLaatYjooorjPRCiiigAooooAKKKKACiiigAooooAvaf8Adf6irtUtP+6/1FXalgFFFFIAooooAKKKKACiiigAooooAKKKRqAHwwy3DbY42b6dK3NN0oWn7yTDze3RfpVjTYfs9nFGeuMn6nmrVfQYfCRglOWrPl8VjZ1G6cdF+YUUUV6Z5QUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFADovlkU+9aC9KzehBrSVtwzWNQ3p9RaKKKyNgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKjnOI2+lSVXujiFvwprcT2KlFItLXUcYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVxviq18nUhKB8sy5/EcH+ldlWL4otftGmmQDLQtv/Dof8+1ceLhz0nbod+BqezrLs9DjqKKK+bPrgooooAKKKKACiiigAooooAKKKKAL2nj5X+oq7VPT/8AVv8AX+lXKlgFFFFIAooooAKKKKACiiigAooooAKksbf7VeRx9icn6DrUda2g2+WkmP8AuD+v9K6MPT9pUUTlxVT2VKUjZWloHFFfVnxgUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAjVoQn9yp9qoVbtT+6X2zWc9jWnuWKKKKwOgKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACq95/qx9asVVvD8qj3qo7oiXwsrUUUV0nKFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFMljWWNkcZVwVI9jT6DzS3BO2x5zc27WlzJC33kYqairf8W2fl3Mdyo4kG1vqP/rfyrAr5WrT9lNxPtaFT21OMwooorI6AooooAKKKKACiiigAooooAv6f/q3+v9KuVT0//Vv9f6VcqWAUUUUgCiiigAooooAKKKKACiiigBG54rqbG3+zW0cfcDn696wdJt/tF4pIysfzH+ldKte3l9PR1GfP5nV1jSXqLRRRXsHhBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABVuz/wBWfrVSrFn91h71nPY0p/EW6KKKwOkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACql5/B+NWm6VWvOqfjVR+Iifwlaiiiuk5QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooApavY/btPlhA+fG5P94dP8+9cD3weD6V6U1cV4ksPsOoF1GI5vnHse4/z615GPp6Koj3MsrWbpPrqjKooorxj6EKKKKACiiigAooooAKKKKAL+n/6t/r/SrlUtO+6/+9V2pYBRRRSAKKKKACiiigAooooAKQ9KWpbG2+2XaJ/B1b6VUYuclFdSJyUIuUtkbejWvkWgYjDyfMfp2rQpAMdOPalr6ynBU4qC6HxVWo6k3N9QooorUyCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACrFn0f8Kr1PZ/x/hUT2Lh8RcooornOoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEbpVa86p+NWqq3nRPqaqPxET+ErUUUV0nKFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABWdrmm/2hYuijMqfOn19PxrRoIqJxU4uL6lwm6clOO6PNOnHSiuh8S6IY2a8gX5DzIo7H+99K54Gvl6lOVKTjI+zo1o14KcQooorI3CiiigAooooAKKKKALun/cf/eFXqo6f9x/94VeqWAUUUUgCiiigAooooAKKKKAEJxXQaPZm3t97DEknJ9h2rP0nTjdMJZBiIHjP8R/wroAK9rA4d/xZfI8DMMSn+5j8/8AIWiiivZPBCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqez/j/CoKns+jfWonsXD4i5RRRXOdQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFVrwfKp96s1XvBmP6EVUdyJfCypRSLS10nKFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAhGa5XXPDhiLXFmuY+rRDqvuPb2rq6KwrUY1o2kdFCvPDy5onmgNFdP4m0eBLWa+QeU8Y3Oqjhuf0Ncujq4ypBHqK+crUnRlys+sw9eOIhzxFooorE6QooooAKKKKALun/cf/AHhV6qOn/cf/AHhV6pYBRRRSAKKKKACiimvIqqSxAHqaAFJxWjpuktcYlmBWPqF7t/8AWqbR9NikhiuX/ebxuVSOBW0BXsYbB81p1PuPBxeOtenS+8RVCqABgDgAdqWiivaPACiiimAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFWbNfkb61Wq3a/6v6k1nPY0p/EWKKKKwOkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACoLgZhb86nqKXmNh7GmtxPYo0UUV1HGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAZXin/kX7//AK5/1FeYxyvC2VOPbsa9O8U/8i/f/wDXP+ory+vnsw/iL0Ppsr/hS9f0RowXqScN8je/SrNYtSxXUkPAO5fQ15qkexY1aKrxX0cnBOw+jf41YBBqhBRRRTAv6d/q3/3quVT07/Vv/vVcqWAUUUhYKMk4HvSAWkJxVWbUEThPnPt0qjLcST/eOF9B0pXHZl6a+SPhfnb26Cs+WV5my5z6DsKZtFLSLSsd9oP/ACB7P/rn/Wr9UNB/5A9n/wBc/wCtX6+uo/w4+iPhK38WXqwooorcxCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKuW4/cr+dUmrQiG2NR7CsqmxrT3JKKKKxOgKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkIzS0jdKAM3oxFFPmXbM31zTK6kcb0YUUUUxBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAZXin/kX7/wD65/1FeX16h4p/5F+//wCuf9RXl9fPZh/EXofTZX/Cl6/ogoooryj2gp0crxfdYj27U2imBaTUHH3lDfTipV1GM9Qw/DNUKKfMxHQaffxCJuT970qw2poOisf0rE0//Un6/wBKt0rj5UWn1GRvugL+pqs8jSHLsW+tJRQVYKKKKQBRRRQB32g/8gez/wCuf9av1Q0H/kD2f/XP+tX6+vo/w4+iPg638WXqwooorcxCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAMbiBWkvSqEPzSqPQ5q+vSsJ7m9PYWiiiszYKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCleLh1PqKhq3eLujz6GqldENjlmrSCiiirICiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACijOKz9Y17TvD9qbjU72Cxg/vzuFz9B1P4UJNuyE2oq7NCqOsa1p/h7TZtQ1S+t9OsYRmS5upRHGv1J4/CvFviT+0g1jpN3H4LsV1HUlX93cX6lYffamQzH0zgV8Q+OPiJ4l+I2pG88S6tc6lMhOyOU7YofZIxhU/AZr0YYCrKzqLlX4nnSx9LVU3zM+zNa/ax8OeKPF2n+EPDNrNqseoT/Z5tVkzFCgwTmNSNzn5epCj610Y6V+fmg65eeGdastVsHEd5ZyiWJmXcMjsR3BGQfrX2r8M/iVp3xK0EXtpiC8iwt3ZE5aB/6qezfh1FeDnWDdJxqQXu2s/W59HkWNjUUqM3717peVuh19FFFfLH14UUUUAFFFFAF3T/APUn6/0q3VTT/wDUn6/0q3QUgooooAKKKKACkJwM0tcb8UviZpvwx8OPqF4RPdyZSzsg2GuJP6KOCzdh7kVpTpyqzUIK7ZnVqwowdSo7JEOl/taeHPDvjPU/CXiW2m0hdPuDbQ6pHmWB1wCDIANyHnqAw+le8aTrFjr2nw32m3kF/ZTDMdzayCSNx7MOK/KPX9dvPFGuX2r37rJe3szTSsi7RuPoOwHAH0rf+Gvjjxd4O16L/hEtVubC5mcboEO6CX1MkZyrD1JGfev0dZf7kVF+9Zemx+WSzC9SUpL3W3+Z+pVFeK+Df2jLW4ggt/EtqbS6CgSXtmpaF2xydn3lGfTdXrek65p+v2YutNvIL63P/LSBwwH19PxrirYerh/4kbfkdlHE0sQv3cr/AJl+iiiuc6QooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooozigCa0XMjH0FXar2a7Y8+pqxXNLc6oK0QoooqSwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAI5V3Iw9RWetabdKz5l2SMPetafYxqLqNooorYwCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiigc8Dn6UAFFcv4i+JXhvwtuW/1WETr/y7wHzZf++Vzj8cV5f4j/aUkffHoWlBB0Fzftk/URqf5muyjg69fWEdO/Q4q2MoUPjlr957uzhVLEgKBkk8AfWuG8TfGbwv4bLxtf8A9o3S8fZ7AeYc+hb7o/Ovm7xF461/xYx/tTVJ7iM8iAHZEP8AgC4FYIGAK9yjk0d60vkv8zw62cN6UY282er+Jv2htd1TfFpMEWjQHjzP9bNj/eIwPwH415jqGo3erXTXN9czXlw3WWdy7fmar0V7lHD0qCtTjb+u+54VbEVa7vUlf+uwV578QvApu/M1XTo8zj5p4EH3/wDbUevqO/1r0KitZwVRWZnCbpy5kfNwNbHhTxXqfgnW4NV0m4MF1FwQeUkXujjup9PxHNdv46+H32syajpceJ+WmtlH3/Vl9/bv9a8w6EgjBHGDXi1qNrwmrp/ie1RrXtUpuzX4H2/8MvinpfxM0nzrUi21GFR9qsHbLxH+8v8AeQ9m/A4NdrX586Jrl/4a1W31LTLqSzvYG3JLGeR6gjuD3B4NfW/wj+N2n/ESFLC88vT/ABCq/NbZwlxjq0Wf1XqPcV+e5llMsNerR1h+X/AP0nK84jikqVd2n+D/AOCen0UnWlr5w+nCiiigC7p/+pP1/pVuqmn/AOpP1/pVugpBRRRQAUUV598WPjHpPwt0398Re6zMubbTkbDN/tuf4U9+p6D22pUp1pqFNXbMa1anQg6lV2SNP4kfEvSfhnoLahqL+ZO+VtbJGxJcOOw9AO7dB9cCvh/xv421X4g6/Pq2rz+ZO/yxxJxHAnZEHYD8yeTzUXi7xfqvjrXJ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8EtO3Q+uvDPxS8M+KiiWepxx3Lf8u13+5kz7A8H8Ca67p14+tfCxAIwRmuu8L/FTxL4T2Ja6g1xaL/y6Xn72PHoM8r+BFeFWyfrRl8n/AJnuUc46Vo/NH13RXlXhH9oLRNaZINXjbRLo8eYx327H/e6r/wACH416jBcR3EKSxSJLE4yskbBlYeoI4NeBWo1KD5akbH0FGvTrrmpyuSUUUVibhRRRQAUUUUAFFFFABRRRQA6FPMkA7dTWgvSq1mnylvXpVqueTuzppqyCiiioNAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAayhlIPQis4qUYqeorTqndx4If8DWkHZ2Mqi0uQUUUVuc4UUUUAFFFFABRVe+vrfTbSa6upkt7aFS8ksrbVQDuTXzt8S/jjd+IGm03QHksdMOVe5HyzXA9u6L7dT3x0rrw2FqYqVoLTqzixOKp4WPNN69EejfED42aV4RaSzsduraqvBjRv3UJ/wBth1P+yOfUivnzxR4y1jxlefaNWvHnCnMcI+WKP/dToPr196xRxRX2WFwNLCq8VeXf+tj47FY6rin7zsu39bhRRRXoHnhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAcj4t+H1rr++5tdtpfnksB8kp/2h6+4/HNeTalpl1o921teQtBMv8LdCPUHuPcV9D1n61oVlr9obe9hEq/wsOGQ+qntXJVoKesdGddKu4aS1R8/1r+HfC194muNlqmyFTiS4cfIn+J9hXZ6f8I44tTdry786xU5REG139mPb8OvtXoFraQ2VukEESQwoMLGgwBXPTwzbvPRHRUxKStDVmX4b8J2PhmDbbp5k7DElw4+dvb2HsP1raoor0YxUVZHnOTk7sKKKKokKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuj8I/EDW/A84bTbs/ZicvZzfNC//Aex9xg1zlFROEakeWaui4TlTlzQdmfU/gH4yaR42MdrIRpurNx9lmb5ZD/0zbv9Dg/WvQa+F+hyOCOQR2r1/wCG/wAeLrRzFp3iN5L2xGFS9+9NCP8Aa/vr/wCPD3r5fF5U43nh9V2/yPp8JmqlaGI08/8AM+iaKr2N9b6laQ3VpPHc20yh45Ym3Kw9QasV876n0fmgooooGFFFFABQFLsFHc0VPaR5Jc/QVMnZFRV3YtKoVQB0FOoormOsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApkiB1KnoafRQBmEFWKnqKKsXcXIcfQ1Xrpi7o5JLldgoooqiQqOaZLeJ5JHWONFLM7HAUDkkn0qSvD/2gviEYU/4Rewlw8gD37qeinlYvx6n2wO5row+HliaqpxObEYiOGpupI4n4tfFCbxxqJs7KRo9Ct3/dp089h/y0b/2Udhz1rz2iivv6NGFCCpwWiPgK1WdabnN6sKKKK2MQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA7z4V/FC48B6iLe4ZptDuH/fw9TET/y0T39R3Hvivqe1uory3ingkWaCVQ6SIcqykZBB9K+HK9x/Z7+IBDnwvfSZU5ksGY9O7RfzYfiPSvnM0wSkniKa1W/+Z9FleMcZewqPR7f5Hu9FFFfKn1gUUUUAAUswA6mtCNAigDoKr2sfO8/QVbrCbu7HRTVlcKKKKzNQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBrKGUg8g1nupjcqe1aVV7qLcu4feFXF2ZnON1cqUUUV0HMYPjbxVB4N8NXmqzgMYVxFGf+Wkh4RfxP6A18eX19capfXF5dSGa5uJDLJIf4mJyTXqX7Q3jA6r4ii0O3fNtpw3TAHhp2HP/AHyuB9Sa8mr7LKsN7Gj7SW8vy6f5nxeaYj21X2a2j+fUKKKK9s8UKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqazvJ9PvILu2kMNxA6yRyL1Vgcg/nUNFLfRj21R9leCfFMPjLwzY6rDhWmTEsY/5Zyjh1/P8AQit6vnT9nfxcdO1640Gd8W9+PMgBPSZR0/4Eo/NRX0XX5/jMP9WrOHTdeh9/g8R9Zoqb32fqFKimRwo701qt2sW1dx6n+VcEnZHoRjzMnVQqgDoKdRRXOdYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFI3SlooAoXEXltkfdNYnizxDF4V8O6hq02CtrEXVT/G/RV/FiBXTyRiRSDXz9+0r4lMS6d4eiblj9ruAD2GVjH57j+Ar0cHS+s1Y0vv9Dy8dV+rUZVPu9Tw27upr67murhzJPM7SSOf4mJyT+ZqKiiv0fbRH5zvuFFFFAgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCfT7+fSr+2vbVtlzbyLLGw7MpyP5V9n+Hdbg8RaJY6pb/6m7hWUD+7nqPwOR+FfFNfQn7NviM32kX+gyPmS0f7RCCf+Wbn5h+Dc/wDAq8DOKPPSVVbx/JnvZRX5KrpPaX5r/gHtFvH5jZP3RV5elNjjEagDtT6+Ik7s+7jHlQUUUVJQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFADGYKpJOAOST2r4o+IHiQ+LfGWq6puJilmKw57RL8qfoM/jX1B8ZPEh8M/D3VJ0fbPcJ9khP+1JxkfRdx/Cvj0AAYHSvrcjo6SrP0X6/ofIZ7X1hRXq/wAl+otFFFfVnyYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFdf8JPEn/CK/EDSrp32W80n2WfJ42ScZP0O0/hXIUhz2JB9R2rKrTVWEqctmrGtOo6U41I7o++16Utcv8OfEX/CVeC9J1IsGllgCzf8AXRflf/x4Guor8vnF05OEt0fqdOaqRU47MKKKKgsKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiikbpQB87ftPeIBNqOj6JG3ywo13KAf4m+VM/gG/OvDq6j4na9/wk3j7Wr5W3xeeYYj/sJ8g/ln8a5ev0rA0fYYaEPL8z8yx1b2+JnPz/BBRRRXccIUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH0J+y/4h87TdX0WRuYJVuogf7r/ACt+qj/vqvd6+QPgfr39hfEjTNzbYb3dZyc9d4+X/wAeC19fL0r4HN6Ps8U5LaWv+Z+gZPW9phVF7x0FooorxT2wooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK5/x1rn/CM+D9Y1PO1re2dk/wB8jC/+PEV0FeP/ALS2tCx8F2uno2Hv7pQR6og3H9dldWFpe2rwp93/AMP+ByYur7GhOp2X/DHzGM9zk9z60tFFfpx+XhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFADRIpdlB+YAEj65/wNOrK0+58/XNYTPEPkR/jsLH+datJO43oFFFFMQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA0yAOFzyQSB9P/ANYp1Zd/c+Rrmkx54mE6fiFDf0rUpJ3uO2wUUUUxBRRRQAUUUUAFFFFABRRRQAUUUUASW11JY3MNzCSssLrKhHZlOR+or7n0XVI9Y0mzvosGK6hSZcejKD/WvhSvq/8AZ91r+1vhvZwscyWEr2rc84B3L/46wH4V8znlLmpQqLo/zPpsjq8tWVLur/cemUUUV8afahRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAjdK+Y/wBpjWftnjGw05Wytla7mHo8jZP6KtfTjdK+Lfifq39ufEHXrsNvQ3TRIf8AZT5B/wCg17+S0+fEOfZfnp/mfPZ3U5cOoLq/y1/yOXooor7k+FCiiigAooooAKKKKACiiigAooooAKKKa7iNS56KNx/CgDlPB139s17xTJnI+1qB9ACv9K62vOvhLcG4n1pycmR0kP4l69FrGi+aCZvWXLNoKKKK2MAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDlPFt19k8Q+FnzgG7dSfYqF/rXV1578Vbk2t1oUoODHK8n5FK9BBDfMOh5FYwfvyRtNe5Fi0UUVsYhRRRQAUUUUAFFFFABRRRQAUUUUAFe4/su615epa3pLHiWNLpB7qdrfoy/lXh1dz8E9Y/sf4maOxOI7lmtX/4GpA/8eC15+YU/a4WcfK/3anoZfV9jiqcvO33n2FRSL0pa/Nz9LCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDP1zUl0nR76+bG22gkmOf9lSf6V8KtI0zNI5y7ksx9SeTX118c9U/sv4ZayQ217hUtl/4GwB/TNfIlfY5FTtTnU7u33f8ADnxee1OarCn2V/v/AOGCiiivpz5gKKKKACiiigAooooAKKKKACiiigArO8R3X2PQNSmzjZbyEfXaQP51o1zXxEn+z+EL/nBk2R/mwqJu0Wy4K8kjlfg62271RP8AplGfyY/416fXlPwifGs36f3rcH8nH+NerVjh/wCGjbEfxGFFFFdJzBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHmPxibM+lp38uU/qtegaHc/bNHsJ+vmW8bf+OivOfi8+dV05PS3Y/m3/wBauz+H9x9o8Iaac8ohjP8AwFiK44P99JHZNfuYs6Giiiuw4wooooAKKKKACiiigAooooAKKKKACp9Pvn0vULW9jOJLaVJlPurBv6VBQeeO1JpNWY02ndH3na3Ud3bRTxndHKgdT6gjIqxXGfCHVf7Y+G+gTs251thAx94yU/8AZa7OvyypB05yg+jaP1WlP2lOM11SYUUUVmahRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAHif7UGpeT4Z0ixB/4+LsykeoRD/VxXzhXsv7T2o+d4o0iyDZEFm0pHoXfH8krxqv0LKocmEh56n53ms+fFz8rL8P8wooor1jyAooooAKKKKACiiigAooooAKKKKACuI+LNx5fh2CLP+tuV/RSa7evOPjDP+70qDPVpJMf98isK7tTZvQV6iMf4TybfE0i/wB+2cfkVNev14v8NJPL8YWw/vxyL/47n+le0VnhvgNMV8YUUUV1nIFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAeR/FmTd4jt0/uWq/qzGup+FM/m+GGj/wCeVw4/MA/1rjfifJ5ni6UZ+5DGv6Z/rXQ/B6fNpqcOfuyRuB9QR/SvOg/37PSmv9nR6JRRRXonmhRRRQAUUUUAFFFFABRRRQAUUUUAFB5oooA+mP2ZdU+1eCr2yJy1petgeiuoYfrur2OvnD9l3UvL1zXNPzxNbxzge6MVP6OK+j6/O8zh7PFz89fvP0bK6ntMJDy0+4KKKK8s9UKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApG6UtI3SgD5F+PV+L74oaqAcrbpFAPwQE/qxrz+t3x9fjUvHOv3QYESX02PoGKj9BWDx6iv0/DR9nQhHsl+R+W4mftK85d2xaKTj1FHHqK6TmFopOPUUceooAWik49RRx6igBaKTj1FHHqKAFopOPUUceooAWik49RRx6igBa8o+Ls+7W7GL+5b5/Nj/hXq24eteN/FGcSeLZFyP3cMa9fYn+tcuJ/hnXhv4hR8CS+T4w0s+spX81Ir3Ovn/wAN3Ag8Q6ZJuHy3Mff/AGgK9/yASMiowvwsvFL3kxaKTj1FHHqK7ThFopOPUUceooAWik49RRx6igBaKTj1FHHqKAFopOPUUceooAWik49RRx6igBaKTj1FHHqKAFopOPUUceooAWik49RRx6igBaKTj1FHHqKAFopOPUUceooAWik49RRx6igBaKTj1FHHqKAFopOPUUceooAWik49RRx6igBaKTj1FHHqKAFopOPUUceooAWik49RRx6igBaRulHHqKDg8ZoA8Q+IEvm+MdS/2XVPyQCtz4QT7dW1CL+/bq35N/8AXrlPFFyLjxLqkm4c3Mnf0OP6Vt/C24EfixVyP3kEi9fYH+leRB/vr+Z684/ubeR7JRSAj1FHHqK9c8gWik49RRx6igBaKTj1FHHqKAFopOPUUceooAWik49RRx6igBaKTj1FHHqKAFopOPUUceooA9F+AOofYfidp6Ftq3MU0B98puH6oK+tl6V8SfD/AFAaX468P3RbAS+iDHPYsFP6E19tr0r4rPIWrxl3X6n2+RTvQlHs/wBBaKKK+cPpAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDnn8A+GpHZ28P6WzMSxZrOMkk9T0o/4V94Z/6F3S/wDwDj/wroaK19rU/mf3mPsaf8q+457/AIV94Z/6F3S//AOP/Cj/AIV94Z/6F3S//AOP/Cuhoo9tU/mf3h7Gn/KvuRz3/CvvDP8A0Lul/wDg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AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB/9k='


module.exports = router;
