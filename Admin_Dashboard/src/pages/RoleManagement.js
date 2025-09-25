import React, { useState } from 'react';
import { useEffect } from 'react';
import Accounts from './Accounts';

const DEFAULT_ROLES = [
    { name: 'sales', permissions: ['orders.view', 'orders.edit'] },
    { name: 'inventory', permissions: ['products.manage'] },
    { name: 'support', permissions: ['orders.view', 'reports.view'] },
    { name: 'delivery', permissions: ['orders.view'] },
    { name: 'analyst', permissions: ['reports.view'] },
];

const ALL_PERMISSIONS = [
    'orders.view',
    'orders.edit',
    'products.manage',
    'reports.view',
    'users.manage',
    'roles.manage',
];

function RoleManagement() {
    const [roles, setRoles] = useState(DEFAULT_ROLES.map(r => ({
        ...r,
        description: r.name.charAt(0).toUpperCase() + r.name.slice(1) + ' role',
        employees: 0
    })));
    const [accounts, setAccounts] = useState([]);
    // Lấy danh sách users từ localStorage hoặc window để demo, thực tế sẽ lấy từ API hoặc context
    useEffect(() => {
        // Nếu Accounts dùng API thì thay bằng fetch, ở đây demo lấy từ window.mockUsers nếu có
        if (window.mockUsers) {
            setAccounts(window.mockUsers);
        }
    }, []);

    // Tính lại số lượng nhân viên cho từng role
    useEffect(() => {
        setRoles(roles => roles.map(role => ({
            ...role,
            employees: accounts.filter(u => u.role === role.name).length
        })));
    }, [accounts]);
    const [editRole, setEditRole] = useState(null);
    const handleEdit = role => {
        setEditRole({ ...role });
    };

    const handleUpdate = data => {
        setRoles(roles.map(r => r.name === data.name ? { ...r, ...data } : r));
        setEditRole(null);
    };
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const handlePermissionChange = (perm) => {
        setSelectedPermissions((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm]
        );
    };

    const handleCreateRole = (e) => {
        e.preventDefault();
        if (!roleName) return;
        setRoles([...roles, { name: roleName, permissions: selectedPermissions }]);
        setRoleName('');
        setSelectedPermissions([]);
    };

    return (
        <div className="w-full flex flex-col flex-grow">
            <h2 className="text-2xl font-bold mb-4 text-left">Role Management</h2>
            <main className="flex flex-col flex-grow">
                <div className="bg-white rounded shadow p-6 w-full flex flex-col flex-grow mb-8">
                    <form onSubmit={handleCreateRole} className="mb-8">
                        <label className="block mb-2 font-semibold">Role Name</label>
                        <input
                            className="border p-2 rounded w-full mb-4"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Enter role name"
                            list="role-options"
                        />
                        <datalist id="role-options">
                            {DEFAULT_ROLES.map((role) => (
                                <option key={role.name} value={role.name} />
                            ))}
                        </datalist>
                        <label className="block mb-2 font-semibold">Permissions</label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {ALL_PERMISSIONS.map((perm) => (
                                <label key={perm} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(perm)}
                                        onChange={() => handlePermissionChange(perm)}
                                        className="mr-2"
                                    />
                                    {perm}
                                </label>
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                            Create Role
                        </button>
                    </form>
                    <h3 className="text-xl font-semibold mb-2 text-left">Existing Roles</h3>
                    <table className="w-full bg-white rounded shadow table-fixed">
                        <thead>
                            <tr>
                                <th className="p-2 w-40 text-left">Role Name</th>
                                <th className="p-2 w-80 text-left">Permission</th>
                                <th className="p-2 w-64 text-left">Description</th>
                                <th className="p-2 w-40 text-left">Total Employees</th>
                                <th className="p-2 w-32 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 font-bold w-40 text-left">{role.name}</td>
                                    <td className="p-2 w-80 text-left">{role.permissions.join(', ')}</td>
                                    <td className="p-2 w-64 text-left">{role.description}</td>
                                    <td className="p-2 w-40 text-left">{role.employees}</td>
                                    <td className="p-2 w-32 text-left">
                                        <button className="mr-2 text-blue-600" onClick={() => handleEdit(role)}>Edit</button>
                                        <button className="text-red-600" onClick={() => setRoles(roles.filter((_, i) => i !== idx))}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {editRole && (
                                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50" style={{ pointerEvents: 'auto' }}>
                                    <div
                                        className="absolute top-0 left-0 right-0 bottom-0"
                                        style={{ background: 'rgba(0,0,0,0.10)', backdropFilter: 'blur(4px)' }}
                                        onClick={() => setEditRole(null)}
                                    ></div>
                                    <form
                                        onSubmit={e => {
                                            e.preventDefault();
                                            handleUpdate(editRole);
                                        }}
                                        className="relative bg-white p-6 rounded-xl shadow-lg w-[400px] min-w-[300px] z-10"
                                    >
                                        <h2 className="text-xl font-bold mb-4 text-center">Edit Role</h2>
                                        <label className="block mb-2 font-semibold">Role Name</label>
                                        <input name="name" value={editRole.name} onChange={e => setEditRole({ ...editRole, name: e.target.value })} className="border p-2 rounded w-full mb-2" required />
                                        <label className="block mb-2 font-semibold">Description</label>
                                        <input name="description" value={editRole.description} onChange={e => setEditRole({ ...editRole, description: e.target.value })} className="border p-2 rounded w-full mb-2" required />
                                        <label className="block mb-2 font-semibold">Permissions</label>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            {ALL_PERMISSIONS.map(perm => (
                                                <label key={perm} className="flex items-center">
                                                    <input type="checkbox" checked={editRole.permissions.includes(perm)} onChange={() => setEditRole({ ...editRole, permissions: editRole.permissions.includes(perm) ? editRole.permissions.filter(p => p !== perm) : [...editRole.permissions, perm] })} className="mr-2" />
                                                    {perm}
                                                </label>
                                            ))}
                                        </div>
                                        <label className="block mb-2 font-semibold">Total Employees</label>
                                        <input name="employees" type="number" min="0" value={roles.find(r => r.name === editRole.name)?.employees || 0} disabled className="border p-2 rounded w-full mb-4 bg-gray-100" />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button type="button" className="px-4 py-2 rounded bg-gray-300" onClick={() => setEditRole(null)}>Cancel</button>
                                            <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white">Save</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default RoleManagement;
