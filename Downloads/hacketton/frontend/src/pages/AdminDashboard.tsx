import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<'teachers' | 'students'>('students')
  const [teachers, setTeachers] = useState<any[]>([])
  const [pendingStudents, setPendingStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tab === 'teachers') loadTeachers()
    else loadPendingStudents()
  }, [tab])

  const loadTeachers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/teachers')
      setTeachers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadPendingStudents = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/students/pending')
      setPendingStudents(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const approveStudent = async (id: number) => {
    try {
      await api.put(`/admin/students/${id}/approve`)
      alert('Student approved!')
      loadPendingStudents()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to approve')
    }
  }

  const rejectStudent = async (id: number) => {
    const reason = prompt('Rejection reason:')
    if (!reason) return

    try {
      await api.put(`/admin/students/${id}/reject`, { student_id: id, reason })
      alert('Student rejected')
      loadPendingStudents()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to reject')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <span>{user?.name}</span>
            <button onClick={logout} className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('students')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              tab === 'students'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Pending Students ({pendingStudents.length})
          </button>
          <button
            onClick={() => setTab('teachers')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              tab === 'teachers'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Teachers ({teachers.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : tab === 'students' ? (
          <div className="grid gap-4">
            {pendingStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
                {student.face_image_base64 && (
                  <img
                    src={`data:image/jpeg;base64,${student.face_image_base64}`}
                    alt={student.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{student.name}</h3>
                  <p className="text-gray-600">ID: {student.student_id_card_number}</p>
                  <p className="text-gray-600">Email: {student.email || 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveStudent(student.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectStudent(student.id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingStudents.length === 0 && (
              <div className="text-center py-12 text-gray-500">No pending students</div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Department</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-t">
                    <td className="px-6 py-4">{teacher.name}</td>
                    <td className="px-6 py-4">{teacher.email}</td>
                    <td className="px-6 py-4">{teacher.department || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        teacher.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {teacher.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {teachers.length === 0 && (
              <div className="text-center py-12 text-gray-500">No teachers</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
