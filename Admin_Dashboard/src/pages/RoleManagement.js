import React, { useState } from 'react';

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
    const [roles, setRoles] = useState(DEFAULT_ROLES);
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
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Role Management</h2>
            <form onSubmit={handleCreateRole} className="mb-8 bg-white p-4 rounded shadow">
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
            <h3 className="text-xl font-semibold mb-2">Existing Roles</h3>
            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="p-2 text-left">Role</th>
                        <th className="p-2 text-left">Permissions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role, idx) => (
                        <tr key={idx}>
                            <td className="p-2 font-bold">{role.name}</td>
                            <td className="p-2">{role.permissions.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RoleManagement;
