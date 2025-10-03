import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";

// API endpoint URL
const API_URL = "http://localhost:8000/api/users/users/?staff_only=true";
const ROLES_API_URL = "http://localhost:8000/api/roles/roles/";

function AccountForm({ roles, onSave, onCancel }) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: roles[0] ? roles[0].id : "",
    });
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = e => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return alert("Passwords do not match!");
        onSave(form);
    };
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50" style={{ pointerEvents: 'auto' }}>
            <div
                className="absolute top-0 left-0 right-0 bottom-0"
                style={{ background: 'rgba(0,0,0,0.10)', backdropFilter: 'blur(4px)' }}
                onClick={onCancel}
            ></div>
            <form onSubmit={handleSubmit} className="relative bg-white p-6 rounded-xl shadow-lg w-[350px] min-w-[300px] z-10">
                <h2 className="text-xl font-bold mb-4 text-center">Create New Account</h2>
                <label className="block mb-2 font-semibold">Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="border p-2 rounded w-full mb-2" required />
                <label className="block mb-2 font-semibold">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full mb-2" required type="email" />
                <label className="block mb-2 font-semibold">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="border p-2 rounded w-full mb-2" required />
                <label className="block mb-2 font-semibold">Password</label>
                <input name="password" value={form.password} onChange={handleChange} className="border p-2 rounded w-full mb-2" type="password" required />
                <label className="block mb-2 font-semibold">Confirm Password</label>
                <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="border p-2 rounded w-full mb-2" type="password" required />
                <label className="block mb-2 font-semibold">Role</label>
                <select name="role" value={form.role} onChange={e => setForm({ ...form, role: Number(e.target.value) })} className="border p-2 rounded w-full mb-4">
                    {roles.map(r => <option key={r.id} value={r.id}>{r.value}</option>)}
                </select>
                <div className="flex justify-end gap-2 mt-2">
                    <button type="button" className="px-4 py-2 rounded bg-gray-300" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white">Save</button>
                </div>
            </form>
        </div>
    );
}

function Accounts() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    // Fetch user list and role list from backend
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                // Chỉ nhận staff account từ API (staff_only=true)
                setUsers(Array.isArray(data) ? data.map(u => ({
                    id: u.id,
                    avatar: u.profile_picture_url || `https://i.pravatar.cc/40?u=${u.email}`,
                    fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || u.email,
                    email: u.email,
                    role: u.role || "", // role is id
                    role_name: u.role_name || "", // get role name from backend if available
                    status: u.is_active ? "Active" : "Inactive",
                    createdAt: u.joined_on || u.date_joined || "",
                })) : []);
            })
            .catch((err) => {
                console.error("Error fetching staff accounts:", err);
                setUsers([]);
            });
        fetch(ROLES_API_URL)
            .then(res => res.json())
            .then(data => {
                // data: [{id, name, description, permissions}]
                setRoles(Array.isArray(data) ? data.map(r => ({
                    id: r.id,
                    value: r.name,
                    label: r.name, // hiển thị role name thay vì description
                    permissions: r.permissions || [],
                })) : []);
            })
            .catch((err) => {
                console.error("Error fetching roles:", err);
                setRoles([]);
            });
    }, []);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const handleEdit = user => {
        setEditUser(user);
    };

    const handleUpdate = data => {
        setUsers(users.map(u => u.id === data.id ? { ...u, ...data } : u));
        setEditUser(null);
    };

    const filteredUsers = users.filter(u =>
        (u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
        (filter ? u.role === filter || u.role_name === filter : true)
    );

    // hàm handleCreate được gọi, gửi dữ liệu qua API
    const handleCreate = async data => {
        // Tìm role id từ danh sách roles
        const roleId = data.role || null; // đã là id
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    first_name: data.fullName.split(" ")[0] || data.fullName,
                    last_name: data.fullName.split(" ").slice(1).join(" "),
                    profile_picture_url: `https://i.pravatar.cc/40?u=${data.email}`,
                    role: roleId,
                    password: data.password,
                    is_staff_account: true, // Mark as staff account
                    // Thêm các trường khác nếu backend yêu cầu
                })
            });
            if (res.ok) {
                // Sau khi tạo thành công, fetch lại danh sách user
                fetch(API_URL)
                    .then(res => res.json())
                    .then(data => {
                        // Chỉ nhận staff account từ API (staff_only=true)
                        setUsers(Array.isArray(data) ? data.map(u => ({
                            id: u.id,
                            avatar: u.profile_picture_url || `https://i.pravatar.cc/40?u=${u.email}`,
                            fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username || u.email,
                            email: u.email,
                            role: u.role || "",
                            status: u.is_active ? "Active" : "Inactive",
                            createdAt: u.joined_on || u.date_joined || "",
                        })) : []);
                    });
                setShowForm(false);
            } else {
                const errorData = await res.json();
                let msg = "";
                if (errorData.email && errorData.email[0].includes("already exists")) {
                    msg += "Email đã tồn tại. ";
                }
                if (errorData.username && errorData.username[0].includes("already exists")) {
                    msg += "Username đã tồn tại. ";
                }
                if (!msg) {
                    msg = "Lỗi tạo tài khoản: " + JSON.stringify(errorData);
                }
                alert(msg);
            }
        } catch (err) {
            alert("Network or server error: " + err.message);
        }
    };

    const handleDelete = async id => {
        if (window.confirm("Are you sure to delete this account?")) {
            try {
                const res = await fetch(`${API_URL.replace('?staff_only=true', '')}${id}/`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    setUsers(users.filter(u => u.id !== id));
                } else {
                    alert("Failed to delete account from server.");
                }
            } catch (err) {
                alert("Network error: " + err.message);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selected.length === 0) return;
        if (window.confirm("Delete selected accounts?")) {
            let successCount = 0;
            for (const id of selected) {
                try {
                    const res = await fetch(`${API_URL.replace('?staff_only=true', '')}${id}/`, {
                        method: "DELETE"
                    });
                    if (res.ok) successCount++;
                } catch (err) { }
            }
            setUsers(users.filter(u => !selected.includes(u.id)));
            setSelected([]);
            if (successCount !== selected.length) {
                alert(`Deleted ${successCount}/${selected.length} accounts from server.`);
            }
        }
    };

    return (
        <div className="w-full flex flex-col flex-grow">
            <PageTitle>Accounts</PageTitle>
            <main className="flex flex-col flex-grow">
                <div className="mt-6 bg-white rounded shadow p-6 w-full flex flex-col flex-grow">
                    <div className="flex flex-wrap items-center gap-4 mb-4 justify-between w-full">
                        <div className="flex gap-4 flex-wrap">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="border p-2 rounded w-64"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <select
                                className="border p-2 rounded"
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={() => setShowForm(true)}>
                                + Create New Account
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleBulkDelete} disabled={selected.length === 0}>
                                Delete Selected
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto w-full flex-grow">
                        <table className="w-full bg-white rounded shadow table-fixed">
                            <thead>
                                <tr>
                                    <th className="p-2 w-10"></th>
                                    <th className="p-2 w-16 text-left">Avatar</th>
                                    <th className="p-2 w-40 text-left">Full Name</th>
                                    <th className="p-2 w-56 text-left">Email</th>
                                    <th className="p-2 w-32 text-left">Role</th>
                                    <th className="p-2 w-24 text-left">Status</th>
                                    <th className="p-2 w-32 text-left">Created At</th>
                                    <th className="p-2 w-32 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => {
                                    const roleObj = roles.find(r => r.id === u.role);
                                    return (
                                        <tr key={u.id}>
                                            <td className="p-2 w-10"><input type="checkbox" checked={selected.includes(u.id)} onChange={e => setSelected(e.target.checked ? [...selected, u.id] : selected.filter(id => id !== u.id))} /></td>
                                            <td className="p-2 w-16 text-left"><img src={u.avatar} alt="avatar" className="rounded-full w-8 h-8" /></td>
                                            <td className="p-2 w-40 text-left">{u.fullName}</td>
                                            <td className="p-2 w-56 text-left">{u.email}</td>
                                            <td className="p-2 w-32 text-left">
                                                {roleObj ? (
                                                    <span title={roleObj.permissions.map(p=>p.name).join(", ")}>{roleObj.value}</span>
                                                ) : (
                                                    u.role_name || u.role
                                                )}
                                            </td>
                                            <td className="p-2 w-24 text-left">{u.status}</td>
                                            <td className="p-2 w-32 text-left">{u.createdAt}</td>
                                            <td className="p-2 w-32 text-left">
                                                <button className="mr-2 text-blue-600" onClick={() => handleEdit(u)}>Edit</button>
                                                <button className="text-red-600" onClick={() => handleDelete(u.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {showForm && <AccountForm roles={roles} onSave={handleCreate} onCancel={() => setShowForm(false)} />}
            {editUser && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50" style={{ pointerEvents: 'auto' }}>
                    <div
                        className="absolute top-0 left-0 right-0 bottom-0"
                        style={{ background: 'rgba(0,0,0,0.10)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setEditUser(null)}
                    ></div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleUpdate(editUser);
                        }}
                        className="relative bg-white p-6 rounded-xl shadow-lg w-[350px] min-w-[300px] z-10"
                    >
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Account</h2>
                        <label className="block mb-2 font-semibold">Full Name</label>
                        <input name="fullName" value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} className="border p-2 rounded w-full mb-2" required />
                        <label className="block mb-2 font-semibold">Email</label>
                        <input name="email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} className="border p-2 rounded w-full mb-2" required type="email" />
                        <label className="block mb-2 font-semibold">Role</label>
                        <select name="role" value={editUser.role} onChange={e => setEditUser({ ...editUser, role: Number(e.target.value) })} className="border p-2 rounded w-full mb-2">
                            {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>
                        <label className="block mb-2 font-semibold">Status</label>
                        <select name="status" value={editUser.status} onChange={e => setEditUser({ ...editUser, status: e.target.value })} className="border p-2 rounded w-full mb-4">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <div className="flex justify-end gap-2 mt-2">
                            <button type="button" className="px-4 py-2 rounded bg-gray-300" onClick={() => setEditUser(null)}>Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded bg-purple-600 text-white">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Accounts;
