var express = require('express')
var bp = require('body-parser')
var fs = require('fs')

var app = express()
app.use(bp.urlencoded({extended:true}))

var employeeList 
fs.readFile("19BCP036_EmployeeJSON.json", (err, data)=>{
    employeeList = JSON.parse(data)
})

app.get('/Employee/:id', (req, res)=>{
    var empID = req.params.id
    var empExist = employeeList.find(b => b.Employee_ID===empID)
    if(empExist){
        
        var index = employeeList.findIndex((emp) => emp.Employee_ID===empID)
        return res.json(employeeList[index])
    
    }else{

        return res.json({success:false})
    }   
})

app.post("/Employee", (req, res)=>{
    
    var{Employee_ID, Name, Salary, Department} = req.body

    var empExist = employeeList.find(b => b.Employee_ID===Employee_ID)
    
    if(empExist) return res.json({success:false})

    var emp = {Employee_ID, Name, Salary, Department}
    employeeList.push(emp)

    fs.writeFile("19BCP036_EmployeeJSON.json", JSON.stringify(employeeList), (err)=>{
        return res.json({success:true})
    })
})

app.put("/Employee", (req, res)=>{

    var empID = req.body.Employee_ID
    var updatedEname = req.body.uName

    var index = employeeList.findIndex((emp) => emp.Employee_ID===empID)
    var emp = employeeList.find(b => b.Employee_ID===empID) 

    if(!emp) return res.json({success:false})

    const updatedobj = {
        
        Employee_ID:emp.Employee_ID,
        Name:updatedEname,
        Salary:emp.Salary, 
        Department:emp.Department
    }

    employeeList.splice(index, 1, updatedobj)

    fs.writeFile("19BCP036_EmployeeJSON.json", JSON.stringify(employeeList), (err)=>{
        return res.json({success:true})
    })
})

app.delete("/Employee", (req, res)=>{
    var empID = req.body.Employee_ID
    employeeList = employeeList.filter((emp)=> emp.Employee_ID != empID)
    fs.writeFile("19BCP036_EmployeeJSON.json", JSON.stringify(employeeList), (err)=>{
        return res.json(employeeList)
    })
})

app.listen(8080)