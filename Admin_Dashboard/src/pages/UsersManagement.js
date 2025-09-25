import React, { useState } from "react";
import PageTitle from "../components/Typography/PageTitle";

const MOCK_USERS = [
    { id: 1, name: "Nguyen Van A", email: "a@email.com", phone: "0123456789", roles: ["sales"], active: true },
    { id: 2, name: "Tran Thi B", email: "b@email.com", phone: "0987654321", roles: ["support", "analyst"], active: true },
];
const ROLE_OPTIONS = ["sales", "inventory", "support", "delivery", "analyst"];

function UserForm({ onSave, user, roles }) {
    const [form, setForm] = useState(user || { name: "", email: "", phone: "", password: "", roles: [], active: true });
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleRoleChange = role => setForm({ ...form, roles: form.roles.includes(role) ? form.roles.filter(r => r !== role) : [...form.roles, role] });
    return (
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="mb-4 p-4 bg-white rounded shadow">
            <label className="block mb-2 font-semibold">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full mb-2" required />
            <label className="block mb-2 font-semibold">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full mb-2" required type="email" />
            <label className="block mb-2 font-semibold">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded w-full mb-2" required />
            <label className="block mb-2 font-semibold">Password</label>
            <input name="password" value={form.password} onChange={handleChange} className="border p-2 rounded w-full mb-2" type="password" required={!user} />
            <label className="block mb-2 font-semibold">Assign Roles</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
                {roles.map(role => (
                    <label key={role} className="flex items-center">
                        <input type="checkbox" checked={form.roles.includes(role)} onChange={() => handleRoleChange(role)} className="mr-2" />
                        {role}
                    </label>
                ))}
            </div>
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">{user ? "Save" : "Create User"}</button>
        </form>
    );
}

function UsersManagement() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const handleSave = user => {
        if (editUser) {
            setUsers(users.map(u => u.id === editUser.id ? { ...user, id: editUser.id } : u));
        } else {
            setUsers([...users, { ...user, id: Date.now() }]);
        }
        setShowForm(false);
        setEditUser(null);
    };
    const handleEdit = user => { setEditUser(user); setShowForm(true); };
    const handleDelete = id => setUsers(users.filter(u => u.id !== id));
    return (
        <div className="p-8 max-w-3xl mx-auto">
            <PageTitle>Users Management</PageTitle>
            <button className="mb-4 bg-purple-600 text-white px-4 py-2 rounded" onClick={() => { setShowForm(true); setEditUser(null); }}>Create User</button>
            {showForm && <UserForm onSave={handleSave} user={editUser} roles={ROLE_OPTIONS} />}
            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Phone</th>
                        <th className="p-2 text-left">Roles</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="p-2">{user.name}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">{user.phone}</td>
                            <td className="p-2">{user.roles.join(", ")}</td>
                            <td className="p-2">
                                <button className="mr-2 text-blue-600" onClick={() => handleEdit(user)}>Edit</button>
                                <button className="text-red-600" onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersManagement;
