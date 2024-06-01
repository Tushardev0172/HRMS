const routes = [
    { path: ['/employee', '/employee_id', '/employee/leaveSubmit', '/employee/attendance'], roles: 'EMPLOYEE' },
    { path: ['/hr', '/hr/employee', '/hr/employee/add', '/hr/attendance', '/hr/leaves', '/hr/employee/:id'], roles: 'HR' },
    { path: ['/manager', '/manager/leaverequest', '/manager/attendance', '/manager/leaveSubmit'], roles: 'MANAGER' }
];
export default routes;
