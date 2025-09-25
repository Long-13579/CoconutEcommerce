import React, { useState, useEffect } from 'react';

const ROLES_API_URL = "http://localhost:8000/api/roles/roles/";
const USERS_API_URL = "http://localhost:8000/api/users/users/";
const PERMISSIONS_API_URL = "http://localhost:8000/api/roles/permissions/";

function RoleManagement() {
    const [roles, setRoles] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [permissions, setPermissions] = useState([]);

    // Fetch roles, users, permissions from API
    useEffect(() => {
        fetch(ROLES_API_URL)
            .then(res => res.json())
            .then(data => {
                setRoles(Array.isArray(data) ? data.map(r => ({
                    ...r,
                    employees: 0,
                })) : []);
            })
            .catch((err) => {
                console.error("Error fetching roles:", err);
                setRoles([]);
            });
        fetch(USERS_API_URL)
            .then(res => res.json())
            .then(data => {
                setAccounts(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Error fetching users:", err);
                setAccounts([]);
            });
        fetch(PERMISSIONS_API_URL)
            .then(res => res.json())
            .then(data => {
                setPermissions(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Error fetching permissions:", err);
                setPermissions([]);
            });
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
    // Tạo role mới: gửi lên API (nếu backend hỗ trợ), ở đây chỉ cập nhật FE
    const [roleName, setRoleName] = useState('');
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

    const handlePermissionChange = (permId) => {
        setSelectedPermissionIds((prev) =>
            prev.includes(permId)
                ? prev.filter((p) => p !== permId)
                : [...prev, permId]
        );
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!roleName) return;
        // Gửi POST lên API để tạo role mới
        const res = await fetch(ROLES_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: roleName,
                description: roleName.charAt(0).toUpperCase() + roleName.slice(1) + ' role',
                permission_ids: selectedPermissionIds,
            })
        });
        if (res.ok) {
            // Sau khi tạo thành công, fetch lại danh sách role
            fetch(ROLES_API_URL)
                .then(res => res.json())
                .then(data => {
                    setRoles(Array.isArray(data) ? data.map(r => ({
                        ...r,
                        employees: accounts.filter(u => u.role === r.name).length,
                    })) : []);
                });
        }
        setRoleName('');
        setSelectedPermissionIds([]);
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
                        />
                        <label className="block mb-2 font-semibold">Permissions</label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {permissions.map((perm) => (
                                <label key={perm.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissionIds.includes(perm.id)}
                                        onChange={() => handlePermissionChange(perm.id)}
                                        className="mr-2"
                                    />
                                    {perm.name}
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
                                    <td className="p-2 w-80 text-left">{Array.isArray(role.permissions) ? role.permissions.map(p => p.name).join(', ') : ''}</td>
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
                                            {permissions.map(perm => (
                                                <label key={perm.id} className="flex items-center">
                                                    <input type="checkbox" checked={Array.isArray(editRole.permissions) && editRole.permissions.some(p => p.id === perm.id)} onChange={() => {
                                                        let newPerms = Array.isArray(editRole.permissions) ? editRole.permissions.map(p => p.id) : [];
                                                        if (newPerms.includes(perm.id)) {
                                                            newPerms = newPerms.filter(id => id !== perm.id);
                                                        } else {
                                                            newPerms.push(perm.id);
                                                        }
                                                        setEditRole({ ...editRole, permissions: permissions.filter(p => newPerms.includes(p.id)) });
                                                    }} className="mr-2" />
                                                    {perm.name}
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
