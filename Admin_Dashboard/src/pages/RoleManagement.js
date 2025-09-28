import React, { useState, useEffect } from 'react';

const ROLES_API_URL = "http://localhost:8000/api/roles/roles/";
const USERS_API_URL = "http://localhost:8000/api/users/users/";
const PERMISSIONS_API_URL = "http://localhost:8000/api/roles/permissions/";

function RoleManagement() {
    const [roles, setRoles] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [permissions, setPermissions] = useState([]); // Initialize permissions state

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
                let perms = Array.isArray(data) ? data : [];
                // Nếu backend trả về rỗng, thêm ví dụ permission mẫu
                if (perms.length === 0) {
                    perms = [
                        { id: 1, name: "orders.view" },
                        { id: 2, name: "orders.edit" },
                        { id: 3, name: "products.manage" },
                        { id: 4, name: "customers.view" },
                        { id: 5, name: "reports.view" },
                        { id: 6, name: "users.manage" },
                        { id: 7, name: "rbac.manage" },
                        { id: 8, name: "orders.assign" },
                        { id: 9, name: "products.view" },
                        { id: 10, name: "dashboard.view" }
                    ];
                }
                setPermissions(perms);
            })
            .catch((err) => {
                console.error("Error fetching permissions:", err);
                // Nếu lỗi, vẫn hiển thị permission mẫu
                setPermissions([
                    { id: 1, name: "orders.view" },
                    { id: 2, name: "orders.edit" },
                    { id: 3, name: "products.manage" },
                    { id: 4, name: "customers.view" },
                    { id: 5, name: "reports.view" },
                    { id: 6, name: "users.manage" },
                    { id: 7, name: "rbac.manage" },
                    { id: 8, name: "orders.assign" },
                    { id: 9, name: "products.view" },
                    { id: 10, name: "dashboard.view" }
                ]);
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
    const [viewRole, setViewRole] = useState(null);
    const handleEdit = role => {
        setEditRole({ ...role });
    };
    const handleView = role => {
        setViewRole(role);
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
        // Chỉ gửi mảng id permission lên backend
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
        } else {
            const errorData = await res.json().catch(() => null);
            alert("Failed to create role: " + (errorData ? JSON.stringify(errorData) : "Unknown error"));
        }
        setRoleName('');
        setSelectedPermissionIds([]);
    };

    // Xóa role qua API
    const handleDeleteRole = async (roleId) => {
        if (window.confirm("Are you sure to delete this role?")) {
            try {
                const res = await fetch(`${ROLES_API_URL}${roleId}/`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    setRoles(roles.filter(r => r.id !== roleId));
                } else {
                    alert("Failed to delete role from server.");
                }
            } catch (err) {
                alert("Network error: " + err.message);
            }
        }
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
                            {permissions.length === 0 ? (
                                <span className="text-gray-400 italic">No permissions available</span>
                            ) : permissions.map((perm) => (
                                <label key={perm.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissionIds.includes(perm.id)}
                                        onChange={() => handlePermissionChange(perm.id)}
                                        className="mr-2"
                                    />
                                    <span>{perm.name}</span>
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
                                <th className="p-2 w-80 text-left">Permissions</th>
                                <th className="p-2 w-64 text-left">Description</th>
                                <th className="p-2 w-40 text-left">Total Employees</th>
                                <th className="p-2 w-32 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 font-bold w-40 text-left">{role.name}</td>
                                    <td className="p-2 w-80 text-left">
                                        {Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                                            <ul className="list-disc pl-4">
                                                {role.permissions.map(p => (
                                                    <li key={p.id}>
                                                        <span className="font-semibold text-gray-700">{p.name}</span>
                                                        {p.description && <span className="ml-2 text-xs text-gray-500">({p.description})</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-gray-400 italic">No permissions</span>
                                        )}
                                    </td>
                                    <td className="p-2 w-64 text-left">{role.description}</td>
                                    <td className="p-2 w-40 text-left">{role.employees}</td>
                                    <td className="p-2 w-32 text-left">
                                        <button className="mr-2 text-blue-600" onClick={() => handleEdit(role)}>Edit</button>
                                        <button className="text-red-600" onClick={() => handleDeleteRole(role.id)}>Delete</button>
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
                                                    <span>{perm.name}</span>
                                                    {perm.description && <span className="ml-2 text-xs text-gray-500">({perm.description})</span>}
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
                            {viewRole && (
                                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50" style={{ pointerEvents: 'auto' }}>
                                    <div
                                        className="absolute top-0 left-0 right-0 bottom-0"
                                        style={{ background: 'rgba(0,0,0,0.10)', backdropFilter: 'blur(4px)' }}
                                        onClick={() => setViewRole(null)}
                                    ></div>
                                    <div className="relative bg-white p-6 rounded-xl shadow-lg w-[400px] min-w-[300px] z-10">
                                        <h2 className="text-xl font-bold mb-4 text-center">Role Details</h2>
                                        <div className="mb-2"><span className="font-semibold">Role Name:</span> {viewRole.name}</div>
                                        <div className="mb-2"><span className="font-semibold">Description:</span> {viewRole.description}</div>
                                        <div className="mb-2"><span className="font-semibold">Total Employees:</span> {viewRole.employees}</div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Permissions:</span>
                                            {Array.isArray(viewRole.permissions) && viewRole.permissions.length > 0 ? (
                                                <ul className="list-disc pl-4 mt-2">
                                                    {viewRole.permissions.map(p => (
                                                        <li key={p.id}>
                                                            <span className="font-semibold text-gray-700">{p.name}</span>
                                                            {p.description && <span className="ml-2 text-xs text-gray-500">({p.description})</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-gray-400 italic ml-2">No permissions</span>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button type="button" className="px-4 py-2 rounded bg-gray-300" onClick={() => setViewRole(null)}>Close</button>
                                        </div>
                                    </div>
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
